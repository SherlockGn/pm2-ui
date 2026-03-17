import { Hono } from 'hono'
import {
    backupSnapshot,
    list,
    update,
    upload,
    restore,
    downloadText,
    deleteItem
} from '../components/backup.js'
import { checkBackup, filterResult } from './middleware.js'

export const router = new Hono()

router.get('/', filterResult, async c => {
    c.set('ret', await list())
})

router.get('/:id', checkBackup, async c => {
    const includeApps = c.req.query('includeApps') === 'true'
    const includeDeployments = c.req.query('includeDeployments') === 'true'
    const type = c.req.query('type')
    const ret = await downloadText(c.get('rsrc'), {
        includeApps,
        includeDeployments,
        type
    })
    c.set('ret', ret)
})

router.post('/', async c => {
    const { name } = await c.req.json()
    await backupSnapshot(name, c.get('user').id)
})

router.post('/upload', async c => {
    c.set('act', 'upload')
    const { name, type, backupObject } = await c.req.json()
    await upload(name, type, c.get('user').id, backupObject)
})

router.post('/:id/restore', checkBackup, async c => {
    c.set('act', 'restore')
    await restore(c.get('rsrc'), c.get('user').id)
})

router.put('/:id', checkBackup, async c => {
    await update(c.get('rsrc'), await c.req.json())
})

router.delete('/:id', checkBackup, async c => {
    await deleteItem(c.get('rsrc').id)
})
