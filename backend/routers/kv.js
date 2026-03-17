import { Hono } from 'hono'

import {
    getSettings,
    updateJwtKey,
    updateEnableCors,
    updateEnableAutoBackup,
    updateTokenExpireTime,
    updateSubscribedMsgNames,
    updateEnableAutoDbCleanup,
    updateDbCleanUpEarlierThan,
    updateMonitorCollectDelay,
    updateMonitorBufferMaxSize,
    updateMonitorBufferMaxAge
} from '../components/kv.js'

import { resetBus } from '../components/communication.js'

export const router = new Hono()

router.get('/', async c => {
    c.set('ret', getSettings())
})

router.post('/jwtKey', async c => {
    c.set('act', 'regenerateKey')
    await updateJwtKey()
})

router.put('/enableCors', async c => {
    const { value } = await c.req.json()
    await updateEnableCors(value)
})

router.put('/tokenExpireTime', async c => {
    const { value } = await c.req.json()
    await updateTokenExpireTime(value)
})

router.put('/subscribedMsgNames', async c => {
    const { value } = await c.req.json()
    await updateSubscribedMsgNames(value)
    await resetBus()
})

router.put('/enableAutoDbCleanup', async c => {
    const { value } = await c.req.json()
    await updateEnableAutoDbCleanup(value)
})

router.put('/dbCleanUpEarlierThan', async c => {
    const { value } = await c.req.json()
    await updateDbCleanUpEarlierThan(value)
})

router.put('/monitorCollectDelay', async c => {
    const { value } = await c.req.json()
    await updateMonitorCollectDelay(value)
})

router.put('/monitorBufferMaxSize', async c => {
    const { value } = await c.req.json()
    await updateMonitorBufferMaxSize(value)
})

router.put('/monitorBufferMaxAge', async c => {
    const { value } = await c.req.json()
    await updateMonitorBufferMaxAge(value)
})

router.put('/enableAutoBackup', async c => {
    const { value } = await c.req.json()
    await updateEnableAutoBackup(value)
})
