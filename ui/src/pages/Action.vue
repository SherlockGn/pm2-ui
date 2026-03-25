<template>
    <div>
        <UTabs variant="link" :items="tabs" class="w-full">
            <template #process>
                <UFormField
                    :label="$t('action.resetProcessRestartCounter')"
                    class="mt-8">
                    <UButton icon="i-lucide-timer-reset" @click="resetCounter">
                        {{ $t('action.reset') }}
                    </UButton>
                </UFormField>
                <UFormField :label="$t('action.clearLogFile')" class="mt-8">
                    <UButton icon="i-lucide-brush-cleaning" @click="flushLog">
                        {{ $t('action.clear') }}
                    </UButton>
                </UFormField>
            </template>
            <template #startup>
                <UFormField
                    :label="$t('action.generateStartupScript')"
                    class="mt-8">
                    <UButton icon="i-lucide-arrow-big-up-dash" @click="startup">
                        {{ $t('action.startup') }}
                    </UButton>
                </UFormField>
                <UFormField
                    :label="$t('action.generateUnstartupScript')"
                    class="mt-8">
                    <UButton
                        icon="i-lucide-arrow-big-down-dash"
                        @click="unstartup">
                        {{ $t('action.unstartup') }}
                    </UButton>
                </UFormField>
            </template>
            <template #persist>
                <UFormField :label="$t('action.saveProcesses')" class="mt-8">
                    <UButton icon="i-lucide-archive" @click="save">
                        {{ $t('action.save') }}
                    </UButton>
                </UFormField>
                <UFormField
                    :label="$t('action.resurrectProcesses')"
                    class="mt-8">
                    <UButton icon="i-lucide-archive-restore" @click="resurrect">
                        {{ $t('action.resurrect') }}
                    </UButton>
                    <UBadge variant="subtle" color="warning" class="ml-3">
                        {{ $t('action.processesResurrectedWillBeUnmanaged') }}
                    </UBadge>
                </UFormField>
            </template>
            <template #global>
                <UFormField
                    :label="$t('action.updateTheInMemoryPm2Daemon')"
                    class="mt-8">
                    <UButton icon="i-lucide-folder-sync" @click="update">
                        {{ $t('common.update') }}
                    </UButton>
                </UFormField>
                <UFormField :label="$t('action.killThePm2Daemon')" class="mt-8">
                    <UButton icon="i-lucide-eraser" @click="kill">
                        {{ $t('action.kill') }}
                    </UButton>
                    <UBadge variant="subtle" color="warning" class="ml-3">
                        {{ $t('action.killWarning') }}
                    </UBadge>
                </UFormField>
                <UFormField
                    :label="$t('action.pingOrDaemonizedPm2')"
                    class="mt-8">
                    <UButton icon="i-lucide-link" @click="ping">
                        {{ $t('action.ping') }}
                    </UButton>
                </UFormField>
            </template>
        </UTabs>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useActionStore } from '../stores/action.js'
import { createTerminalResultBlade } from '../utils.js'

const { t } = useI18n()
const actionStore = useActionStore()

const tabs = ref([
    {
        slot: 'process',
        label: t('action.tabs.process'),
        icon: 'i-lucide-app-window-mac'
    },
    {
        slot: 'startup',
        label: t('action.tabs.startup'),
        icon: 'i-lucide-arrow-big-up-dash'
    },
    {
        slot: 'persist',
        label: t('action.tabs.persist'),
        icon: 'i-lucide-folder-archive'
    },
    {
        slot: 'global',
        label: t('action.tabs.global'),
        icon: 'i-lucide-globe'
    }
])

const resetCounter = async () => {
    createTerminalResultBlade({
        title: t('action.resetProcessRestartCounter'),
        value: {
            type: 'processSelector'
        },
        autoRun: false,
        exec: async process => {
            return await actionStore.resetCounter(process.pmId)
        }
    })
}

const flushLog = async () => {
    createTerminalResultBlade({
        title: t('action.clearLogFile'),
        value: {
            type: 'processSelector'
        },
        autoRun: false,
        exec: async process => {
            return await actionStore.flushLog(process.pmId)
        }
    })
}

const startup = async () => {
    createTerminalResultBlade({
        title: t('action.generateStartupScript'),
        autoRun: true,
        exec: async () => {
            return await actionStore.startup()
        }
    })
}

const unstartup = async () => {
    createTerminalResultBlade({
        title: t('action.generateUnstartupScript'),
        autoRun: true,
        exec: async () => {
            return await actionStore.unstartup()
        }
    })
}

const save = async () => {
    createTerminalResultBlade({
        title: t('action.saveProcesses'),
        autoRun: true,
        exec: async () => {
            return await actionStore.save()
        }
    })
}

const resurrect = async () => {
    createTerminalResultBlade({
        title: t('action.resurrectProcesses'),
        autoRun: true,
        exec: async () => {
            return await actionStore.resurrect()
        }
    })
}

const kill = async () => {
    createTerminalResultBlade({
        title: t('action.killTheDaemon'),
        autoRun: true,
        exec: async () => {
            return await actionStore.kill()
        }
    })
}

const ping = async () => {
    createTerminalResultBlade({
        title: t('action.pingOrStartThePm2Daemon'),
        autoRun: true,
        exec: async () => {
            return await actionStore.ping()
        }
    })
}

const update = async () => {
    createTerminalResultBlade({
        title: t('action.updateTheInMemoryPm2Daemon'),
        autoRun: true,
        exec: async () => {
            return await actionStore.update()
        }
    })
}
</script>
