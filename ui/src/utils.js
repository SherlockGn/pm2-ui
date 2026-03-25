import { render, h, ref, toRaw } from 'vue'
import TerminalResultBlade from './components/Blades/TerminalResultBlade.vue'
import { i18n } from './i18n.js'

const t = key => i18n.global.t(key)

export const formatDate = date => {
    if (!date) {
        return t('common.na')
    }
    return new Date(date).toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    })
}

export const toFriendlyPeriod = milliseconds => {
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) {
        return `${days} ${days > 1 ? t('utils.days') : t('utils.day')}`
    }

    if (hours > 0) {
        return `${hours} ${hours > 1 ? t('utils.hours') : t('utils.hour')}`
    }

    if (minutes > 0) {
        return `${minutes} ${minutes > 1 ? t('utils.minutes') : t('utils.minute')}`
    }

    return `${seconds} ${seconds > 1 ? t('utils.seconds') : t('utils.second')}`
}

export const toFriendlyMemory = bytes => {
    if (bytes == null) {
        return t('common.na')
    }

    if (bytes < 1024) {
        return `${bytes} ${t('utils.memoryUnits.b')}`
    }

    const kilobytes = bytes / 1024
    if (kilobytes < 1024) {
        return `${kilobytes.toFixed(2)} ${t('utils.memoryUnits.kb')}`
    }

    const megabytes = kilobytes / 1024

    if (megabytes < 1024) {
        return `${megabytes.toFixed(2)} ${t('utils.memoryUnits.mb')}`
    }

    const gigabytes = megabytes / 1024
    return `${gigabytes.toFixed(2)} ${t('utils.memoryUnits.gb')}`
}

export const addSuccessfulToast = message => {
    useToast().add({
        title: message,
        color: 'success',
        icon: 'i-lucide-circle-check'
    })
}

export const addErrorToast = message => {
    useToast().add({
        title: message,
        color: 'error',
        icon: 'i-lucide-circle-x'
    })
}

export const getStatusColor = status => {
    status = status.toLowerCase()
    if (status === 'online') {
        return 'success'
    }
    if (status === 'stopped' || status === 'errored') {
        return 'error'
    }
    return 'neutral'
}

let _context = null

export const MyComponentsPlugin = {
    install(app) {
        _context = app._context
    }
}

export const createCommonBlade = async (component, options = {}) => {
    const {
        initVal = null,
        props = {},
        subscribedEvents = ['submit', 'cancel']
    } = options
    const container = document.createElement('div')
    const destroy = () => {
        render(null, container)
        container.remove()
    }

    let resolvePromise
    const promise = new Promise(resolve => {
        resolvePromise = resolve
    })

    const open = ref(true)
    const componentInstance = {
        setup() {
            return () => {
                const finalProps = {
                    initVal: toRaw(initVal),
                    open: open.value,
                    ...props,
                    'onUpdate:open': value => {
                        open.value = value
                    },
                    onClose: () => {
                        destroy()
                    }
                }
                subscribedEvents.forEach(event => {
                    finalProps[`on${event[0].toUpperCase()}${event.slice(1)}`] =
                        data => {
                            open.value = false
                            resolvePromise({ event, data: toRaw(data) })
                        }
                })
                return h(component, finalProps)
            }
        }
    }

    const vnode = h(componentInstance)
    vnode.appContext = _context
    render(vnode, container)
    document.body.appendChild(container)

    return promise
}

export const createTerminalResultBlade = async options => {
    const { title, value, autoRun, exec } = options
    return await createCommonBlade(TerminalResultBlade, {
        initVal: { title, value, autoRun, exec },
        subscribedEvents: ['cancel']
    })
}
