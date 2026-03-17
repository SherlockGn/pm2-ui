import { createApp, ref } from 'vue'
import TerminalResultBlade from './components/TerminalResultBlade.vue'

const toast = useToast()

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
    toast.add({
        title: message,
        color: 'success',
        icon: 'i-lucide-circle-check'
    })
}

export const addErrorToast = message => {
    toast.add({
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

export const createTerminalResultBlade = options => {
    const { title, value, autoRun, exec } = options

    const modelValue = ref(true)
    const app = createApp(TerminalResultBlade, {
        modelValue,
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

    const div = document.createElement('div')
    document.body.appendChild(div)
    app.mount(div)

    const destroy = () => {
        app.unmount()
        div.remove()
    }
}
