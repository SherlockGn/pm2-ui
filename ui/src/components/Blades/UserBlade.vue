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
                        props.mode === 'create'
                            ? $t('userBlade.createUser')
                            : $t('userBlade.updateUser')
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
                    <UFormField :label="$t('userBlade.email')" name="email">
                        <UInput
                            :disabled="props.mode === 'update'"
                            v-model="user.email"
                            class="w-100" />
                    </UFormField>

                    <UFormField :label="$t('userBlade.enabled')" name="enabled">
                        <USwitch
                            :disabled="
                                props.mode === 'update' &&
                                user.id === userStore.currentUser?.id
                            "
                            v-model="user.enabled" />
                    </UFormField>

                    <UFormField
                        :label="$t('userBlade.superUser')"
                        name="superUser">
                        <USwitch
                            :disabled="
                                props.mode === 'update' &&
                                user.id === userStore.currentUser?.id
                            "
                            v-model="user.superUser" />
                    </UFormField>

                    <UFormField :label="$t('userBlade.avatar')" name="avatar">
                        <AvatarSelector v-model="user.avatar"></AvatarSelector>
                    </UFormField>

                    <UFormField
                        :label="$t('userBlade.displayName')"
                        name="displayName">
                        <UInput v-model="user.displayName" class="w-100" />
                    </UFormField>

                    <UFormField
                        :label="$t('userBlade.password')"
                        name="password">
                        <UInput
                            v-model="user.password"
                            type="password"
                            @input="passwordChanged = true"
                            class="w-100" />
                    </UFormField>

                    <div class="mt-auto mb-20">
                        <UButton type="submit" class="">
                            {{ $t('common.submit') }}
                        </UButton>
                    </div>
                </UForm>
            </div>
        </template>
    </UDrawer>
</template>

<script setup>
import { ref, toRaw } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '../../stores/user.js'
import AvatarSelector from '../AvatarSelector.vue'

const { t } = useI18n()

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
        errors.push({ name: 'email', message: t('common.required') })
    }
    if (!state.password) {
        errors.push({ name: 'password', message: t('common.required') })
    }
    if (!state.avatar) {
        errors.push({ name: 'avatar', message: t('common.required') })
    }
    if (!state.displayName) {
        errors.push({ name: 'displayName', message: t('common.required') })
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
