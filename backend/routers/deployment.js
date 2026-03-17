import { Hono } from 'hono'
import {
    list,
    update,
    create,
    deleteItem,
    runDeploymentCmd
} from '../components/deployment.js'
import { checkDeployment, filterResult } from './middleware.js'

export const router = new Hono()

router.get('/', filterResult, async c => {
    c.set('ret', await list())
})

router.post('/', checkDeployment, async c => {
    await create(await c.req.json(), c.get('user').id)
})

router.put('/:id', checkDeployment, async c => {
    await update(c.get('rsrc'), await c.req.json())
})

router.delete('/:id', checkDeployment, async c => {
    await deleteItem(c.get('rsrc').id)
})

router.post('/:id/setup', checkDeployment, async c => {
    c.set('act', 'setup')
    const ret = await runDeploymentCmd(c.get('rsrc'), ['setup'])
    c.set('ret', ret)
})

router.post('/:id/deploy', checkDeployment, async c => {
    c.set('act', 'deploy')
    const ret = await runDeploymentCmd(c.get('rsrc'), [])
    c.set('ret', ret)
})

router.post('/:id/update', checkDeployment, async c => {
    c.set('act', 'upgrade')
    const ret = await runDeploymentCmd(c.get('rsrc'), ['update'])
    c.set('ret', ret)
})

router.post('/:id/revert', checkDeployment, async c => {
    c.set('act', 'revert')
    const { num } = await c.req.json()
    const ret = await runDeploymentCmd(c.get('rsrc'), ['revert', `${num}`])
    c.set('ret', ret)
})

router.post('/:id/curr', checkDeployment, async c => {
    const ret = await runDeploymentCmd(c.get('rsrc'), ['curr'])
    c.set('ret', ret)
})

router.post('/:id/prev', checkDeployment, async c => {
    const ret = await runDeploymentCmd(c.get('rsrc'), ['prev'])
    c.set('ret', ret)
})

router.post('/:id/exec', checkDeployment, async c => {
    c.set('act', 'exec')
    const { cmd } = await c.req.json()
    const ret = await runDeploymentCmd(c.get('rsrc'), cmd)
    c.set('ret', ret)
})

router.post('/:id/list', checkDeployment, async c => {
    const ret = await runDeploymentCmd(c.get('rsrc'), ['list'])
    c.set('ret', ret)
})
