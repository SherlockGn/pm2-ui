import { Hono } from 'hono'
import { get } from '../components/metric.js'
import { checkProcess } from './middleware.js'

export const router = new Hono()

router.get('/:id', checkProcess, async c => {
    const start = +c.req.query('start')
    const end = +c.req.query('end')
    const metricName = c.req.query('metricName')
    const aggregate = c.req.query('aggregate')
    const sample = +c.req.query('sample')

    c.set(
        'ret',
        await get(c.get('rsrc'), metricName, start, end, aggregate, sample)
    )
})
