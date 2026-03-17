import {
    createCommunication,
    getCommunicationAndCount,
    updateCommunication
} from './database.js'

import { getBus, sendDataToProcessId, sendSignalToProcessId } from './pm2.js'
import { getSettings } from './kv.js'
import { getByPmId as getProcessByPmId } from './process.js'

const fromDataObject = item => {
    return {
        id: item.id,
        processId: item.processId,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
        userId: item.userId,
        type: item.type,
        name: item.name,
        data: item.data === null ? undefined : JSON.parse(item.data),
        rsp: item.rsp === null ? undefined : JSON.parse(item.rsp)
    }
}

const rpcQueue = []

let bus = null

export const resetBus = async () => {
    rpcQueue.splice(0, rpcQueue.length)
    bus.listeners
        .map(i => i.event)
        .forEach(e => {
            bus.off(e)
        })
    getSettings().subscribedMsgNames.forEach(name => {
        bus.on(name, async pkg => {
            const pmId = pkg.process.pm_id
            let data
            if (pkg.raw) {
                data = pkg.raw.data
            } else {
                data = pkg.data
            }
            const process = await getProcessByPmId(pmId)
            createCommunication({
                name,
                data: data === undefined ? null : JSON.stringify(data),
                processId: process.id,
                userId: null,
                type: 'recMsg'
            })
        })
    })
    bus.on('axm:reply', async pkg => {
        const data = pkg.data
        const name = data.action_name
        const rsp = data.return
        const idx = rpcQueue.findIndex(i => i.name === name)
        if (idx < 0) {
            return
        }
        const { lastInsertRowid } = rpcQueue[idx]
        rpcQueue.splice(idx, 1)
        updateCommunication(
            lastInsertRowid,
            rsp === undefined ? null : JSON.stringify(rsp)
        )
    })
    console.log(bus.listeners.map(i => i.event))
}

export const init = async () => {
    bus = await getBus()
    await resetBus()
}

export const trigger = async (process, name, userId, param) => {
    const { lastInsertRowid } = createCommunication({
        name,
        data: param === undefined ? null : JSON.stringify(param),
        processId: process.id,
        userId,
        type: 'rpc',
        rsp: null
    })
    rpcQueue.push({ name, lastInsertRowid })
    sendDataToProcessId({
        id: process.pmId,
        type: 'process:msg',
        topic: true,
        data: null,
        msg: name,
        opts: param
    })
}

export const send = async (process, userId, data) => {
    await sendDataToProcessId({
        id: process.pmId,
        type: 'process:msg',
        topic: true,
        data
    })
    createCommunication({
        name: null,
        data: JSON.stringify(data),
        processId: process.id,
        userId,
        type: 'reqMsg'
    })
}

export const sendSignal = async (process, userId, signal) => {
    await sendSignalToProcessId(process.pmId, signal)
    createCommunication({
        name: signal,
        data: JSON.stringify(signal),
        processId: process.id,
        userId,
        type: 'sig'
    })
}

export const get = async (process, typeList, namePattern, offset, limit) => {
    const { items, count } = getCommunicationAndCount(
        process.id,
        typeList,
        namePattern,
        offset,
        limit
    )
    return {
        items: items.map(fromDataObject),
        count
    }
}
