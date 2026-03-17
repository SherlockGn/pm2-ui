import { sep } from 'node:path'
import { Hono } from 'hono'
import { walk } from '../components/fs.js'

export const router = new Hono()

router.get('/sep', async c => {
    c.set('ret', { sep })
})

router.post('/', async c => {
    c.set('act', null)
    const paths = await c.req.json()
    c.set('ret', await walk(paths))
})
