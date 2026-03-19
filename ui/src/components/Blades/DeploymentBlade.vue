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
                            ? 'Create deployment'
                            : 'Update deployment'
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
                        <UFormField label="Name" name="name" class="mb-5">
                            <UInput v-model="deployment.name" class="w-100" />
                        </UFormField>

                        <UFormField
                            label="Key"
                            description="SSH key path"
                            name="key"
                            class="mb-5">
                            <UInput v-model="deployment.key" class="w-100" />
                        </UFormField>

                        <UFormField
                            label="User"
                            description="SSH user"
                            name="user"
                            class="mb-5">
                            <UInput v-model="deployment.user" class="w-100" />
                        </UFormField>

                        <UFormField
                            label="Hosts"
                            description="SSH hosts"
                            name="host"
                            class="mb-5">
                            <StringList
                                v-model="deployment.host"
                                class="w-100" />
                        </UFormField>

                        <UFormField
                            label="SSH options"
                            description="SSH options with no command-line flag, see 'man ssh'"
                            name="sshOptions"
                            class="mb-5">
                            <StringList
                                v-model="deployment.sshOptions"
                                class="w-100" />
                        </UFormField>

                        <UFormField
                            label="Ref"
                            description="GIT remote/branch"
                            name="ref"
                            class="mb-5">
                            <UInput v-model="deployment.ref" class="w-100" />
                        </UFormField>

                        <UFormField
                            label="Repo"
                            description="GIT remote"
                            name="repo"
                            class="mb-5">
                            <UInput v-model="deployment.repo" class="w-100" />
                        </UFormField>

                        <UFormField
                            label="Path"
                            description="path in the server"
                            name="path"
                            class="mb-5">
                            <UInput v-model="deployment.path" class="w-100" />
                        </UFormField>

                        <UFormField
                            label="Pre-Setup"
                            description="Pre-setup command or path to a script on your local machine"
                            name="preSetup"
                            class="mb-5">
                            <UInput
                                v-model="deployment.preSetup"
                                class="w-100" />
                        </UFormField>

                        <UFormField
                            label="Post-Setup"
                            description="Post-setup commands or path to a script on the host machine"
                            name="postSetup"
                            class="mb-5">
                            <UInput
                                v-model="deployment.postSetup"
                                class="w-100" />
                        </UFormField>

                        <UFormField
                            label="Pre-Deploy Action"
                            description="pre-deploy action"
                            name="preDeployLocal"
                            class="mb-5">
                            <UInput
                                v-model="deployment.preDeployLocal"
                                class="w-100" />
                        </UFormField>

                        <UFormField
                            label="Post-Deploy Action"
                            description="post-deploy action"
                            name="postDeploy"
                            class="mb-5">
                            <UInput
                                v-model="deployment.postDeploy"
                                class="w-100" />
                        </UFormField>
                    </div>
                    <div class="mt-auto mb-20">
                        <UButton type="submit" class="">Submit</UButton>
                    </div>
                </UForm>
            </div>
        </template>
    </UDrawer>
</template>

<script setup>
import { ref } from 'vue'
import StringList from '../StringList.vue'

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
        errors.push({ name: 'name', message: 'Required' })
    }
    if (!state.user) {
        errors.push({ name: 'user', message: 'Required' })
    }
    if (!state.host.length) {
        errors.push({ name: 'host', message: 'Required' })
    }
    if (!state.repo) {
        errors.push({ name: 'repo', message: 'Required' })
    }
    if (!state.ref) {
        errors.push({ name: 'ref', message: 'Required' })
    }
    if (!state.path) {
        errors.push({ name: 'path', message: 'Required' })
    }
    return errors
}

const onSubmit = async () => {
    emit('submit', deployment.value)
}
</script>
