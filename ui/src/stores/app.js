import { defineStore } from 'pinia'
import {
    getDefaultUIObject,
    toUIObject,
    fromUIObject,
    toJsonObject,
    fromProcess
} from '../../../parameters.js'

import { toRaw } from 'vue'

export const useAppStore = defineStore('app', () => {
    const getDefaultUIParameters = getDefaultUIObject

    const getDefaultUIApp = () => {
        return {
            id: 0,
            userId: 0,
            guids: [],
            ...getDefaultUIObject()
        }
    }

    const toUIObjectApp = app => {
        app = structuredClone(toRaw(app))
        return {
            id: app.id ?? 0,
            userId: app.userId ?? 0,
            guids: app.guids ?? [],
            ...toUIObject(app)
        }
    }

    const fromUIObjectApp = app => {
        app = structuredClone(toRaw(app))
        return {
            id: app.id ?? 0,
            userId: app.userId ?? 0,
            guids: app.guids ?? [],
            ...fromUIObject(app)
        }
    }

    const toJsonObjectApp = app => {
        return JSON.stringify(toJsonObject(toRaw(app)))
    }

    const getAppFromProcess = process => {
        return {
            id: 0,
            userId: 0,
            guids: [],
            ...fromProcess(process)
        }
    }

    return {
        getDefaultUIParameters,
        getDefaultUIApp,
        toUIObjectApp,
        fromUIObjectApp,
        toJsonObjectApp,
        getAppFromProcess
    }
})
