import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { request } from './http.js'
import { useFsStore } from './fs.js'

export const useProcessStore = defineStore('process', () => {
    const processes = ref([])

    const refresh = async () => {
        let data = (await request.get('process'))?.data
        if (!data) {
            return false
        }

        processes.value = data
        return true
    }

    const managedProcesses = computed(() =>
        processes.value.filter(p => p.status.toLowerCase() !== 'not run')
    )

    const create = async (app, start) => {
        return !!(await request.post(`process/create?start=${!!start}`, app))
    }

    const start = async id => {
        return !!(await request.post(`process/start/${id}`))
    }

    const stop = async id => {
        return !!(await request.post(`process/stop/${id}`))
    }

    const restart = async id => {
        return !!(await request.post(`process/restart/${id}`))
    }

    const reload = async id => {
        return !!(await request.post(`process/reload/${id}`))
    }

    const manage = async (id, app) => {
        return !!(await request.post(`process/manage/${id}`, app))
    }

    const update = async (id, app) => {
        return !!(await request.put(`process/${id}`, app))
    }

    const deleteItem = async id => {
        return !!(await request.delete(`process/${id}`))
    }

    const readLogs = async (id, lineCount) => {
        const empty = {
            output: [],
            error: [],
            combined: []
        }
        if (id == null || id < 0) {
            return empty
        }
        return (
            (await request.get(`process/log/${id}?lineCount=${lineCount}`))
                ?.data ?? empty
        )
    }

    const activeProcess = ref(null)
    const descriptionBladeOpen = ref(false)

    const getFileName = script => {
        return script.split(useFsStore().sep).pop()
    }

    return {
        processes,
        managedProcesses,
        refresh,
        create,
        update,
        start,
        stop,
        restart,
        reload,
        manage,
        deleteItem,
        activeProcess,
        descriptionBladeOpen,
        readLogs,
        getFileName
    }
})
