export const createDailyScheduler = (hour, minute, handler) => {
    let first = true
    let timer
    let target, duration
    const runSingle = async () => {
        const d = new Date()
        const today = new Date(
            d.getFullYear(),
            d.getMonth(),
            d.getDate(),
            hour,
            minute
        ).getTime()
        const nextDay = today + 24 * 60 * 60 * 1000
        if (first && d.getTime() < today) {
            target = today
        } else {
            target = nextDay
        }
        first = false
        duration = target - d.getTime()
        await new Promise(resolve => {
            timer = setTimeout(resolve, duration)
        })
        await handler()
    }
    const run = async () => {
        while (true) {
            await runSingle()
        }
    }
    run()
    return {
        info: () => {
            return {
                target,
                duration
            }
        },
        stop: () => {
            clearTimeout(timer)
        }
    }
}
