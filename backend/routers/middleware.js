import { createMiddleware } from 'hono/factory'
import { logIn, logInByJwt } from '../components/user.js'
import { getById as getUserById } from '../components/user.js'
import { getByPmId as getProcessByPmId } from '../components/process.js'
import { getById as getDeploymentById } from '../components/deployment.js'
import { getById as getBackupById } from '../components/backup.js'
import { getById as getAdminLogById } from '../components/adminLog.js'
import { create as createAdminLog } from '../components/adminLog.js'

export const auth = createMiddleware(async (c, next) => {
    try {
        const auth = c.req.header('Authorization')
        if (!auth) {
            throw new Error('No Authorization header')
        }
        const [scheme, token] = auth.split(' ')
        if (!token) {
            throw new Error('No token')
        }
        let user = null
        if (scheme?.toLowerCase() === 'bearer') {
            user = await logInByJwt(token)
        } else if (scheme?.toLowerCase() === 'basic') {
            const [email, password] = Buffer.from(token, 'base64')
                .toString()
                .split(':')
            if (!email || !password) {
                throw new Error('Invalid Authorization credentials')
            }
            user = await logIn(email, password)
        } else {
            throw new Error('Invalid Authorization scheme')
        }
        if (!user) {
            throw new Error('User is invalid')
        }
        c.set('user', user)
    } catch (e) {
        c.status(401)
        throw e
    }
    await next()
})

const simplifyRsrc = rsrc => {
    if (rsrc == null) {
        return
    }
    for (const key in rsrc) {
        if (typeof rsrc[key] === 'object') {
            delete rsrc[key]
        }
    }
    delete rsrc.password
    delete rsrc.jwt
}

const simplifyErrorMsg = errMsg => {
    if (errMsg == null) {
        return null
    }
    return errMsg.replace(/\s*\(\S+\)/, '')
}

export const common = createMiddleware(async (c, next) => {
    let successful = true
    let errMsg = null
    try {
        await next()
        if (c.error) {
            throw c.error
        }

        const result = c.get('ret') ?? null

        if (result !== null) {
            c.status(200)
            c.res = c.json(result)
            return
        }

        if (c.res.status === 200 && !c.res.body) {
            c.res = c.newResponse(null, 204)
            return
        }
    } catch (e) {
        successful = false
        errMsg = e.message
        const status = c.newResponse().status
        c.error = null
        if (status === 401) {
            c.set('act', 'login')
            c.set('cat', 'user')
            c.status(401)
            c.res = c.json({ error: 'Unauthorized' })
            return
        }
        if (status === 403) {
            c.set('act', 'login')
            c.set('cat', 'user')
            c.status(403)
            c.res = c.json({ error: 'Forbidden' })
            return
        }
        c.status(500)
        c.res = c.json({ error: e.message })
    } finally {
        const actMap = {
            'POST': 'create',
            'PUT': 'update',
            'DELETE': 'delete'
        }
        const act =
            c.get('act') === undefined ? actMap[c.req.method] : c.get('act')
        if (act) {
            const cat =
                c.get('cat') ?? new URL(c.req.url).pathname.split('/')[2]
            let rsrc = c.get('rsrc')
            if (!rsrc) {
                try {
                    rsrc = await c.req.json()
                } catch {}
            }
            const userId = c.get('user')?.id ?? null
            const userDisplayName = c.get('user')?.displayName ?? null
            simplifyRsrc(rsrc)
            errMsg = simplifyErrorMsg(errMsg)
            await createAdminLog({
                action: act,
                category: cat,
                userId,
                userDisplayName,
                successful,
                resourceName: rsrc?.name ?? rsrc?.displayName ?? null,
                resourceData: rsrc,
                errorMsg: errMsg
            })
        }
    }
})

export const filterResult = createMiddleware(async (c, next) => {
    await next()
    const results = c.get('ret')
    if (Array.isArray(results) && !c.get('user').superUser) {
        c.set(
            'ret',
            results.filter(item => item.userId === c.get('user').id)
        )
    }
})

export const checkSuperUser = createMiddleware(async (c, next) => {
    if (!c.get('user').superUser) {
        c.status(403)
        throw new Error('Forbidden')
    }
    await next()
})

export const checkUser = createMiddleware(async (c, next) => {
    const userId = +c.req.param('id')
    if (userId) {
        c.set('rsrc', await getUserById(userId))
        if (userId !== c.get('user').id && !c.get('user').superUser) {
            c.status(403)
            throw new Error('Forbidden')
        }
    } else {
        c.set('rsrc', await c.req.json())
    }

    await next()
})

export const checkProcess = createMiddleware(async (c, next) => {
    const pmId = c.req.param('id')
    if (pmId) {
        const process = await getProcessByPmId(pmId)
        c.set('rsrc', process)
        if (process.userId !== c.get('user').id && !c.get('user').superUser) {
            c.status(403)
            c.res = c.json({ error: 'Forbidden' })
            return
        }
    } else {
        c.set('rsrc', await c.req.json())
    }
    await next()
})

export const checkDeployment = createMiddleware(async (c, next) => {
    const id = c.req.param('id')
    if (id) {
        const deployment = await getDeploymentById(id)
        c.set('rsrc', deployment)
        if (
            deployment.userId !== c.get('user').id &&
            !c.get('user').superUser
        ) {
            c.status(403)
            c.res = c.json({ error: 'Forbidden' })
            return
        }
    } else {
        c.set('rsrc', await c.req.json())
    }
    await next()
})

export const checkBackup = createMiddleware(async (c, next) => {
    const id = c.req.param('id')
    if (id) {
        const backup = await getBackupById(id)
        c.set('rsrc', backup)
        if (backup.userId !== c.get('user').id && !c.get('user').superUser) {
            c.status(403)
            c.res = c.json({ error: 'Forbidden' })
            return
        }
    } else {
        c.set('rsrc', await c.req.json())
    }
    await next()
})

export const checkAdminLog = createMiddleware(async (c, next) => {
    const id = c.req.param('id')
    if (id) {
        const log = await getAdminLogById(id)
        c.set('rsrc', log)
        if (log.userId !== c.get('user').id && !c.get('user').superUser) {
            c.status(403)
            c.res = c.json({ error: 'Forbidden' })
            return
        }
    } else {
        c.set('rsrc', await c.req.json())
    }
    await next()
})
