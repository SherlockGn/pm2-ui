import { defineStore } from 'pinia'
import { request } from './http.js'

import { ref } from 'vue'

export const useKvStore = defineStore('kv', () => {
    const settings = ref({
        enableCors: true,
        tokenExpireTime: 60 * 60 * 1000,
        enableAutoBackup: true,
        subscribedMsgNames: ['process:msg'],
        enableAutoDbCleanup: true,
        dbCleanUpEarlierThan: 7 * 24 * 60 * 60 * 1000,
        monitorCollectDelay: 5000,
        monitorBufferMaxSize: 100,
        monitorBufferMaxAge: 10 * 60 * 1000
    })

    const refresh = async () => {
        let data = (await request.get('kv'))?.data
        if (!data) {
            return false
        }

        settings.value = data
        return true
    }

    const updateJwtKey = async () => {
        return !!(await request.post('kv/jwtKey'))
    }

    const updateEnableCors = async value => {
        return !!(await request.put('kv/enableCors', { value }))
    }

    const updateEnableAutoBackup = async value => {
        return !!(await request.put('kv/enableAutoBackup', { value }))
    }

    const updateTokenExpireTime = async value => {
        return !!(await request.put('kv/tokenExpireTime', { value }))
    }

    const updateSubscribedMsgNames = async value => {
        return !!(await request.put('kv/subscribedMsgNames', { value }))
    }

    const updateEnableAutoDbCleanup = async value => {
        return !!(await request.put('kv/enableAutoDbCleanup', { value }))
    }

    const updateDbCleanUpEarlierThan = async value => {
        return !!(await request.put('kv/dbCleanUpEarlierThan', {
            value
        }))
    }

    const updateMonitorCollectDelay = async value => {
        return !!(await request.put('kv/monitorCollectDelay', { value }))
    }

    const updateMonitorBufferMaxSize = async value => {
        return !!(await request.put('kv/monitorBufferMaxSize', {
            value
        }))
    }

    const updateMonitorBufferMaxAge = async value => {
        return !!(await request.put('kv/monitorBufferMaxAge', { value }))
    }

    return {
        settings,
        refresh,
        updateJwtKey,
        updateEnableCors,
        updateEnableAutoBackup,
        updateTokenExpireTime,
        updateSubscribedMsgNames,
        updateEnableAutoDbCleanup,
        updateDbCleanUpEarlierThan,
        updateMonitorCollectDelay,
        updateMonitorBufferMaxSize,
        updateMonitorBufferMaxAge
    }
})
