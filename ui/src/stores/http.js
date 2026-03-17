import axios from 'axios'
import { router } from '../router.js'

const toast = useToast()

export const request = axios.create({
    baseURL: 'http://localhost:12345/api',
    timeout: 5000,
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    },
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
    if (error.response?.status === 401 && router.currentRoute.value.name !== 'login') {
        router.push({ name: 'login' })

        toast.add({
            title: 'Token expired.',
            description: 'Your token is expired and please login again.',
            icon: 'i-lucide-x',
            color: 'error'
        })
    }
    if (error.response?.status === 500) {
        toast.add({
            title: 'Error.',
            description: error.response.data?.error ?? 'An error occurred.',
            icon: 'i-lucide-circle-x',
            color: 'error'
        })
    }
})
