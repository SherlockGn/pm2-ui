import { defineStore } from 'pinia'
import { request } from './http.js'

import { ref } from 'vue'

export const useCommunicationStore = defineStore('communication', () => {
    const communications = ref([])
    const count = ref(0)

    const refresh = async (pmId, typeList, namePattern, offset, limit) => {
        let data = (
            await request.post(`communication/query/${pmId}`, {
                typeList,
                namePattern,
                offset,
                limit
            })
        )?.data
        if (!data) {
            return false
        }

        communications.value = data.items
        count.value = data.count

        return true
    }

    const sendSignal = async (pmId, signal) => {
        return !!(await request.post(`communication/sendSignal/${pmId}`, {
            signal
        }))
    }

    const sendData = async (pmId, data) => {
        return !!(await request.post(`communication/send/${pmId}`, { data }))
    }

    const sendRpc = async (pmId, name, param) => {
        return !!(await request.post(`communication/trigger/${pmId}`, {
            name,
            param
        }))
    }

    return {
        communications,
        count,
        refresh,
        sendSignal,
        sendData,
        sendRpc
    }
})
