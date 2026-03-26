import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'

import { common, auth } from './routers/middleware.js'

import {
    init as initKv,
    refresh as refreshKv,
    getSettings
} from './components/kv.js'
import { ensurePM2Env } from './components/pm2.js'
import { init as initDb, close as closeDb } from './components/database.js'
import { init as initUser } from './components/user.js'
import { init as initMetric } from './components/metric.js'
import { init as initCommunication } from './components/communication.js'
import { init as initDeployment } from './components/deployment.js'
import { autoBackupSnapshot } from './components/backup.js'
import { autoCleanExpired, autoVacuum } from './components/cleanup.js'

import { router as userRouter } from './routers/user.js'
import { router as processRouter } from './routers/process.js'
import { router as fsRouter } from './routers/fs.js'
import { router as settingRouter } from './routers/settings.js'
import { router as metricRouter } from './routers/metric.js'
import { router as communicationRouter } from './routers/communication.js'
import { router as deploymentRouter } from './routers/deployment.js'
import { router as actionRouter } from './routers/action.js'
import { router as backupRouter } from './routers/backup.js'
import { router as kvRouter } from './routers/kv.js'
import { router as adminLogRouter } from './routers/adminLog.js'
import { router as cleanupRouter } from './routers/cleanup.js'

import { createDailyScheduler } from './components/scheduler.js'

const currentDir = dirname(fileURLToPath(import.meta.url))

await ensurePM2Env()
const { first } = await initDb(currentDir)
if (first) {
    await initUser()
    await initKv()
}

initMetric()
await refreshKv()
await initCommunication()
await initDeployment(currentDir)

const app = new Hono()

app.use('*', serveStatic({ root: currentDir }))

if (getSettings().enableCors) {
    app.use('/api/*', cors())
}

app.use('/api/*', common)
app.use('/api/*', auth)

app.route('/api/user', userRouter)
app.route('/api/process', processRouter)
app.route('/api/fs', fsRouter)
app.route('/api/setting', settingRouter)
app.route('/api/metric', metricRouter)
app.route('/api/communication', communicationRouter)
app.route('/api/deployment', deploymentRouter)
app.route('/api/action', actionRouter)
app.route('/api/backup', backupRouter)
app.route('/api/kv', kvRouter)
app.route('/api/adminLog', adminLogRouter)
app.route('/api/cleanup', cleanupRouter)

const server = serve(
    {
        fetch: app.fetch,
        port: process.env.PORT ?? 12345
    },
    info => {
        console.log(`Server starts, info: ${JSON.stringify(info)}`)
    }
)

createDailyScheduler(0, 0, async () => {
    await autoBackupSnapshot()
})

createDailyScheduler(1, 0, async () => {
    await autoCleanExpired()
    await autoVacuum()
})

let exit = 0
const closeServer = async () => {
    return new Promise((resolve, reject) => {
        server.close(err => {
            if (err) {
                console.error(err)
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

process.on('SIGINT', async () => {
    try {
        await closeServer()
        console.log('Server closed')
    } catch (err) {
        console.error('An error occurred while closing the server.', err)
        exit = 1
    }

    try {
        closeDb()
        console.log('Database closed')
    } catch (err) {
        console.error('An error occurred while closing the database.', err)
        exit = 1
    }

    process.exit(exit)
})
