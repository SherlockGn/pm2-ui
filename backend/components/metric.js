import { list as listProcesses } from './process.js'
import { get as getSetting } from './settings.js'
import { addMetrics, getMetrics } from './database.js'
import { getSettings } from './kv.js'

let buffer = []
let lastInsert = Date.now()

const monitor = async () => {
    const processes = await listProcesses()
    const now = Date.now()
    for (const p of processes) {
        const setting = await getSetting(p)
        if (!setting.enableMonitor) {
            continue
        }

        for (const m of p.metrics) {
            if (m.value === 0) {
                continue
            }
            buffer.push({
                processId: p.id,
                metricName: m.name,
                metricValue: m.value,
                timestamp: now
            })
        }
    }

    if (
        now - lastInsert > getSettings().monitorBufferMaxAge ||
        buffer.length > getSettings().monitorBufferMaxSize
    ) {
        addMetrics(buffer)
        buffer = []
        lastInsert = Date.now()
    }
}

export const init = async () => {
    console.log('Metric monitor started')
    while (true) {
        await monitor()
        await new Promise(resolve =>
            setTimeout(resolve, getSettings().monitorCollectDelay)
        )
    }
}

export const get = async (
    process,
    metricName,
    start,
    end,
    aggregate,
    sample
) => {
    return getMetrics(process.id, metricName, start, end, aggregate, sample)
}
