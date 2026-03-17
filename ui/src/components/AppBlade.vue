<template>
    <UDrawer
        handle-only
        direction="right"
        :handle="false"
        :dismissible="true"
        v-model:open="appStore.appBladeOpen">
        <template #body>
            <div class="flex items-center justify-between gap-4 mb-2 p-2">
                <h2 class="text-highlighted font-semibold">
                    {{
                        appStore.appBladeMode === 'create'
                            ? 'Create process'
                            : 'Update process configuration'
                    }}
                </h2>

                <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-lucide-x"
                    @click="appStore.appBladeOpen = false" />
            </div>
            <div class="w-250 p-2">
                <UForm
                    :validate="validate"
                    :state="appStore.appBlade"
                    class="space-y-4 flex flex-col h-[80vh]"
                    @submit="onSubmit">
                    <FullHeight :adjust-height="10">
                        <template #body>
                            <UTabs variant="link" :items="tabs" class="w-full">
                                <template v-for="tab in tabs" v-slot:[tab.slot]>
                                    <AppGroupProps
                                        :group="tab.slot"></AppGroupProps>
                                </template>
                            </UTabs>
                        </template>
                        <template #footer>
                            <div>
                                <UButton type="submit" class="mt-5">
                                    {{
                                        appStore.appBladeMode === 'create'
                                            ? 'Create and Run'
                                            : 'Update'
                                    }}
                                </UButton>
                                <UButton
                                    @click.prevent="createOnly"
                                    v-if="appStore.appBladeMode === 'create'"
                                    variant="outline"
                                    class="mt-5 ml-3">
                                    Create
                                </UButton>
                            </div>
                        </template>
                    </FullHeight>
                </UForm>
            </div>
        </template>
    </UDrawer>
</template>

<script setup>
import { ref } from 'vue'
import { useAppStore } from '../stores/app.js'
import { useProcessStore } from '../stores/process.js'
import { addSuccessfulToast } from '../utils.js'
import FullHeight from './FullHeight.vue'
import AppGroupProps from './AppGroupProps.vue'

import { allGroups } from '../../../parameters.js'

const appStore = useAppStore()
const processStore = useProcessStore()

const tabs = ref(
    allGroups().map(g => {
        return {
            label: g.label,
            slot: g.name,
            icon: g.icon
        }
    })
)

function validate(state) {
    const errors = []
    if (!state.name) {
        errors.push({ name: 'name', message: 'Required' })
    }
    if (!state.script) {
        errors.push({ name: 'script', message: 'Required' })
    }
    return errors
}

const createOnly = async () => {
    if (!appStore.appBlade.name) {
        appStore.appBlade.name = '[Name not specified]'
    }
    if (!appStore.appBlade.script) {
        appStore.appBlade.script = '[Script not specified]'
    }
    try {
        if (await processStore.create(appStore.getCurrentApp(), false)) {
            processStore.refresh()
            addSuccessfulToast('Created successfully')
        }
    } finally {
        appStore.appBladeOpen = false
    }
}

const onSubmit = async () => {
    appStore.appBladeOpen = false
    try {
        if (appStore.appBladeMode === 'create') {
            if (await processStore.create(appStore.getCurrentApp(), true)) {
                processStore.refresh()
                addSuccessfulToast('Created successfully')
            }
        }

        if (appStore.appBladeMode === 'update') {
            if (
                await processStore.update(
                    processStore.activeProcess.pmId,
                    appStore.getCurrentApp()
                )
            ) {
                processStore.refresh()
                addSuccessfulToast('Updated successfully')
            }
        }
    } finally {
        processStore.refresh()
        appStore.appBladeOpen = false
    }
}
</script>
