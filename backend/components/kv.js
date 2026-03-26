import { randomBytes } from 'node:crypto'

import { createOrUpdateKv, getKv } from './database.js'

export const getJwtKey = async () => {
    return getKv('jwt_key').value
}

export const updateJwtKey = async () => {
    createOrUpdateKv('jwt_key', randomBytes(32).toString('hex'))
}

export const refresh = async () => {
    enableCors = (await getKv('enable_cors').value) === '1'
    tokenExpireTime = +(await getKv('token_expire_time').value)
    enableAutoBackup = (await getKv('enable_auto_backup').value) === '1'
    subscribedMsgNames = JSON.parse(await getKv('subscribed_msg_names').value)
    enableAutoDbCleanup = (await getKv('enable_auto_db_cleanup').value) === '1'
    enableAutoVacuum = (await getKv('enable_auto_vacuum').value) === '1'
    dbCleanUpEarlierThan = +(await getKv('db_clean_up_earlier_than').value)
    monitorCollectDelay = +(await getKv('monitor_collect_delay').value)
    monitorBufferMaxSize = +(await getKv('monitor_buffer_max_size').value)
    monitorBufferMaxAge = +(await getKv('monitor_buffer_max_age').value)
}

export const getSettings = () => {
    return {
        enableCors,
        tokenExpireTime,
        enableAutoBackup,
        subscribedMsgNames,
        enableAutoDbCleanup,
        enableAutoVacuum,
        dbCleanUpEarlierThan,
        monitorCollectDelay,
        monitorBufferMaxSize,
        monitorBufferMaxAge
    }
}

let enableCors = true
export const updateEnableCors = async value => {
    createOrUpdateKv('enable_cors', value ? '1' : '0')
    enableCors = value
}

let tokenExpireTime = 60 * 60 * 1000
export const updateTokenExpireTime = async value => {
    createOrUpdateKv('token_expire_time', value.toString())
    tokenExpireTime = value
}

let enableAutoBackup = true
export const updateEnableAutoBackup = async value => {
    createOrUpdateKv('enable_auto_backup', value ? '1' : '0')
    enableAutoBackup = value
}

let subscribedMsgNames = ['process:msg']
export const updateSubscribedMsgNames = async value => {
    createOrUpdateKv('subscribed_msg_names', JSON.stringify(value))
    subscribedMsgNames = value
}

let enableAutoDbCleanup = true
export const updateEnableAutoDbCleanup = async value => {
    createOrUpdateKv('enable_auto_db_cleanup', value ? '1' : '0')
    enableAutoDbCleanup = value
}

let dbCleanUpEarlierThan = 7 * 24 * 60 * 60 * 1000
export const updateDbCleanUpEarlierThan = async value => {
    createOrUpdateKv('db_clean_up_earlier_than', value.toString())
    dbCleanUpEarlierThan = value
}

let monitorCollectDelay = 5000
export const updateMonitorCollectDelay = async value => {
    createOrUpdateKv('monitor_collect_delay', value.toString())
    monitorCollectDelay = value
}

let monitorBufferMaxSize = 100
export const updateMonitorBufferMaxSize = async value => {
    createOrUpdateKv('monitor_buffer_max_size', value.toString())
    monitorBufferMaxSize = value
}

let monitorBufferMaxAge = 10 * 60 * 1000
export const updateMonitorBufferMaxAge = async value => {
    createOrUpdateKv('monitor_buffer_max_age', value.toString())
    monitorBufferMaxAge = value
}

let enableAutoVacuum = true
export const updateEnableAutoVacuum = async value => {
    createOrUpdateKv('enable_auto_vacuum', value ? '1' : '0')
    enableAutoVacuum = value
}

export const init = async () => {
    createOrUpdateKv('jwt_key', randomBytes(32).toString('hex'))
    createOrUpdateKv('enable_cors', '1')
    createOrUpdateKv('token_expire_time', `${60 * 60 * 1000}`)
    createOrUpdateKv('enable_auto_backup', '1')
    createOrUpdateKv('subscribed_msg_names', '[\"process:msg\"]')
    createOrUpdateKv('enable_auto_db_cleanup', '1')
    createOrUpdateKv('db_clean_up_earlier_than', `${7 * 24 * 60 * 60 * 1000}`)
    createOrUpdateKv('monitor_collect_delay', '5000')
    createOrUpdateKv('monitor_buffer_max_size', '100')
    createOrUpdateKv('monitor_buffer_max_age', `${10 * 60 * 1000}`)
    createOrUpdateKv('enable_auto_vacuum', '1')
}
