import { toJsonObject } from '../../parameters.js'

import { readLastLines } from './fs.js'
import {
    list as listApps,
    getByGuid as getAppByGuid,
    getById as getAppById,
    create as createApp,
    deleteById as deleteAppById,
    update as updateApp
} from './app.js'
import {
    list as pm2List,
    reload as pm2Reload,
    start as pm2Start,
    restart as pm2Restart,
    stop as pm2Stop,
    deleteItem as pm2DeleteItem,
    describe as pm2Describe
} from './pm2.js'

const objToKv = env => {
    return Object.entries(env ?? {}).map(([k, v]) => ({ key: k, value: v }))
}

const isBasicType = item => {
    return (
        typeof item === 'string' ||
        typeof item === 'number' ||
        typeof item === 'boolean'
    )
}

const getRpcList = process => {
    return process.pm2_env.axm_actions.map(action => {
        return {
            name: action.action_name,
            isBuiltIn: action.action_type?.toLowerCase() === 'internal',
            hasParam: action.arity === 2
        }
    })
}

const getMetrics = process => {
    const metrics = Object.entries(process.pm2_env.axm_monitor).map(
        ([k, v]) => {
            return {
                name: k,
                value: +v.value,
                type: v.type,
                unit: v.unit
            }
        }
    )

    metrics.push({
        name: 'CPU',
        value: process.monit.cpu,
        type: null,
        unit: '%'
    })

    metrics.push({
        name: 'Memory',
        value: process.monit.memory,
        type: null,
        unit: 'B'
    })

    return metrics
}

const formatProcess = process => {
    const uniqueId = process.pm2_env.unique_id

    const basic = {
        id: `${process.pm_id}[${uniqueId}]`,
        name: process.name,
        pid: process.pid,
        pmId: process.pm_id,
        uniqueId,
        script: process.pm2_env.pm_exec_path,
        status: process.pm2_env.status,
        exeMode: process.pm2_env.exec_mode,
        upTime: process.pm2_env.pm_uptime,
        restartCount: process.pm2_env.restart_time,
        cpu: process.monit.cpu,
        memory: process.monit.memory,
        createdAt: process.pm2_env.created_at
    }

    const rpc = getRpcList(process)
    const metrics = getMetrics(process)

    const env = objToKv(process.pm2_env.env)

    const envNames = Object.keys(process.pm2_env.env ?? {})
    const processSelfEnvKeys = Object.keys(globalThis.process.env ?? {})

    const customEnvs = env.filter(
        item => !processSelfEnvKeys.includes(item.key)
    )
    const commonEnvs = env.filter(item => processSelfEnvKeys.includes(item.key))

    const attrs = objToKv(process.pm2_env)
        .filter(item => isBasicType(item.value))
        .filter(item => !envNames.includes(item.key))

    customEnvs.sort((a, b) =>
        a.key.toLowerCase().localeCompare(b.key.toLowerCase())
    )
    commonEnvs.sort((a, b) =>
        a.key.toLowerCase().localeCompare(b.key.toLowerCase())
    )
    attrs.sort((a, b) => a.key.toLowerCase().localeCompare(b.key.toLowerCase()))

    return {
        ...basic,
        env: { custom: customEnvs, common: commonEnvs },
        attrs,
        rpc,
        metrics,
        app: null,
        userId: null
    }
}

const formatApp = app => {
    return {
        id: '0[00000000-0000-0000-0000-000000000000]',
        name: app.name,
        pid: 0,
        pmId: -app.id,
        uniqueId: '00000000-0000-0000-0000-000000000000',
        script: app.script,
        status: 'not run',
        exeMode: null,
        upTime: app.createdAt,
        restartCount: 0,
        cpu: 0,
        memory: 0,
        createdAt: app.createdAt,
        env: { custom: [], common: [] },
        attrs: [],
        rpc: [],
        metrics: [],
        app,
        userId: app.userId
    }
}

export const getByPmId = async pmId => {
    if (pmId < 0) {
        const app = await getAppById(-pmId)
        return formatApp(app)
    }
    const pm2Process = (await pm2Describe(pmId))[0]
    const process = formatProcess(pm2Process)
    process.app = (await getAppByGuid(process.uniqueId)) ?? null
    process.userId = process.app?.userId ?? null
    return process
}

export const list = async () => {
    const pm2Processes = await pm2List()
    const apps = await listApps()
    const matchedIds = []
    const processes = pm2Processes.map(pm2Process => {
        const process = formatProcess(pm2Process)
        const app =
            apps.find(item => item.guids.includes(process.uniqueId)) ?? null
        process.app = app
        process.userId = app?.userId ?? null
        if (app) {
            matchedIds.push(app.id)
        }
        return process
    })

    const appAsProcesses = apps
        .filter(item => !matchedIds.includes(item.id))
        .map(app => formatApp(app))

    return [...processes, ...appAsProcesses]
}

export const createAndStart = async (app, userId) => {
    const timestamp = new Date().toISOString()
    const pm2Processes = await pm2Start(toJsonObject(app))
    let guids = pm2Processes.map(item => item.pm2_env.unique_id)
    guids = [...new Set(guids)]

    app.guids = guids
    app.userId = userId

    await createApp(app, timestamp)
}

export const create = async (app, userId) => {
    app.guids = []
    app.userId = userId

    await createApp(app)
}

export const update = async (process, app) => {
    app.id = process.app.id
    await updateApp(app)
}

export const start = async process => {
    const app = process.app

    if (process.pmId < 0) {
        const timestamp = new Date().toISOString()
        const pm2Processes = await pm2Start(toJsonObject(app))
        let guids = pm2Processes.map(item => item.pm2_env.unique_id)
        guids = [...new Set(guids)]

        app.guids = guids
        return await updateApp(app, timestamp)
    }

    await pm2Restart(
        process.pmId,
        app == null
            ? null
            : { ...toJsonObject(app), env: null, updateEnv: true }
    )
}

export const restart = async process => {
    if (process.pmId < 0) {
        throw new Error('Cannot restart a non-running process')
    }

    const app = process.app
    return await pm2Restart(
        process.pmId,
        app == null
            ? null
            : { ...toJsonObject(app), env: null, updateEnv: true }
    )
}

export const reload = async process => {
    if (process.pmId < 0) {
        throw new Error('Cannot stop a non-running process')
    }

    return await pm2Reload(process.pmId)
}

export const stop = async process => {
    if (process.pmId < 0) {
        throw new Error('Cannot stop a non-running process')
    }

    return await pm2Stop(process.pmId)
}

export const deleteItem = async process => {
    if (process.pmId < 0) {
        return await deleteAppById(-process.pmId)
    }

    if (!process.app) {
        return await pm2DeleteItem(process.pmId)
    }

    const allUniqueIds = (await pm2List()).map(p => p.pm2_env.unique_id)
    const isTheOnly =
        allUniqueIds.filter(item => item === process.uniqueId).length < 2

    if (isTheOnly) {
        await deleteAppById(process.app.id)
    }
    await pm2DeleteItem(process.pmId)
}

export const manage = async (process, app, userId) => {
    app.guids = [process.uniqueId]
    app.userId = userId

    await createApp(app)
}

export const readLogs = async (process, lineCount) => {
    const outputPath = process.attrs.find(
        i => i.key === 'pm_out_log_path'
    )?.value
    const errorPath = process.attrs.find(
        i => i.key === 'pm_err_log_path'
    )?.value
    const combinedPath = process.attrs.find(i => i.key === 'pm_log_path')?.value

    const logPathValid = path => path && path !== 'NULL' && path !== '/dev/null'

    return {
        output: logPathValid(outputPath)
            ? await readLastLines(outputPath, lineCount)
            : [],
        error: logPathValid(errorPath)
            ? await readLastLines(errorPath, lineCount)
            : [],
        combined: logPathValid(combinedPath)
            ? await readLastLines(combinedPath, lineCount)
            : []
    }
}
