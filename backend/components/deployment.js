import { join } from 'node:path'
import { promises as fs } from 'node:fs'

import {
    createDeployment,
    updateDeployment,
    getDeployments,
    deleteDeployment,
    getDeploymentById
} from './database.js'

import { runCmdAdvanced, isWin } from './pm2.js'

let deploymentFolder
let configFile

export const init = async currentDir => {
    deploymentFolder = join(currentDir, 'deployments')
    configFile = join(deploymentFolder, 'ecosystem.config.cjs')
}

export const runDeploymentCmd = async (deployment, args) => {
    await fs.mkdir(deploymentFolder, { recursive: true })
    const json = JSON.stringify({
        deploy: toJsonObject([deployment])
    })

    const preAction = async () => {
        await fs.writeFile(configFile, 'module.exports = ' + json)
    }

    const postAction = async () => {
        await fs.unlink(configFile)
    }

    return runCmdAdvanced('pm2', ['deploy', deployment.name, ...args], {
        preAction,
        postAction,
        timeout: 30 * 60 * 1000,
        allowConcurrent: false,
        cwd: deploymentFolder,
        shell: isWin,
        windowsHide: true,
        env: {
            PM2_PROGRAMMATIC: 'false'
        }
    })
}

const toDataObject = deployment => {
    if (deployment == null) {
        return null
    }
    return {
        id: deployment.id,
        createdAt: deployment.createdAt,
        updatedAt: deployment.updatedAt,
        userId: deployment.userId,
        name: deployment.name,
        key: deployment.key,
        user: deployment.user,
        host: deployment.host == null ? null : JSON.stringify(deployment.host),
        sshOptions:
            deployment.sshOptions == null
                ? null
                : JSON.stringify(deployment.sshOptions),
        ref: deployment.ref,
        repo: deployment.repo,
        path: deployment.path,
        preSetup: deployment.preSetup,
        postSetup: deployment.postSetup,
        preDeployLocal: deployment.preDeployLocal,
        postDeploy: deployment.postDeploy
    }
}

export const toJsonObject = deployments => {
    const ret = {}
    for (const deployment of deployments) {
        const jsonObject = {
            key: deployment.key,
            user: deployment.user,
            host: deployment.host,
            ssh_options: deployment.sshOptions?.length
                ? deployment.sshOptions
                : null,
            ref: deployment.ref,
            repo: deployment.repo,
            path: deployment.path,
            'pre-setup': deployment.preSetup,
            'post-setup': deployment.postSetup,
            'pre-deploy-local': deployment.preDeployLocal,
            'post-deploy': deployment.postDeploy
        }
        for (const key in jsonObject) {
            if (jsonObject[key] == null) {
                delete jsonObject[key]
            }
        }
        ret[deployment.name] = jsonObject
    }
    return ret
}

export const fromJsonObject = jsonObject => {
    const ret = []
    for (const key in jsonObject) {
        const json = jsonObject[key]
        const deployment = {
            name: key,
            key: json.key ?? null,
            user: json.user ?? null,
            host: json.host ?? null,
            sshOptions: json.ssh_options ?? null,
            ref: json.ref ?? null,
            repo: json.repo ?? null,
            path: json.path ?? null,
            preSetup: json['pre-setup'] ?? null,
            postSetup: json['post-setup'] ?? null,
            preDeployLocal: json['pre-deploy-local'] ?? null,
            postDeploy: json['post-deploy'] ?? null
        }
        ret.push(deployment)
    }
    return ret
}

const fromDataObject = data => {
    if (data == null) {
        return null
    }
    return {
        id: data.id,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        userId: data.userId,
        name: data.name,
        key: data.key,
        user: data.user,
        host: data.host == null ? null : JSON.parse(data.host),
        sshOptions:
            data.sshOptions == null ? null : JSON.parse(data.sshOptions),
        ref: data.ref,
        repo: data.repo,
        path: data.path,
        preSetup: data.preSetup,
        postSetup: data.postSetup,
        preDeployLocal: data.preDeployLocal,
        postDeploy: data.postDeploy
    }
}

export const list = async () => {
    return getDeployments().map(fromDataObject)
}

export const getById = async id => {
    return fromDataObject(await getDeploymentById(id))
}

export const create = async (deployment, userId) => {
    deployment.userId = userId
    return createDeployment(toDataObject(deployment))
}

export const update = async (deployment, updated) => {
    if (updated.name !== undefined) {
        deployment.name = updated.name
    }
    if (updated.key !== undefined) {
        deployment.key = updated.key
    }
    if (updated.user !== undefined) {
        deployment.user = updated.user
    }
    if (updated.host !== undefined) {
        deployment.host = updated.host
    }
    if (updated.sshOptions !== undefined) {
        deployment.sshOptions = updated.sshOptions
    }
    if (updated.ref !== undefined) {
        deployment.ref = updated.ref
    }
    if (updated.repo !== undefined) {
        deployment.repo = updated.repo
    }
    if (updated.path !== undefined) {
        deployment.path = updated.path
    }
    if (updated.preSetup !== undefined) {
        deployment.preSetup = updated.preSetup
    }
    if (updated.postSetup !== undefined) {
        deployment.postSetup = updated.postSetup
    }
    if (updated.preDeployLocal !== undefined) {
        deployment.preDeployLocal = updated.preDeployLocal
    }
    if (updated.postDeploy !== undefined) {
        deployment.postDeploy = updated.postDeploy
    }
    return updateDeployment(toDataObject(deployment))
}

export const deleteItem = async id => {
    return deleteDeployment(id)
}
