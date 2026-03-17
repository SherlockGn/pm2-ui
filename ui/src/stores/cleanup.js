import { defineStore } from 'pinia'
import { request } from './http.js'

import { ref } from 'vue'

export const useCleanupStore = defineStore('cleanup', () => {
    const info = ref({
        adminLogs: 0,
        communications: 0,
        metrics: 0,
        settings: 0
    })

    const refresh = async () => {
        let data = (await request.get('cleanup'))?.data
        if (!data) {
            return false
        }

        info.value = data
        return true
    }

    const cleanup = async () => {
        return !!(await request.delete('cleanup'))
    }

    return {
        info,
        refresh,
        cleanup
    }
})
