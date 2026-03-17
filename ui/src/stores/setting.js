import { defineStore } from 'pinia'
import { request } from './http.js'

import { ref } from 'vue'

export const useSettingStore = defineStore('setting', () => {
    const defaultSetting = {
        enableMonitor: false
    }
    const setting = ref(structuredClone(defaultSetting))

    const refresh = async id => {
        if (id == null) {
            setting.value = structuredClone(defaultSetting)
            return true
        }
        let data = (await request.get(`setting/${id}`))?.data
        if (!data) {
            return false
        }

        setting.value = data
        return true
    }

    const update = async id => {
        return !!(await request.put(`setting/${id}`, setting.value))
    }

    return {
        setting,
        refresh,
        update
    }
})
