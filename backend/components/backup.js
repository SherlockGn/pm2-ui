import { list as listProcesses, create as createProcess } from './process.js'
import {
    list as listDeployments,
    create as createDeployment,
    toJsonObject as toDeploymentJsonObject,
    fromJsonObject as fromDeploymentJsonObject
} from './deployment.js'

import { fromJsonObject, fromProcess, toJsonObject } from '../../parameters.js'

import { getSettings } from './kv.js'
import { create as createAdminLog } from './adminLog.js'

import {
    getBackups,
    getBackupById,
    createBackup,
    deleteBackup,
    updateBackup
} from './database.js'

const fromDataObject = backup => {
    if (!backup) {
        return null
    }
    return {
        id: backup.id,
        name: backup.name,
        userId: backup.userId,
        createdAt: backup.createdAt,
        updatedAt: backup.updatedAt,
        metadata: backup.metadata == null ? null : JSON.parse(backup.metadata),
        apps: backup.apps == null ? null : JSON.parse(backup.apps),
        deployments:
            backup.deployments == null ? null : JSON.parse(backup.deployments)
    }
}

const toDataObject = backup => {
    if (!backup) {
        return null
    }
    const apps = backup.apps == null ? null : JSON.stringify(backup.apps)
    const deployments =
        backup.deployments == null ? null : JSON.stringify(backup.deployments)
    const metadata = backup.metadata ?? {}
    metadata.size = apps?.length ?? 0 + deployments?.length ?? 0
    return {
        id: backup.id,
        name: backup.name,
        userId: backup.userId,
        createdAt: backup.createdAt,
        updatedAt: backup.updatedAt,
        metadata: JSON.stringify(backup.metadata),
        apps,
        deployments
    }
}

export const list = async () => {
    return getBackups().map(fromDataObject)
}

export const getById = async id => {
    return fromDataObject(await getBackupById(id))
}

export const update = async (backup, updated) => {
    backup.name = updated.name
    updateBackup(toDataObject(backup))
}

export const autoBackupSnapshot = async () => {
    if (!getSettings().enableAutoBackup) {
        return
    }
    const name = `Backup-${new Date().toLocaleDateString()}`
    let successful = true
    let errorMsg = null
    try {
        await backupSnapshot(name, null)
    } catch (err) {
        successful = false
        errorMsg = err.message
    } finally {
        await createAdminLog({
            userId: null,
            userDisplayName: null,
            action: 'create',
            category: 'backup',
            successful,
            resourceName: null,
            resourceData: { name },
            errorMsg
        })
    }
}

export const backupSnapshot = async (name, userId) => {
    const processes = await listProcesses()
    const apps = processes.map(process => {
        if (process.app) {
            return process.app
        }
        return fromProcess(process)
    })
    apps.forEach(app => {
        delete app.id
        delete app.guids
        delete app.userId
        delete app.createdAt
        delete app.updatedAt
    })

    const deployments = await listDeployments()
    deployments.forEach(deployment => {
        delete deployment.id
        delete deployment.userId
        delete deployment.createdAt
        delete deployment.updatedAt
    })

    const metadata = {
        appNames: apps.map(app => app.name),
        appScripts: apps.map(app => app.script),
        appCount: apps.length,
        deploymentNames: deployments.map(deployment => deployment.name),
        deploymentCount: deployments.length
    }

    createBackup(
        toDataObject({
            name,
            userId,
            apps,
            deployments,
            metadata
        })
    )
}

export const downloadText = async (backup, options) => {
    const {
        includeApps = true,
        includeDeployments = true,
        type = 'json'
    } = options

    const backupObject = {}
    if (includeApps) {
        if (type === 'raw') {
            backupObject.apps = backup.apps
        } else {
            backupObject.apps = backup.apps.map(toJsonObject)
        }
    }
    if (includeDeployments) {
        if (type === 'raw') {
            backupObject.deployments = backup.deployments
        } else {
            backupObject.deployments = toDeploymentJsonObject(
                backup.deployments
            )
        }
    }
    if (type === 'raw') {
        backupObject.type = 'raw'
    }

    let text = null
    if (type === 'raw' || type === 'json') {
        text = JSON.stringify(backupObject)
    } else if (type === 'cjs') {
        text = `module.exports = ${JSON.stringify(backupObject)}`
    } else if (type === 'esm') {
        text = `export default ${JSON.stringify(backupObject)}`
    }

    return { text }
}

export const deleteItem = async id => {
    deleteBackup(id)
}

export const upload = async (name, type, userId, backupObject) => {
    let apps, deployments
    if (type === 'raw') {
        apps = backupObject.apps
        deployments = backupObject.deployments
    } else {
        apps = backupObject.apps.map(fromJsonObject)
        deployments = fromDeploymentJsonObject(backupObject.deployments)
    }
    const metadata = {
        appNames: apps.map(app => app.name),
        appScripts: apps.map(app => app.script),
        appCount: apps.length,
        deploymentNames: deployments.map(deployment => deployment.name),
        deploymentCount: deployments.length
    }
    createBackup(
        toDataObject({
            name,
            userId,
            apps,
            deployments,
            metadata
        })
    )
}

export const restore = async (backup, userId) => {
    for (const app of backup.apps) {
        await createProcess(app, userId)
    }
    for (const deployment of backup.deployments) {
        await createDeployment(deployment, userId)
    }
}
