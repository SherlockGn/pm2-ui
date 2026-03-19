import { defineStore } from 'pinia'
import { request } from './http.js'

import { ref } from 'vue'

export const useBackupStore = defineStore('backup', () => {
    const backups = ref([])

    const refresh = async () => {
        let data = (await request.get('backup'))?.data
        if (!data) {
            return false
        }

        backups.value = data

        return true
    }

    const getDownloadText = async (
        id,
        includeApps,
        includeDeployments,
        type
    ) => {
        let data = (
            await request.get(`backup/${id}`, {
                params: {
                    includeApps,
                    includeDeployments,
                    type
                }
            })
        )?.data
        if (!data) {
            return false
        }

        return data
    }

    const update = async (id, name) => {
        return !!(await request.put(`backup/${id}`, { name }))
    }

    const deleteItem = async id => {
        return !!(await request.delete(`backup/${id}`))
    }

    const backupSnapshot = async name => {
        return !!(await request.post('backup', { name }))
    }

    const upload = async (name, type, backupObject) => {
        return !!(await request.post('backup/upload', {
            name,
            type,
            backupObject
        }))
    }

    const restore = async id => {
        return !!(await request.post(`backup/${id}/restore`))
    }

    return {
        backups,
        refresh,
        getDownloadText,
        update,
        deleteItem,
        backupSnapshot,
        upload,
        restore
    }
})
