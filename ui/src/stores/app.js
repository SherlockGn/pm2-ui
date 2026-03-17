import { defineStore } from 'pinia'
import {
    getDefaultUIObject,
    toUIObject,
    fromUIObject,
    toJsonObject,
    fromProcess
} from '../../../parameters.js'

import { ref, toRaw } from 'vue'

export const useAppStore = defineStore('app', () => {
    // UI object
    const appBlade = ref(null)

    const appBladeOpen = ref(false)

    const appBladeMode = ref('create')

    const defaultApp = getDefaultUIObject()

    const tuo = app => {
        app = structuredClone(toRaw(app))
        return {
            id: app.id ?? 0,
            userId: app.userId ?? 0,
            guids: app.guids ?? [],
            ...toUIObject(app)
        }
    }

    const fuo = app => {
        app = structuredClone(toRaw(app))
        return {
            id: app.id ?? 0,
            userId: app.userId ?? 0,
            guids: app.guids ?? [],
            ...fromUIObject(app)
        }
    }

    const getCurrentApp = () => {
        return fuo(toRaw(appBlade.value))
    }

    const getCurrentAppJson = () => {
        return JSON.stringify(toJsonObject(getCurrentApp()))
    }

    const getAppFromProcess = process => {
        return {
            id: process.id ?? 0,
            userId: process.userId ?? 0,
            guids: process.guids ?? [],
            ...fromProcess(process)
        }
    }

    const setAppForUpdate = app => {
        appBladeMode.value = 'update'
        appBlade.value = tuo(app)
    }

    const setAppForCreate = () => {
        appBladeMode.value = 'create'
        appBlade.value = structuredClone(defaultApp)
    }

    return {
        appBladeOpen,
        appBladeMode,
        appBlade,
        setAppForUpdate,
        setAppForCreate,
        getCurrentApp,
        getAppFromProcess,
        getCurrentAppJson
    }
})
