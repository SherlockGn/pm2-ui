import { runCmdAdvanced, isWin } from './pm2.js'

export const runPM2Cmd = async args => {
    return await runCmdAdvanced('pm2', args, {
        timeout: 30 * 60 * 1000,
        allowConcurrent: false,
        shell: isWin,
        windowsHide: true,
        env: {
            PM2_PROGRAMMATIC: 'false'
        }
    })
}

export const resetCounter = async id => {
    return await runPM2Cmd(['reset', id])
}

export const flushLog = async id => {
    return await runPM2Cmd(['flush', id])
}

export const startup = async () => {
    return await runPM2Cmd(['startup'])
}

export const unstartup = async () => {
    return await runPM2Cmd(['unstartup'])
}

export const save = async () => {
    return await runPM2Cmd(['save'])
}

export const resurrect = async () => {
    return await runPM2Cmd(['resurrect'])
}

export const update = async () => {
    return await runPM2Cmd(['update'])
}

export const kill = async () => {
    return await runPM2Cmd(['kill'])
}

export const ping = async () => {
    return await runPM2Cmd(['ping'])
}
