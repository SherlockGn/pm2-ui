import { hash, compare } from 'bcryptjs'
import { sign, verify } from 'hono/jwt'

import { getJwtKey } from './kv.js'
import { getSettings } from './kv.js'

import {
    getUsers,
    createUser,
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser
} from './database.js'

const fromDataObject = user => {
    if (!user) {
        return null
    }
    return {
        id: user.id,
        displayName: user.displayName,
        password: user.password,
        avatar: user.avatar,
        email: user.email,
        superUser: !!user.superUser,
        enabled: !!user.enabled,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    }
}

const toDataObject = user => {
    if (!user) {
        return null
    }
    return {
        id: user.id,
        displayName: user.displayName,
        avatar: user.avatar,
        email: user.email,
        password: user.password,
        superUser: +user.superUser,
        enabled: +user.enabled,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    }
}

const sanitise = user => {
    user.password = null
}

export const list = async (shouldSanitise = true) => {
    const users = getUsers().map(fromDataObject)
    if (shouldSanitise) {
        users.forEach(sanitise)
    }
    return users
}

export const getById = async id => {
    const user = fromDataObject(getUserById(id))
    return user
}

export const create = async user => {
    if (getUserByEmail(user.email)) {
        throw new Error('User already exists')
    }
    user.password = await hash(user.password, 10)
    return createUser(toDataObject(user))
}

export const logIn = async (email, password) => {
    let user = getUserByEmail(email)
    if (!user) {
        throw new Error('User not found')
    }

    if (!user.enabled) {
        throw new Error('User is disabled')
    }

    const match = await compare(password, user.password)
    if (!match) {
        throw new Error('Password is incorrect')
    }

    user.lastLogin = new Date().toISOString()
    updateUser(user)

    const expire = Math.floor(getSettings().tokenExpireTime / 1000)
    const now = Date.now()

    const payload = {
        id: user.id,
        exp: Math.floor(now / 1000) + expire
    }

    user = fromDataObject(user)

    user.jwt = await sign(payload, await getJwtKey())
    user.expiresIn = new Date(now + expire * 1000)

    sanitise(user)

    return user
}

export const logInByJwt = async token => {
    const { id } = await verify(token, await getJwtKey(), 'HS256')
    if (!id) {
        throw new Error('User not found')
    }

    const user = fromDataObject(getUserById(id))

    if (!user) {
        throw new Error('User not found')
    }

    if (!user.enabled) {
        throw new Error('User is disabled')
    }

    sanitise(user)

    return user
}

export const update = async user => {
    const originalUserDataObject = getUserById(user.id)
    const userById = fromDataObject(originalUserDataObject)
    if (!userById) {
        throw new Error('User not found')
    }
    userById.password = originalUserDataObject.password
    if (user.displayName) {
        userById.displayName = user.displayName
    }
    if (user.avatar) {
        userById.avatar = user.avatar
    }
    if (user.superUser != undefined) {
        userById.superUser = user.superUser
    }
    if (user.password) {
        userById.password = await hash(user.password, 10)
    }
    if (user.enabled != undefined) {
        userById.enabled = user.enabled
    }
    return updateUser(toDataObject(userById))
}

export const deleteById = async id => {
    return deleteUser(id)
}

export const init = async () => {
    return await create({
        displayName: 'Dashboard Administrator',
        avatar: 'streamline-stickies-color:baby',
        email: 'admin@example.com',
        password: 'admin',
        superUser: true,
        enabled: true
    })
}
