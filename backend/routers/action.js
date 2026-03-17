import { Hono } from 'hono'
import { checkProcess } from './middleware.js'
import {
    flushLog,
    resetCounter,
    startup,
    unstartup,
    save,
    resurrect,
    kill,
    ping,
    update
} from '../components/action.js'

export const router = new Hono()

router.post('/resetCounter/:id', checkProcess, async c => {
    c.set('act', 'resetCounter')
    const ret = await resetCounter(c.get('rsrc').pmId)
    c.set('ret', ret)
})

router.post('flushLog/:id', checkProcess, async c => {
    c.set('act', 'flushLog')
    const ret = await flushLog(c.get('rsrc').pmId)
    c.set('ret', ret)
})

router.post('/startup', async c => {
    c.set('act', null)
    const ret = await startup()
    c.set('ret', ret)
})

router.post('/unstartup', async c => {
    c.set('act', null)
    const ret = await unstartup()
    c.set('ret', ret)
})

router.post('/save', async c => {
    c.set('act', 'save')
    const ret = await save()
    c.set('ret', ret)
})

router.post('/resurrect', async c => {
    c.set('act', 'resurrect')
    const ret = await resurrect()
    c.set('ret', ret)
})

router.post('/kill', async c => {
    c.set('act', 'kill')
    const ret = await kill()
    c.set('ret', ret)
})

router.post('/ping', async c => {
    c.set('act', 'ping')
    const ret = await ping()
    c.set('ret', ret)
})

router.post('/update', async c => {
    c.set('act', 'updatePm2')
    const ret = await update()
    c.set('ret', ret)
})
