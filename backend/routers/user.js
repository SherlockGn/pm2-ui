import { Hono } from 'hono'
import { list, create, update, deleteById } from '../components/user.js'
import { checkSuperUser, checkUser } from './middleware.js'

export const router = new Hono()

router.get('/self', async c => {
    c.set('ret', c.get('user'))
})

router.get('/', async c => {
    const user = c.get('user')
    if (user.superUser) {
        c.set('ret', await list())
        return
    }
    c.set('ret', [user])
})

router.post('/login', async c => {
    c.set('act', 'login')
    c.set('rsrc', c.get('user'))
    c.set('ret', c.get('user'))
})

router.post('/', checkUser, checkSuperUser, async c => {
    await create(await c.req.json())
})

router.put('/:id', checkUser, async c => {
    const user = c.get('user')
    const updated = await c.req.json()
    updated.id = +c.req.param('id')
    if (user.id === updated.id) {
        if (updated.enabled === false) {
            throw new Error('Cannot disable yourself.')
        }
        if (updated.superUser != null && updated.superUser !== user.superUser) {
            throw new Error('Cannot change super user status of yourself.')
        }
    }
    await update(updated)
})

router.delete('/:id', checkUser, checkSuperUser, async c => {
    const user = c.get('user')
    const id = +c.req.param('id')
    if (user.id === id) {
        throw new Error('Cannot delete yourself.')
    }
    await deleteById(id)
})
