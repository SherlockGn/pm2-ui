import { Hono } from 'hono'
import {
    list,
    create,
    stop,
    start,
    createAndStart,
    restart,
    reload,
    deleteItem,
    readLogs,
    update,
    manage
} from '../components/process.js'
import { checkProcess, filterResult } from './middleware.js'

export const router = new Hono()

router.get('/', filterResult, async c => {
    c.set('ret', await list())
})

router.post('/create', async c => {
    const user = c.get('user')
    const app = await c.req.json()
    const willStart = c.req.query('start').toLowerCase() === 'true'
    if (willStart) {
        c.set('act', 'createAndStart')
        await createAndStart(app, user.id)
    } else {
        await create(app, user.id)
    }
})

router.post('/start/:id', checkProcess, async c => {
    c.set('act', 'start')
    await start(c.get('rsrc'))
})

router.post('/stop/:id', checkProcess, async c => {
    c.set('act', 'stop')
    await stop(c.get('rsrc'))
})

router.post('/restart/:id', checkProcess, async c => {
    c.set('act', 'restart')
    await restart(c.get('rsrc'))
})

router.post('/reload/:id', checkProcess, async c => {
    c.set('act', 'reload')
    await reload(c.get('rsrc'))
})

router.post('/manage/:id', checkProcess, async c => {
    c.set('act', 'manage')
    const app = await c.req.json()
    const userId = c.get('user').id
    await manage(c.get('rsrc'), app, userId)
})

router.put('/:id', checkProcess, async c => {
    await update(c.get('rsrc'), await c.req.json())
})

router.delete('/:id', checkProcess, async c => {
    await deleteItem(c.get('rsrc'))
})

router.get('/log/:id', checkProcess, async c => {
    const lineCount = +c.req.query('lineCount') ?? 100
    const log = await readLogs(c.get('rsrc'), lineCount)
    c.set('ret', log)
})
