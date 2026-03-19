import { render, h, ref, toRaw } from 'vue'
import TerminalResultBlade from './components/TerminalResultBlade.vue'

export const formatDate = date => {
    if (!date) {
        return 'N/A'
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
        return `${days} day${days > 1 ? 's' : ''}`
    }

    if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''}`
    }

    if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''}`
    }

    return `${seconds} second${seconds > 1 ? 's' : ''}`
}

export const toFriendlyMemory = bytes => {
    if (bytes == null) {
        return 'N/A'
    }

    if (bytes < 1024) {
        return `${bytes} B`
    }

    const kilobytes = bytes / 1024
    if (kilobytes < 1024) {
        return `${kilobytes.toFixed(2)} KB`
    }

    const megabytes = kilobytes / 1024

    if (megabytes < 1024) {
        return `${megabytes.toFixed(2)} MB`
    }

    const gigabytes = megabytes / 1024
    return `${gigabytes.toFixed(2)} GB`
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

export const createTerminalResultBlade = options => {
    const { title, value, autoRun, exec } = options

    const container = document.createElement('div')

    const destroy = () => {
        render(null, container)
        container.remove()
    }

    const modelValue = ref(true)

    const componentInstance = {
        setup() {
            return () =>
                h(TerminalResultBlade, {
                    modelValue: modelValue.value,
                    title,
                    value,
                    autoRun,
                    exec,
                    'onUpdate:modelValue': value => {
                        modelValue.value = value
                    },
                    onClose: () => {
                        destroy()
                    }
                })
        }
    }

    const vnode = h(componentInstance)
    vnode.appContext = _context

    render(vnode, container)

    document.body.appendChild(container)

    return { destroy }
}
