import {
    getCountOfExpiredAdminLogs,
    getCountOfExpiredCommunications,
    getCountOfExpiredMetrics,
    getCountOfExpiredSettings,
    cleanAdminLogs,
    cleanCommunications,
    cleanMetrics,
    cleanSettings
} from './database.js'

import { list as listProcesses } from './process.js'
import { getSettings } from './kv.js'
import { create as createAdminLog } from './adminLog.js'

export const getExpiredCounts = async () => {
    const existingIds = (await listProcesses()).map(process => process.id)
    const timestamp = Date.now() - getSettings().dbCleanUpEarlierThan
    return {
        adminLogs: await getCountOfExpiredAdminLogs(timestamp),
        communications: await getCountOfExpiredCommunications(
            existingIds,
            timestamp
        ),
        metrics: await getCountOfExpiredMetrics(existingIds, timestamp),
        settings: await getCountOfExpiredSettings(existingIds)
    }
}

export const cleanExpired = async () => {
    const existingIds = (await listProcesses()).map(process => process.id)
    const timestamp = Date.now() - getSettings().dbCleanUpEarlierThan
    const limit = 100

    let adminLogs = 0
    let communications = 0
    let metrics = 0
    let settings = 0

    let delCount = 0
    do {
        delCount = (await cleanAdminLogs(timestamp, limit)).changes
        adminLogs += delCount
    } while (delCount > 0)

    do {
        delCount = (await cleanCommunications(existingIds, timestamp, limit))
            .changes
        communications += delCount
    } while (delCount > 0)

    do {
        delCount = (await cleanMetrics(existingIds, timestamp, limit)).changes
        metrics += delCount
    } while (delCount > 0)

    do {
        delCount = (await cleanSettings(existingIds, limit)).changes
        settings += delCount
    } while (delCount > 0)

    return {
        adminLogs,
        communications,
        metrics,
        settings
    }
}

export const autoCleanExpired = async () => {
    if (!getSettings().enableAutoDbCleanup) {
        return
    }
    let data = null
    let successful = true
    let errorMsg = null
    try {
        data = await cleanExpired()
    } catch (err) {
        successful = false
        errorMsg = err.message
    } finally {
        await createAdminLog({
            userId: null,
            userDisplayName: null,
            action: 'delete',
            category: 'cleanup',
            successful,
            resourceName: null,
            resourceData: data,
            errorMsg
        })
    }
}
