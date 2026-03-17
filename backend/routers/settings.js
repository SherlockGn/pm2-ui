import { Hono } from 'hono'
import { get, createOrUpdate } from '../components/settings.js'
import { checkProcess } from './middleware.js'

export const router = new Hono()

router.get('/:id', checkProcess, async c => {
    c.set('ret', await get(c.get('rsrc')))
})

router.put('/:id', checkProcess, async c => {
    c.set('ret', await createOrUpdate(c.get('rsrc'), await c.req.json()))
})
