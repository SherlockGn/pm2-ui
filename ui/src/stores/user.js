import { defineStore } from 'pinia'
import { request } from './http.js'

import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
    const currentUser = ref(null)
    const users = ref([])

    const login = async (email, password) => {
        const response = await request.post('user/login', null, {
            auth: {
                username: email,
                password: password
            }
        })

        const successful = !!response

        if (successful) {
            localStorage.setItem('token', response.data.jwt)
            currentUser.value = response.data
        }

        return successful
    }

    const refresh = async () => {
        let data = (await request.get('user'))?.data
        if (!data) {
            return false
        }

        users.value = data

        data = (await request.get('user/self'))?.data
        if (!data) {
            return false
        }
        currentUser.value = data

        return true
    }

    const updateUser = async user => {
        return !!(await request.put(`user/${user.id}`, user))
    }

    const updateEnabled = async (id, enabled) => {
        return !!(await request.put(`user/${id}`, { id, enabled }))
    }

    const updateSuperUser = async (id, superUser) => {
        return !!(await request.put(`user/${id}`, { id, superUser }))
    }

    const deleteItem = async id => {
        return !!(await request.delete(`user/${id}`))
    }

    const createUser = async user => {
        return !!(await request.post('user', user))
    }

    const getDefault = () => {
        return {
            email: '',
            avatar: 'streamline-stickies-color:baby',
            password: '',
            displayName: '',
            enabled: true,
            superUser: false
        }
    }

    return {
        currentUser,
        users,
        login,
        refresh,
        deleteItem,
        createUser,
        updateUser,
        updateEnabled,
        updateSuperUser,
        getDefault
    }
})
