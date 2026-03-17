<template>
    <UDrawer
        handle-only
        direction="right"
        :handle="false"
        :dismissible="true"
        v-model:open="deploymentStore.deploymentBladeOpen">
        <template #body>
            <div class="flex items-center justify-between gap-4 mb-2 p-2">
                <h2 class="text-highlighted font-semibold">
                    {{
                        deploymentStore.deploymentBladeMode === 'create'
                            ? 'Create deployment'
                            : 'Update deployment'
                    }}
                </h2>

                <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-lucide-x"
                    @click="deploymentStore.deploymentBladeOpen = false" />
            </div>
            <div class="w-200 p-2">
                <UForm
                    :validate="validate"
                    :state="deploymentStore.activeDeployment"
                    class="space-y-4 flex flex-col h-[85vh]"
                    @submit="onSubmit">
                    <div class="h-[calc(100vh-5rem)] overflow-y-auto">
                        <UFormField label="Name" name="name" class="mb-5">
                            <UInput
                                v-model="deploymentStore.activeDeployment.name"
                                class="w-100" />
                        </UFormField>

                        <UFormField
                            label="Key"
                            description="SSH key path"
                            name="key"
                            class="mb-5">
                            <UInput
                                v-model="deploymentStore.activeDeployment.key"
                                class="w-100" />
                        </UFormField>

                        <UFormField
                            label="User"
                            description="SSH user"
                            name="user"
                            class="mb-5">
                            <UInput
                                v-model="deploymentStore.activeDeployment.user"
                                class="w-100" />
                        </UFormField>

                        <UFormField
                            label="Hosts"
                            description="SSH hosts"
                            name="host"
                            class="mb-5">
                            <StringList
                                v-model="deploymentStore.activeDeployment.host"
                                class="w-100" />
                        </UFormField>

                        <UFormField
                            label="SSH options"
                            description="SSH options with no command-line flag, see 'man ssh'"
                            name="sshOptions"
                            class="mb-5">
                            <StringList
                                v-model="
                                    deploymentStore.activeDeployment.sshOptions
                                "
                                class="w-100" />
                        </UFormField>

                        <UFormField
                            label="Ref"
                            description="GIT remote/branch"
                            name="ref"
                            class="mb-5">
                            <UInput
                                v-model="deploymentStore.activeDeployment.ref"
                                class="w-100" />
                        </UFormField>

                        <UFormField
                            label="Repo"
                            description="GIT remote"
                            name="repo"
                            class="mb-5">
                            <UInput
                                v-model="deploymentStore.activeDeployment.repo"
                                class="w-100" />
                        </UFormField>

                        <UFormField
                            label="Path"
                            description="path in the server"
                            name="path"
                            class="mb-5">
                            <UInput
                                v-model="deploymentStore.activeDeployment.path"
                                class="w-100" />
                        </UFormField>

                        <UFormField
                            label="Pre-Setup"
                            description="Pre-setup command or path to a script on your local machine"
                            name="preSetup"
                            class="mb-5">
                            <UInput
                                v-model="
                                    deploymentStore.activeDeployment.preSetup
                                "
                                class="w-100" />
                        </UFormField>

                        <UFormField
                            label="Post-Setup"
                            description="Post-setup commands or path to a script on the host machine"
                            name="postSetup"
                            class="mb-5">
                            <UInput
                                v-model="
                                    deploymentStore.activeDeployment.postSetup
                                "
                                class="w-100" />
                        </UFormField>

                        <UFormField
                            label="Pre-Deploy Action"
                            description="pre-deploy action"
                            name="preDeployLocal"
                            class="mb-5">
                            <UInput
                                v-model="
                                    deploymentStore.activeDeployment
                                        .preDeployLocal
                                "
                                class="w-100" />
                        </UFormField>

                        <UFormField
                            label="Post-Deploy Action"
                            description="post-deploy action"
                            name="postDeploy"
                            class="mb-5">
                            <UInput
                                v-model="
                                    deploymentStore.activeDeployment.postDeploy
                                "
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
import { ref, toRaw, watchEffect } from 'vue'
import { useDeploymentStore } from '../stores/deployment.js'
import { addSuccessfulToast } from '../utils.js'
import StringList from './StringList.vue'

const deploymentStore = useDeploymentStore()

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
    try {
        if (deploymentStore.deploymentBladeMode === 'create') {
            if (
                await deploymentStore.create(
                    toRaw(deploymentStore.activeDeployment)
                )
            ) {
                addSuccessfulToast('Created successfully')
            }
        }

        if (deploymentStore.deploymentBladeMode === 'update') {
            if (
                await deploymentStore.update(
                    toRaw(deploymentStore.activeDeployment)
                )
            ) {
                addSuccessfulToast('Updated successfully')
            }
        }
    } finally {
        await deploymentStore.refresh()
        deploymentStore.deploymentBladeOpen = false
    }
}
</script>
