import { defineStore } from 'pinia'
import { request } from './http.js'

import { ref } from 'vue'

export const useFsStore = defineStore('fs', () => {
    const sep = ref('/')

    const refresh = async () => {
        let data = (await request.get('fs/sep'))?.data?.sep
        if (!data) {
            return false
        }

        sep.value = data
        return true
    }

    const readdir = async paths => {
        const data = (await request.post('fs', paths))?.data
        if (!data) {
            throw new Error('readdir failed: ' + paths.join(','))
        }

        return data
    }

    return {
        sep,
        refresh,
        readdir
    }
})
