import axios from 'axios'
import { router } from '../router.js'
import { i18n } from '../i18n.js'

const t = key => i18n.global.t(key)

export const request = axios.create({
    baseURL: import.meta.env.DEV ? 'http://localhost:12345/api' : '/api',
    timeout: 30000,
    responseType: 'json'
})

request.interceptors.request.use(config => {
    const token = localStorage.getItem('token')

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    if (config.data) {
        config.headers['Content-Type'] = 'application/json'
    }

    return config
})

request.interceptors.response.use(undefined, async error => {
    if (
        error.response?.status === 401 &&
        router.currentRoute.value.name !== 'login'
    ) {
        router.push({ name: 'login' })

        useToast().add({
            title: t('error.sessionExpired'),
            description: t('error.sessionExpiredDescription'),
            icon: 'i-lucide-x',
            color: 'error'
        })
    }
    if (error.response?.status === 500) {
        useToast().add({
            title: t('error.error'),
            description:
                error.response.data?.error ?? t('error.anErrorOccurred'),
            icon: 'i-lucide-circle-x',
            color: 'error'
        })
    }
})
