import { getSetting, createOrUpdateSetting } from './database.js'

const defaultObject = {
    enableMonitor: false
}

const fromDataObject = setting => {
    if (setting == null) {
        return structuredClone(defaultObject)
    }
    return {
        enableMonitor: !!setting.enableMonitor
    }
}

const toDataObject = setting => {
    return {
        enableMonitor: +setting.enableMonitor
    }
}

export const get = async process => {
    return fromDataObject(getSetting(process.id))
}

export const createOrUpdate = async (process, setting) => {
    if (setting == null) {
        setting = {}
    }
    if (setting.enableMonitor == null) {
        setting.enableMonitor = +defaultObject.enableMonitor
    }
    createOrUpdateSetting(process.id, toDataObject(setting))
}
