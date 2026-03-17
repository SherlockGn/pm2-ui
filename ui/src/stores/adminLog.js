import { defineStore } from 'pinia'
import { request } from './http.js'

import { ref } from 'vue'

export const useAdminLogStore = defineStore('adminLog', () => {
    const adminLogs = ref([])
    const count = ref(0)

    const refresh = async (
        actionList,
        categoryList,
        successful,
        resourceNamePattern,
        offset,
        limit
    ) => {
        const data = (
            await request.post('/adminLog/query', {
                actionList,
                categoryList,
                successful,
                resourceNamePattern,
                offset,
                limit
            })
        )?.data
        if (data) {
            adminLogs.value = data.items
            count.value = data.count
            return true
        }
        return false
    }

    return {
        adminLogs,
        count,
        refresh
    }
})
