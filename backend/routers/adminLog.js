import { Hono } from 'hono'
import { list } from '../components/adminLog.js'
import { checkAdminLog } from './middleware.js'

export const router = new Hono()

router.post('/query', checkAdminLog, async c => {
    c.set('act', null)
    const {
        actionList,
        categoryList,
        successful,
        resourceNamePattern,
        offset,
        limit
    } = await c.req.json()
    const userId = c.get('user').superUser ? null : c.get('user').id
    c.set(
        'ret',
        await list(
            userId,
            actionList,
            categoryList,
            successful,
            resourceNamePattern,
            offset,
            limit
        )
    )
})
