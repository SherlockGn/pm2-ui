import {
    getApps,
    createApp,
    updateApp,
    deleteApp,
    getAppById,
    getAppByGuid
} from './database.js'

import {
    toDataObject as tdo,
    fromDataObject as fdo
} from '../../parameters.js'

const fromDataObject = app => {
    if (!app) {
        return null
    }

    return {
        id: app.id,
        guids: app.guids == null ? null : JSON.parse(app.guids),
        userId: app.userId,
        createdAt: app.createdAt,
        updatedAt: app.updatedAt,
        ...fdo(app)
    }
}

const toDataObject = app => {
    if (!app) {
        return null
    }
    return {
        id: app.id,
        guids: app.guids == null ? null : JSON.stringify(app.guids),
        userId: app.userId,
        createdAt: app.createdAt,
        updatedAt: app.updatedAt,
        ...tdo(app)
    }
}

export const getByGuid = async app => {
    return fromDataObject(getAppByGuid(app))
}

export const getById = async id => {
    return fromDataObject(getAppById(id))
}

export const list = async () => {
    return getApps().map(fromDataObject)
}

export const create = async (app, timestamp = null) => {
    return createApp(toDataObject(app), timestamp)
}

export const update = async (app, timestamp = null) => {
    return updateApp(toDataObject(app), timestamp)
}

export const deleteById = async id => {
    return deleteApp(id)
}
