<template>
    <div class="flex flex-col items-center justify-center h-screen">
        <UAuthForm
            :title="$t('login.title')"
            :description="$t('login.description')"
            icon="i-lucide-user"
            :fields="fields"
            @submit="login"
            class="max-w-md" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.js'

const { t } = useI18n()
const router = useRouter()
const toast = useToast()

const userStore = useUserStore()

const fields = ref([
    {
        name: 'email',
        type: 'text',
        label: t('login.email')
    },
    {
        name: 'password',
        type: 'password',
        label: t('login.password')
    }
])

const login = async e => {
    const data = e.data

    const loginSuccess = await userStore.login(data.email, data.password)

    if (!loginSuccess) {
        toast.add({
            title: t('error.invalidCredentials'),
            description: t('error.invalidCredentialsDescription'),
            icon: 'i-lucide-x',
            color: 'error'
        })

        return
    }

    toast.add({
        title: userStore.currentUser.displayName,
        description: t('login.welcomeDescription'),
        avatar: { icon: userStore.currentUser.avatar },
        color: 'primary'
    })

    router.push({ name: 'management' })
}
</script>
