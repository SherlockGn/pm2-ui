<template>
    <UDrawer
        handle-only
        direction="right"
        :handle="false"
        :dismissible="true"
        v-model:open="userStore.userBladeOpen">
        <template #body>
            <div class="flex items-center justify-between gap-4 mb-2 p-2">
                <h2 class="text-highlighted font-semibold">
                    {{
                        userStore.userBladeMode === 'create'
                            ? 'Create user'
                            : 'Update user'
                    }}
                </h2>

                <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-lucide-x"
                    @click="userStore.userBladeOpen = false" />
            </div>
            <div class="w-200 p-2">
                <UForm
                    :validate="validate"
                    :state="userStore.userBlade"
                    class="space-y-4 flex flex-col h-[80vh]"
                    @submit="onSubmit">
                    <UFormField label="Email" name="email">
                        <UInput
                            :disabled="userStore.userBladeMode === 'update'"
                            v-model="userStore.userBlade.email"
                            class="w-100" />
                    </UFormField>

                    <UFormField label="Enabled" name="enabled">
                        <USwitch
                            :disabled="
                                userStore.userBladeMode === 'update' &&
                                userStore.userBlade.id ===
                                    userStore.currentUser?.id
                            "
                            v-model="userStore.userBlade.enabled" />
                    </UFormField>

                    <UFormField label="Super User" name="superUser">
                        <USwitch
                            :disabled="
                                userStore.userBladeMode === 'update' &&
                                userStore.userBlade.id ===
                                    userStore.currentUser?.id
                            "
                            v-model="userStore.userBlade.superUser" />
                    </UFormField>

                    <UFormField label="Avatar" name="avatar">
                        <AvatarSelector v-model="userStore.userBlade.avatar"></AvatarSelector>
                    </UFormField>

                    <UFormField label="Display Name" name="displayName">
                        <UInput
                            v-model="userStore.userBlade.displayName"
                            class="w-100" />
                    </UFormField>

                    <UFormField label="Password" name="password">
                        <UInput
                            v-model="userStore.userBlade.password"
                            type="password"
                            @input="passwordChanged = true"
                            class="w-100" />
                    </UFormField>

                    <div class="mt-auto mb-20">
                        <UButton type="submit" class="">Submit</UButton>
                    </div>
                </UForm>
            </div>
        </template>
    </UDrawer>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useUserStore } from '../stores/user.js'
import { addSuccessfulToast } from '../utils.js'
import AvatarSelector from './AvatarSelector.vue'

const userStore = useUserStore()

const passwordChanged = ref(false)

function validate(state) {
    const errors = []
    if (!state.email) {
        errors.push({ name: 'email', message: 'Required' })
    }
    if (!state.password) {
        errors.push({ name: 'password', message: 'Required' })
    }
    if (!state.avatar) {
        errors.push({ name: 'avatar', message: 'Required' })
    }
    if (!state.displayName) {
        errors.push({ name: 'displayName', message: 'Required' })
    }
    return errors
}

const onSubmit = async () => {
    userStore.userBladeOpen = false
    try {
        if (userStore.userBladeMode === 'create') {
            const user = {
                ...userStore.userBlade
            }
            if (await userStore.createUser(user)) {
                addSuccessfulToast('Created successfully')
            }
        }

        if (userStore.userBladeMode === 'update') {
            const user = {
                ...userStore.userBlade
            }
            if (!passwordChanged.value) {
                delete user.password
            }
            if (await userStore.updateUser(user)) {
                addSuccessfulToast('Updated successfully')
            }
        }
    } finally {
        await userStore.refresh()
        userStore.userBladeOpen = false
    }
}

watchEffect(() => {
    if (userStore.userBladeOpen) {
        passwordChanged.value = false
    }
})
</script>
