import { DatabaseSync } from 'node:sqlite'
import { join } from 'node:path'
import { stat } from 'node:fs/promises'
import {
    generateTable as generateAppTable,
    generatePropValues as generateAppPropValues
} from '../../parameters.js'

let db = null
let sql = null

export const init = async currentDir => {
    const dbPath = join(currentDir, 'database.db')

    let exists = true
    try {
        await stat(dbPath)
    } catch {
        exists = false
    }

    db = new DatabaseSync(dbPath)
    sql = db.createTagStore()

    db.exec('PRAGMA journal_mode=WAL;')
    db.exec('PRAGMA wal_autocheckpoint=ON;')

    if (!exists) {
        createUserTable()
        createKvTable()
        createAppTable()
        createSettingTable()
        createMetricTable()
        createCommunicationTable()
        createDeploymentTable()
        createBackupTable()
        createAdminLogTable()
    }

    return {
        first: !exists
    }
}

export const close = () => {
    db.close()
}

// users

const createUserTable = () => {
    return db.exec(
        `CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT,
        avatar TEXT,
        displayName Text,
        superUser TINYINT,
        password TEXT,
        enabled TINYINT,
        lastLogin DATETIME,
        createdAt DATETIME,
        updatedAt DATETIME
        )`
    )
}

export const createUser = user => {
    const now = new Date().toISOString()
    return sql.run`INSERT INTO users (
        email,
        avatar,
        displayName,
        superUser,
        password,
        enabled,
        lastLogin,
        createdAt,
        updatedAt
        ) VALUES (
        ${user.email ?? null},
        ${user.avatar ?? null},
        ${user.displayName ?? null},
        ${user.superUser ?? null},
        ${user.password ?? null},
        ${user.enabled ?? null},
        ${null},
        ${now},
        ${now}
        )`
}

export const getUserById = id => {
    return sql.get`SELECT * FROM users WHERE id = ${id}`
}

export const getUserByEmail = email => {
    return sql.get`SELECT * FROM users WHERE email = ${email}`
}

export const getUsers = () => {
    return sql.all`SELECT * FROM users`
}

export const updateUser = user => {
    const now = new Date().toISOString()
    return sql.run`UPDATE users SET
        email = ${user.email},
        avatar = ${user.avatar},
        displayName = ${user.displayName},
        superUser = ${user.superUser},
        password = ${user.password},
        enabled = ${user.enabled},
        lastLogin = ${user.lastLogin},
        updatedAt = ${now}
        WHERE id = ${user.id}
        `
}

export const deleteUser = id => {
    return sql.run`DELETE FROM users WHERE id = ${id}`
}

// kv

const createKvTable = () => {
    db.exec(
        `CREATE TABLE kv (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE,
        value TEXT,
        createdAt DATETIME,
        updatedAt DATETIME
        )`
    )
}

export const listKv = () => {
    return sql.all`SELECT * FROM kv`
}

export const getKv = key => {
    return sql.get`SELECT * FROM kv WHERE key = ${key}`
}

export const createOrUpdateKv = (key, value) => {
    const now = new Date().toISOString()
    return sql.run`INSERT INTO kv (
        key,
        value,
        createdAt,
        updatedAt
        ) VALUES (
        ${key},
        ${value},
        ${now},
        ${now}
        ) ON CONFLICT(key) DO
        UPDATE SET
        value = ${value},
        updatedAt = ${now}
        WHERE key = ${key}`
}

// apps

const createAppTable = () => {
    const tableCols = generateAppTable()
    const extraCols = [
        {
            name: 'id',
            type: 'INTEGER PRIMARY KEY AUTOINCREMENT'
        },
        {
            name: 'guids',
            type: 'TEXT'
        },
        {
            name: 'userId',
            type: 'INTEGER'
        },
        {
            name: 'createdAt',
            type: 'DATETIME'
        },
        {
            name: 'updatedAt',
            type: 'DATETIME'
        }
    ]
    const cols = [...extraCols, ...tableCols]
    const clauses = cols.map(col => `${col.name} ${col.type}`).join(',')
    db.exec(`CREATE TABLE apps (${clauses})`)
}

export const createApp = (app, timestamp = null) => {
    const now = new Date().toISOString()
    const appNameValues = generateAppPropValues(app)
    const extraNameValues = [
        {
            name: 'guids',
            value: app.guids
        },
        {
            name: 'userId',
            value: app.userId
        },
        {
            name: 'createdAt',
            value: timestamp ?? now
        },
        {
            name: 'updatedAt',
            value: timestamp ?? now
        }
    ]
    const allNameValues = [...extraNameValues, ...appNameValues]
    const names = allNameValues.map(val => val.name)
    const values = allNameValues.map(val => val.value)
    const valuePlaceholders = Array(names.length).fill('#')
    const clause = `INSERT INTO apps (${names.join(',')}) VALUES (${valuePlaceholders.join(',')})`
    return sql.run(clause.split('#'), ...values)
}

export const updateApp = (app, timestamp = null) => {
    const now = new Date().toISOString()
    const appNameValues = generateAppPropValues(app)
    const extraNameValues = [
        {
            name: 'guids',
            value: app.guids
        },
        {
            name: 'updatedAt',
            value: timestamp ?? now
        }
    ]
    const allNameValues = [...extraNameValues, ...appNameValues]
    const clauses = allNameValues.map(val => `${val.name} = #`)
    const values = allNameValues.map(val => val.value)
    const clause = `UPDATE apps SET ${clauses.join(',')} WHERE id = #`
    values.push(app.id)
    return sql.run(clause.split('#'), ...values)
}

export const getApps = () => {
    return sql.all`SELECT * FROM apps`
}

export const getAppById = id => {
    return sql.get`SELECT * FROM apps WHERE id = ${id}`
}

export const getAppByGuid = guid => {
    return sql.get`SELECT * FROM apps WHERE guids like ${'%"' + guid + '"%'}`
}

export const deleteApp = id => {
    return sql.run`DELETE FROM apps WHERE id = ${id}`
}

// pm2 settings

const createSettingTable = () => {
    db.exec(
        `CREATE TABLE settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        processId CHAR(50) UNIQUE,
        enableMonitor TINYINT,
        createdAt DATETIME,
        updatedAt DATETIME
        )`
    )
}

export const getSetting = processId => {
    return sql.get`SELECT * FROM settings WHERE processId = ${processId}`
}

export const createOrUpdateSetting = (processId, setting) => {
    return sql.run`INSERT INTO settings (processId, enableMonitor, createdAt, updatedAt)
        VALUES (${processId}, ${setting.enableMonitor}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT(processId) DO
        UPDATE SET
        enableMonitor = ${setting.enableMonitor},
        updatedAt = CURRENT_TIMESTAMP
        WHERE processId = ${processId}`
}

// metric

const createMetricTable = () => {
    db.exec(
        `CREATE TABLE metric (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        processId CHAR(50),
        timestamp INTEGER,
        metricName TEXT,
        metricValue REAL
        )`
    )
    db.exec(
        'CREATE INDEX idx_metrics_lookup ON metric(processId, metricName, timestamp);'
    )
}

export const addMetrics = metrics => {
    db.exec(`BEGIN`)

    metrics.forEach(metric => {
        sql.run`INSERT INTO metric (
            processId, timestamp, metricName, metricValue
        ) VALUES (
            ${metric.processId},
            ${metric.timestamp},
            ${metric.metricName},
            ${metric.metricValue})`
    })

    db.exec(`COMMIT`)
}

export const getMetrics = (
    processId,
    metricName,
    start,
    end,
    aggregate,
    sample
) => {
    const allowedAggregates = ['AVG', 'SUM', 'MIN', 'MAX', 'COUNT']
    if (!allowedAggregates.includes(aggregate?.toUpperCase())) {
        throw new Error('Invalid aggregate function')
    }
    const query = `
        WITH RECURSIVE time_spine(slot) AS (
            SELECT ? 
            UNION ALL
            SELECT slot + ? FROM time_spine WHERE slot < ? - ?
        )
        SELECT 
            ts.slot as x,
            IFNULL(${aggregate.toUpperCase()}(m.metricValue), 0) as y
        FROM time_spine ts
        LEFT JOIN metric m ON 
            m.processId = ? AND 
            m.metricName = ? AND 
            m.timestamp >= ts.slot AND 
            m.timestamp < ts.slot + ?
        GROUP BY ts.slot
        ORDER BY ts.slot ASC;
    `
    return db
        .prepare(query)
        .all(start, sample, end, sample, processId, metricName, sample)
}

// communication

const createCommunicationTable = () => {
    db.exec(
        `CREATE TABLE communication (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        processId CHAR(50),
        createdAt DATETIME,
        updatedAt DATETIME,
        userId INTEGER,
        type TEXT,
        name TEXT,
        data TEXT,
        rsp TEXT
        )`
    )
    db.exec(
        'CREATE INDEX idx_communication_lookup ON communication(processId, userId, type, name);'
    )
}

export const getCommunicationAndCount = (
    processId,
    typeList,
    namePattern,
    offset,
    limit
) => {
    const conditions = [],
        paramList = []
    conditions.push('processId = #')
    paramList.push(processId)
    if (typeList && typeList.length > 0) {
        conditions.push(
            `type IN (${Array(typeList.length).fill('#').join(',')})`
        )
        typeList.forEach(type => {
            paramList.push(type)
        })
    }
    if (namePattern) {
        conditions.push('name LIKE #')
        paramList.push('%' + namePattern + '%')
    }
    const clause = conditions.join(' AND ')

    const { count } = sql.get(
        `SELECT COUNT(*) as count FROM communication WHERE ${clause}`.split(
            '#'
        ),
        ...paramList
    )

    paramList.push(limit)
    paramList.push(offset)

    const items = sql.all(
        `SELECT * FROM communication WHERE ${clause} ORDER BY id DESC LIMIT # OFFSET #`.split(
            '#'
        ),
        ...paramList
    )

    return { count, items }
}

export const createCommunication = communication => {
    const now = Date.now()
    return sql.run`INSERT INTO communication
        (processId, createdAt, updatedAt, userId, type, name, data, rsp)
        VALUES (
        ${communication.processId ?? null},
        ${now},
        ${now},
        ${communication.userId ?? null},
        ${communication.type ?? null},
        ${communication.name ?? null},
        ${communication.data ?? null},
        ${communication.rsp ?? null})`
}

export const updateCommunication = (id, rsp) => {
    const now = Date.now()
    return sql.run`UPDATE communication SET rsp = ${rsp}, updatedAt = ${now} WHERE id = ${id}`
}

// deployment

const createDeploymentTable = () => {
    db.exec(
        `CREATE TABLE deployment (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        createdAt DATETIME,
        updatedAt DATETIME,
        userId INTEGER,
        name TEXT,
        key TEXT,
        user TEXT,
        host TEXT,
        sshOptions TEXT,
        ref TEXT,
        repo TEXT,
        path TEXT,
        preSetup TEXT,
        postSetup TEXT,
        preDeployLocal TEXT,
        postDeploy TEXT
        )`
    )
}

export const getDeployments = () => {
    return sql.all`SELECT * FROM deployment`
}

export const getDeploymentById = id => {
    return sql.get`SELECT * FROM deployment WHERE id = ${id}`
}

export const createDeployment = deployment => {
    const now = Date.now()
    return sql.run`INSERT INTO deployment
        (createdAt, updatedAt,
        userId, name, key, user, host,
        sshOptions, ref, repo, path,
        preSetup, postSetup, preDeployLocal, postDeploy)
        VALUES (${now}, ${now},
        ${deployment.userId}, ${deployment.name}, ${deployment.key}, ${deployment.user}, ${deployment.host},
        ${deployment.sshOptions}, ${deployment.ref}, ${deployment.repo}, ${deployment.path},
        ${deployment.preSetup}, ${deployment.postSetup}, ${deployment.preDeployLocal}, ${deployment.postDeploy})`
}

export const updateDeployment = deployment => {
    const now = Date.now()
    return sql.run`UPDATE deployment SET
        updatedAt = ${now},
        userId = ${deployment.userId ?? null},
        name = ${deployment.name ?? null},
        key = ${deployment.key ?? null},
        user = ${deployment.user ?? null},
        host = ${deployment.host ?? null},
        sshOptions = ${deployment.sshOptions ?? null},
        ref = ${deployment.ref ?? null},
        repo = ${deployment.repo ?? null},
        path = ${deployment.path ?? null},
        preSetup = ${deployment.preSetup ?? null},
        postSetup = ${deployment.postSetup ?? null},
        preDeployLocal = ${deployment.preDeployLocal ?? null},
        postDeploy = ${deployment.postDeploy ?? null}
        WHERE id = ${deployment.id}`
}

export const deleteDeployment = id => {
    return sql.run`DELETE FROM deployment WHERE id = ${id}`
}

// backup

export const createBackupTable = () => {
    db.exec(
        `CREATE TABLE backup (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        createdAt DATETIME,
        updatedAt DATETIME,
        userId INTEGER,
        name TEXT,
        apps TEXT,
        deployments TEXT,
        metadata TEXT
        )`
    )
}

export const getBackups = () => {
    return sql.all`SELECT id, createdAt, updatedAt, userId, name, metadata FROM backup`
}

export const getBackupById = id => {
    return sql.get`SELECT * FROM backup WHERE id = ${id}`
}

export const createBackup = backup => {
    const now = Date.now()
    return sql.run`INSERT INTO backup
        (createdAt, updatedAt, userId, name, metadata, apps, deployments)
        VALUES (${now}, ${now}, ${backup.userId}, ${backup.name}, ${backup.metadata}, ${backup.apps}, ${backup.deployments})`
}

export const updateBackup = backup => {
    const now = Date.now()
    return sql.run`UPDATE backup SET
        updatedAt = ${now},
        name = ${backup.name ?? null}
        WHERE id = ${backup.id}`
}

export const deleteBackup = id => {
    return sql.run`DELETE FROM backup WHERE id = ${id}`
}

// admin log

export const createAdminLogTable = () => {
    return db.exec(
        `CREATE TABLE adminLog (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        createdAt DATETIME,
        updatedAt DATETIME,
        userId INTEGER,
        userDisplayName TEXT,
        action TEXT,
        category TEXT,
        successful TINYINT,
        resourceName TEXT,
        resourceData TEXT,
        errorMsg TEXT
        )`
    )
}

export const createAdminLog = adminLog => {
    const now = Date.now()
    return sql.run`INSERT INTO adminLog
        (createdAt, updatedAt, userId, userDisplayName,
        action, category, successful, resourceName, resourceData, errorMsg)
        VALUES (${now}, ${now}, ${adminLog.userId}, ${adminLog.userDisplayName ?? null},
        ${adminLog.action ?? null}, ${adminLog.category ?? null}, ${adminLog.successful ?? null}, ${adminLog.resourceName ?? null},
        ${adminLog.resourceData ?? null}, ${adminLog.errorMsg ?? null})`
}

export const getAdminLogById = id => {
    return sql.get`SELECT * FROM adminLog WHERE id = ${id}`
}

export const getAdminLogsAndCount = (
    userId,
    actionList,
    categoryList,
    successful,
    resourceNamePattern,
    offset,
    limit
) => {
    const conditions = []
    const paramList = []

    if (userId) {
        conditions.push('userId = #')
        paramList.push(userId)
    }

    if (actionList && actionList.length > 0) {
        conditions.push(
            `action IN (${Array(actionList.length).fill('#').join(', ')})`
        )
        actionList.forEach(action => paramList.push(action))
    }

    if (categoryList && categoryList.length > 0) {
        conditions.push(
            `category IN (${Array(categoryList.length).fill('#').join(', ')})`
        )
        categoryList.forEach(category => paramList.push(category))
    }

    if (successful != null) {
        conditions.push('successful = #')
        paramList.push(successful ? 1 : 0)
    }

    if (resourceNamePattern) {
        conditions.push('resourceName LIKE #')
        paramList.push(`%${resourceNamePattern}%`)
    }

    const clauses =
        conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    const countSql = `SELECT COUNT(*) AS count FROM adminLog ${clauses}`
    const { count } = sql.get(countSql.split('#'), ...paramList)

    const itemSql = `SELECT * FROM adminLog ${clauses} ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`
    const items = sql.all(itemSql.split('#'), ...paramList)
    return { count, items }
}

// db clean up

export const getCountOfExpiredSettings = existingIds => {
    let clauses = ''
    if (existingIds.length > 0) {
        clauses = `WHERE processId NOT IN (${Array(existingIds.length).fill('#').join(', ')})`
    }
    const { count } = sql.get(
        `SELECT COUNT(*) AS count FROM settings ${clauses}`.split('#'),
        ...existingIds
    )
    return count
}

export const cleanSettings = (existingIds, limit) => {
    let clauses = ''
    if (existingIds.length > 0) {
        clauses = `WHERE processId NOT IN (${Array(existingIds.length).fill('#').join(', ')})`
    }
    return sql.run(
        `DELETE FROM settings WHERE id IN
        (SELECT id FROM settings ${clauses} LIMIT #)`.split('#'),
        ...existingIds,
        limit
    )
}

export const getCountOfExpiredMetrics = (existingIds, timestamp) => {
    let clauses = 'WHERE timestamp < #'
    if (existingIds.length > 0) {
        clauses = `WHERE timestamp < # OR processId NOT IN (${Array(existingIds.length).fill('#').join(', ')})`
    }
    const { count } = sql.get(
        `SELECT COUNT(*) AS count FROM metric ${clauses}`.split('#'),
        timestamp,
        ...existingIds
    )
    return count
}

export const cleanMetrics = (existingIds, timestamp, limit) => {
    let clauses = 'WHERE timestamp < #'
    if (existingIds.length > 0) {
        clauses = `WHERE timestamp < # OR processId NOT IN (${Array(existingIds.length).fill('#').join(', ')})`
    }
    return sql.run(
        `DELETE FROM metric WHERE id IN (
            SELECT id FROM metric ${clauses} LIMIT #)`.split('#'),
        timestamp,
        ...existingIds,
        limit
    )
}

export const getCountOfExpiredCommunications = (existingIds, timestamp) => {
    let clauses = 'WHERE createdAt < #'
    if (existingIds.length > 0) {
        clauses = `WHERE createdAt < # OR processId NOT IN (${Array(existingIds.length).fill('#').join(', ')})`
    }
    const { count } = sql.get(
        `SELECT COUNT(*) AS count FROM communication ${clauses}`.split('#'),
        timestamp,
        ...existingIds
    )
    return count
}

export const cleanCommunications = (existingIds, timestamp, limit) => {
    let clauses = 'WHERE createdAt < #'
    if (existingIds.length > 0) {
        clauses = `WHERE createdAt < # OR processId NOT IN (${Array(existingIds.length).fill('#').join(', ')})`
    }
    return sql.run(
        `DELETE FROM communication WHERE id IN (
            SELECT id FROM communication ${clauses} LIMIT #)`.split('#'),
        timestamp,
        ...existingIds,
        limit
    )
}

export const getCountOfExpiredAdminLogs = timestamp => {
    let clauses = 'WHERE createdAt < #'
    const { count } = sql.get(
        `SELECT COUNT(*) AS count FROM adminLog ${clauses}`.split('#'),
        timestamp
    )
    return count
}

export const cleanAdminLogs = (timestamp, limit) => {
    let clauses = 'WHERE createdAt < #'
    return sql.run(
        `DELETE FROM adminLog WHERE id IN (
            SELECT id FROM adminLog ${clauses} LIMIT #)`.split('#'),
        timestamp,
        limit
    )
}
