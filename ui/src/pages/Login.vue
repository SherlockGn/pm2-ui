<template>
    <div class="flex flex-col items-center justify-center h-screen">
        <UAuthForm
            title="Login"
            description="Enter your credentials to access your dashboard."
            icon="i-lucide-user"
            :fields="fields"
            @submit="login"
            class="max-w-md" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.js'

const router = useRouter()
const toast = useToast()

const userStore = useUserStore()

const fields = ref([
    {
        name: 'email',
        type: 'text',
        label: 'Email'
    },
    {
        name: 'password',
        type: 'password',
        label: 'Password'
    }
])

const login = async e => {
    const data = e.data

    const loginSuccess = await userStore.login(data.email, data.password)

    if (!loginSuccess) {
        toast.add({
            title: 'Invalid credentials.',
            description: 'The credentials you entered are invalid.',
            icon: 'i-lucide-x',
            color: 'error'
        })

        return
    }

    toast.add({
        title: userStore.currentUser.displayName,
        description:
            "Welcome! You've logged in successfully. You can now manage your processes.",
        avatar: { icon: userStore.currentUser.avatar },
        color: 'primary'
    })

    router.push({ name: 'management' })
}
</script>
