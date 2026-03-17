import { Hono } from 'hono'
import { get, trigger, send, sendSignal } from '../components/communication.js'
import { checkProcess } from './middleware.js'

export const router = new Hono()

router.post('/query/:id', checkProcess, async c => {
    c.set('act', null)
    const { typeList, namePattern, offset, limit } =
        await c.req.json()
    c.set(
        'ret',
        await get(
            c.get('rsrc'),
            typeList,
            namePattern,
            offset,
            limit
        )
    )
})

router.post('/trigger/:id', checkProcess, async c => {
    c.set('act', 'rpc')
    const { name, param = undefined } = await c.req.json()
    await trigger(c.get('rsrc'), name, c.get('user').id, param)
})

router.post('/send/:id', checkProcess, async c => {
    c.set('act', 'sendData')
    const { data = undefined } = await c.req.json()
    await send(c.get('rsrc'), c.get('user').id, data)
})

router.post('/sendSignal/:id', checkProcess, async c => {
    c.set('act', 'sendSignal')
    const { signal } = await c.req.json()
    await sendSignal(c.get('rsrc'), c.get('user').id, signal)
})
