import { platform } from 'node:os'
import { join } from 'node:path'
import { stat } from 'node:fs/promises'
import { spawn, exec } from 'node:child_process'
import { pathToFileURL } from 'node:url'

export const isWin = platform() === 'win32'

let isAdmin = null

export const checkIsAdmin = async () => {
    if (isAdmin !== null) {
        return isAdmin
    }
    if (!isWin) {
        return null
    }
    return await new Promise(resolve => {
        exec('net session', err => {
            if (err) {
                isAdmin = false
                resolve(false)
            } else {
                isAdmin = true
                resolve(true)
            }
        })
    })
}

const runCmd = async (command, args) => {
    return new Promise((resolve, reject) => {
        if (isWin) {
            command += '.cmd'
        }
        const child = spawn(command, args, {
            shell: isWin,
            windowsHide: true
        })
        let stdout = '',
            stderr = ''
        child.stdout.on('data', data => {
            stdout += data.toString()
        })
        child.stderr.on('data', data => {
            stderr += data.toString()
        })
        child.on('error', err => {
            reject(err)
        })
        child.on('close', code => {
            if (code !== 0) {
                reject(new Error(code))
            } else {
                resolve({ stdout, stderr })
            }
        })
    })
}

let isRunning = false
export const runCmdAdvanced = async (command, args, options) => {
    const {
        timeout = null,
        allowConcurrent = false,
        preAction = null,
        postAction = null,
        ...restOptions
    } = options ?? {}
    const ret = []
    if (!allowConcurrent && isRunning) {
        throw new Error('Already running')
    }
    isRunning = true
    try {
        if (preAction) {
            await preAction()
        }
        return await new Promise((resolve, reject) => {
            const child = spawn(command, args, restOptions)
            let timer = null
            if (timeout) {
                timer = setTimeout(() => {
                    try {
                        child.kill()
                    } catch (e) {
                        console.error(e)
                    }
                    resolve({ ret, code: null, isTimeout: true })
                }, timeout)
            }
            child.stdout.on('data', data => {
                ret.push({ type: 'data', data: data.toString() })
            })
            child.stderr.on('data', data => {
                ret.push({ type: 'error', data: data.toString() })
            })
            child.on('error', err => {
                reject(err)
            })
            child.on('close', code => {
                if (timer) {
                    clearTimeout(timer)
                }
                resolve({ ret, code, isTimeout: false })
            })
        })
    } finally {
        if (postAction) {
            try {
                await postAction()
            } finally {
                isRunning = false
            }
        }
        isRunning = false
    }
}

const getGlobalPM2Path = async () => {
    const { stdout, stderr } = await runCmd('npm', ['root', '-g'])
    if (!stdout.trim()) {
        throw new Error(`Failed to get global npm root: ${stderr}`)
    }
    const path = join(stdout.trim(), 'pm2', 'index.js')
    await stat(path)

    return path
}

const getGlobalPM2 = async () => {
    return (await import(pathToFileURL(await getGlobalPM2Path()))).default
}

const pm2 = await getGlobalPM2()

export const runPM2 = async (fn, ...args) => {
    return new Promise((resolve, reject) => {
        pm2[fn](...args, (error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
}

export const runPM2CLI = async args => {
    return await runCmd('pm2', args)
}

export const ensurePM2Env = async () => {
    if (isWin && !(await checkIsAdmin())) {
        console.warn(
            'Not running with admin privileges, PM2 may not work properly.'
        )
    }

    const version = await runPM2('getVersion')

    const o = await runPM2CLI(['--version'])
    const cliVersion = o.stdout.trim()

    console.log({ version, cliVersion })

    if (version !== cliVersion) {
        throw new Error('pm2 version mismatch')
    }

    await runPM2('connect')
    console.log('pm2 connected')
}

export const connect = async () => {
    await runPM2('connect')
}

export const getBus = async () => {
    return await runPM2('launchBus')
}

export const sendDataToProcessId = async data => {
    return await runPM2('sendDataToProcessId', data)
}

export const sendSignalToProcessId = async (id, signal) => {
    return await runPM2('sendSignalToProcessId', signal, id)
}

export const list = async () => {
    return await runPM2('list')
}

export const describe = async id => {
    return await runPM2('describe', id)
}

export const start = async app => {
    return await runPM2('start', app)
}

export const reload = async id => {
    return await runPM2('reload', id)
}

export const restart = async (id, app) => {
    return await runPM2('restart', id, app)
}

export const stop = async id => {
    return await runPM2('stop', id)
}

export const deleteItem = async id => {
    return await runPM2('delete', id)
}
