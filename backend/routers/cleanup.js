import { Hono } from 'hono'
import { getExpiredCounts, cleanExpired } from '../components/cleanup.js'
import { vacuum } from '../components/database.js'

export const router = new Hono()

router.get('/', async c => {
    c.set('ret', await getExpiredCounts())
})

router.delete('/', async c => {
    const ret = await cleanExpired()
    c.set('ret', ret)
    c.set('rsrc', ret)
})

router.post('/vacuum', async c => {
    c.set('act', 'vacuum')
    c.set('cat', 'cleanup')
    vacuum()
})
