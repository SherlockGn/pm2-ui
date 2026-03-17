import {
    createAdminLog,
    getAdminLogsAndCount,
    getAdminLogById
} from './database.js'

const fromDataObject = item => {
    if (item == null) {
        return null
    }

    return {
        id: item.id,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        userId: item.userId,
        userDisplayName: item.userDisplayName,
        action: item.action,
        category: item.category,
        successful: item.successful === 1,
        resourceName: item.resourceName,
        resourceData:
            item.resourceData == null ? null : JSON.parse(item.resourceData),
        errorMsg: item.errorMsg
    }
}

const toDataObject = item => {
    if (item == null) {
        return null
    }

    return {
        id: item.id,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        userId: item.userId,
        userDisplayName: item.userDisplayName,
        action: item.action,
        category: item.category,
        successful: +item.successful,
        resourceName: item.resourceName,
        resourceData:
            item.resourceData == null
                ? null
                : JSON.stringify(item.resourceData),
        errorMsg: item.errorMsg
    }
}

export const create = async item => {
    createAdminLog(toDataObject(item))
}

export const getById = async id => {
    return fromDataObject(getAdminLogById(id))
}

export const list = async (
    userId,
    actionList,
    categoryList,
    successful,
    resourceNamePattern,
    offset,
    limit
) => {
    const { items, count } = getAdminLogsAndCount(
        userId,
        actionList,
        categoryList,
        successful,
        resourceNamePattern,
        offset,
        limit
    )
    return { count, items: items.map(fromDataObject) }
}
