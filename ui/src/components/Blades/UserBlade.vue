<template>
    <UDrawer
        handle-only
        direction="right"
        :handle="false"
        :dismissible="true"
        :open="props.open"
        @update:open="e => e || emit('cancel')"
        @animationEnd="e => e || emit('close')">
        <template #body>
            <div class="flex items-center justify-between gap-4 mb-2 p-2">
                <h2 class="text-highlighted font-semibold">
                    {{
                        props.mode === 'create' ? 'Create user' : 'Update user'
                    }}
                </h2>

                <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-lucide-x"
                    @click="emit('cancel')" />
            </div>
            <div class="w-200 p-2">
                <UForm
                    :validate="validate"
                    :state="user"
                    class="space-y-4 flex flex-col h-[80vh]"
                    @submit="onSubmit">
                    <UFormField label="Email" name="email">
                        <UInput
                            :disabled="props.mode === 'update'"
                            v-model="user.email"
                            class="w-100" />
                    </UFormField>

                    <UFormField label="Enabled" name="enabled">
                        <USwitch
                            :disabled="
                                props.mode === 'update' &&
                                user.id === userStore.currentUser?.id
                            "
                            v-model="user.enabled" />
                    </UFormField>

                    <UFormField label="Super User" name="superUser">
                        <USwitch
                            :disabled="
                                props.mode === 'update' &&
                                user.id === userStore.currentUser?.id
                            "
                            v-model="user.superUser" />
                    </UFormField>

                    <UFormField label="Avatar" name="avatar">
                        <AvatarSelector v-model="user.avatar"></AvatarSelector>
                    </UFormField>

                    <UFormField label="Display Name" name="displayName">
                        <UInput v-model="user.displayName" class="w-100" />
                    </UFormField>

                    <UFormField label="Password" name="password">
                        <UInput
                            v-model="user.password"
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
import { ref, toRaw } from 'vue'
import { useUserStore } from '../../stores/user.js'
import AvatarSelector from '../AvatarSelector.vue'

const userStore = useUserStore()

const props = defineProps({
    open: Boolean,
    initVal: Object,
    mode: {
        type: String,
        default: 'create'
    }
})

const emit = defineEmits(['submit', 'cancel', 'close'])

const user = ref(props.initVal)
const passwordChanged = ref(false)

const validate = state => {
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
    emit('submit', {
        user: toRaw(user.value),
        passwordChanged: passwordChanged.value
    })
}
</script>
