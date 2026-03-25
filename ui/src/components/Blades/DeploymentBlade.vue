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
                            ? $t('deploymentBlade.createDeployment')
                            : $t('deploymentBlade.updateDeployment')
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
                    :state="deployment"
                    class="space-y-4 flex flex-col h-[85vh]"
                    @submit="onSubmit">
                    <div class="h-[calc(100vh-5rem)] overflow-y-auto">
                        <UFormField
                            :label="$t('deploymentBlade.name')"
                            name="name"
                            class="mb-5">
                            <UInput v-model="deployment.name" class="w-100" />
                        </UFormField>

                        <UFormField
                            :label="$t('deploymentBlade.key')"
                            :description="$t('deploymentBlade.sshKeyPath')"
                            name="key"
                            class="mb-5">
                            <UInput v-model="deployment.key" class="w-100" />
                        </UFormField>

                        <UFormField
                            :label="$t('deploymentBlade.user')"
                            :description="$t('deploymentBlade.sshUser')"
                            name="user"
                            class="mb-5">
                            <UInput v-model="deployment.user" class="w-100" />
                        </UFormField>

                        <UFormField
                            :label="$t('deploymentBlade.hosts')"
                            :description="$t('deploymentBlade.sshHosts')"
                            name="host"
                            class="mb-5">
                            <StringList
                                v-model="deployment.host"
                                class="w-100" />
                        </UFormField>

                        <UFormField
                            :label="$t('deploymentBlade.sshOptions')"
                            :description="
                                $t('deploymentBlade.sshOptionsDescription')
                            "
                            name="sshOptions"
                            class="mb-5">
                            <StringList
                                v-model="deployment.sshOptions"
                                class="w-100" />
                        </UFormField>

                        <UFormField
                            :label="$t('deploymentBlade.ref')"
                            :description="$t('deploymentBlade.gitRemoteBranch')"
                            name="ref"
                            class="mb-5">
                            <UInput v-model="deployment.ref" class="w-100" />
                        </UFormField>

                        <UFormField
                            :label="$t('deploymentBlade.repo')"
                            :description="$t('deploymentBlade.gitRemote')"
                            name="repo"
                            class="mb-5">
                            <UInput v-model="deployment.repo" class="w-100" />
                        </UFormField>

                        <UFormField
                            :label="$t('deploymentBlade.path')"
                            :description="$t('deploymentBlade.pathInTheServer')"
                            name="path"
                            class="mb-5">
                            <UInput v-model="deployment.path" class="w-100" />
                        </UFormField>

                        <UFormField
                            :label="$t('deploymentBlade.preSetup')"
                            :description="
                                $t('deploymentBlade.preSetupDescription')
                            "
                            name="preSetup"
                            class="mb-5">
                            <UInput
                                v-model="deployment.preSetup"
                                class="w-100" />
                        </UFormField>

                        <UFormField
                            :label="$t('deploymentBlade.postSetup')"
                            :description="
                                $t('deploymentBlade.postSetupDescription')
                            "
                            name="postSetup"
                            class="mb-5">
                            <UInput
                                v-model="deployment.postSetup"
                                class="w-100" />
                        </UFormField>

                        <UFormField
                            :label="$t('deploymentBlade.preDeployAction')"
                            :description="
                                $t('deploymentBlade.preDeployActionDescription')
                            "
                            name="preDeployLocal"
                            class="mb-5">
                            <UInput
                                v-model="deployment.preDeployLocal"
                                class="w-100" />
                        </UFormField>

                        <UFormField
                            :label="$t('deploymentBlade.postDeployAction')"
                            :description="
                                $t(
                                    'deploymentBlade.postDeployActionDescription'
                                )
                            "
                            name="postDeploy"
                            class="mb-5">
                            <UInput
                                v-model="deployment.postDeploy"
                                class="w-100" />
                        </UFormField>
                    </div>
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
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import StringList from '../StringList.vue'

const { t } = useI18n()

const props = defineProps({
    open: Boolean,
    initVal: Object,
    mode: {
        type: String,
        default: 'create'
    }
})

const emit = defineEmits(['submit', 'cancel', 'close'])

const deployment = ref(props.initVal)

function validate(state) {
    const errors = []
    if (!state.name) {
        errors.push({ name: 'name', message: t('common.required') })
    }
    if (!state.user) {
        errors.push({ name: 'user', message: t('common.required') })
    }
    if (!state.host.length) {
        errors.push({ name: 'host', message: t('common.required') })
    }
    if (!state.repo) {
        errors.push({ name: 'repo', message: t('common.required') })
    }
    if (!state.ref) {
        errors.push({ name: 'ref', message: t('common.required') })
    }
    if (!state.path) {
        errors.push({ name: 'path', message: t('common.required') })
    }
    return errors
}

const onSubmit = async () => {
    emit('submit', deployment.value)
}
</script>
