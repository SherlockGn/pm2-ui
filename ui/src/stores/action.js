import { defineStore } from 'pinia'
import { request } from './http.js'

export const useActionStore = defineStore('action', () => {
    const resetCounter = async id => {
        return (await request.post(`action/resetCounter/${id}`))?.data
    }

    const flushLog = async id => {
        return (await request.post(`action/flushLog/${id}`))?.data
    }

    const startup = async () => {
        return (await request.post('action/startup'))?.data
    }

    const unstartup = async () => {
        return (await request.post('action/unstartup'))?.data
    }

    const save = async () => {
        return (await request.post('action/save'))?.data
    }

    const resurrect = async () => {
        return (await request.post('action/resurrect'))?.data
    }

    const kill = async () => {
        return (await request.post('action/kill'))?.data
    }

    const ping = async () => {
        return (await request.post('action/ping'))?.data
    }

    const update = async () => {
        return (await request.post('action/update'))?.data
    }

    return {
        resetCounter,
        flushLog,
        startup,
        unstartup,
        save,
        resurrect,
        kill,
        ping,
        update
    }
})
