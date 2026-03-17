<template>
    <div>
        <UTabs variant="link" :items="tabs" class="w-full">
            <template #process>
                <UFormField label="Reset process restart counter" class="mt-8">
                    <UButton icon="i-lucide-timer-reset" @click="resetCounter">
                        Reset
                    </UButton>
                </UFormField>
                <UFormField label="Clear log file" class="mt-8">
                    <UButton icon="i-lucide-brush-cleaning" @click="flushLog">
                        Clear
                    </UButton>
                </UFormField>
            </template>
            <template #startup>
                <UFormField label="Generate startup script" class="mt-8">
                    <UButton icon="i-lucide-arrow-big-up-dash" @click="startup">
                        Startup
                    </UButton>
                </UFormField>
                <UFormField label="Generate unstartup script" class="mt-8">
                    <UButton
                        icon="i-lucide-arrow-big-down-dash"
                        @click="unstartup">
                        Unstartup
                    </UButton>
                </UFormField>
            </template>
            <template #persist>
                <UFormField label="Save processes" class="mt-8">
                    <UButton icon="i-lucide-archive" @click="save">
                        Save
                    </UButton>
                </UFormField>
                <UFormField label="Resurrect processes" class="mt-8">
                    <UButton icon="i-lucide-archive-restore" @click="resurrect">
                        Resurrect
                    </UButton>
                    <UBadge variant="subtle" color="warning" class="ml-3">
                        Processes resurrected will be unmanaged
                    </UBadge>
                </UFormField>
            </template>
            <template #global>
                <UFormField
                    label="Update the in-memory PM2 daemon"
                    class="mt-8">
                    <UButton icon="i-lucide-folder-sync" @click="update">
                        Update
                    </UButton>
                </UFormField>
                <UFormField label="Kill the PM2 daemon" class="mt-8">
                    <UButton icon="i-lucide-eraser" @click="kill">Kill</UButton>
                    <UBadge variant="subtle" color="warning" class="ml-3">
                        All functionalities will not work and all PM2 processes will be deleted after this action
                    </UBadge>
                </UFormField>
                <UFormField label="Ping or daemonized PM2" class="mt-8">
                    <UButton icon="i-lucide-link" @click="ping">Ping</UButton>
                </UFormField>
            </template>
        </UTabs>
    </div>
</template>

<script setup>
import { ref } from 'vue'

import { useActionStore } from '../stores/action.js'
import { createTerminalResultBlade } from '../utils.js'

const actionStore = useActionStore()

const tabs = ref([
    {
        slot: 'process',
        label: 'Process',
        icon: 'i-lucide-app-window-mac'
    },
    {
        slot: 'startup',
        label: 'Startup',
        icon: 'i-lucide-arrow-big-up-dash'
    },
    {
        slot: 'persist',
        label: 'Persist',
        icon: 'i-lucide-folder-archive'
    },
    {
        slot: 'global',
        label: 'Global',
        icon: 'i-lucide-globe'
    }
])

const resetCounter = async () => {
    createTerminalResultBlade({
        title: 'Reset process restart counter',
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
        title: 'Clear log file',
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
        title: 'Generate startup script',
        autoRun: true,
        exec: async () => {
            return await actionStore.startup()
        }
    })
}

const unstartup = async () => {
    createTerminalResultBlade({
        title: 'Generate unstartup script',
        autoRun: true,
        exec: async () => {
            return await actionStore.unstartup()
        }
    })
}

const save = async () => {
    createTerminalResultBlade({
        title: 'Save processes',
        autoRun: true,
        exec: async () => {
            return await actionStore.save()
        }
    })
}

const resurrect = async () => {
    createTerminalResultBlade({
        title: 'Resurrect processes',
        autoRun: true,
        exec: async () => {
            return await actionStore.resurrect()
        }
    })
}

const kill = async () => {
    createTerminalResultBlade({
        title: 'Kill the daemon',
        autoRun: true,
        exec: async () => {
            return await actionStore.kill()
        }
    })
}

const ping = async () => {
    createTerminalResultBlade({
        title: 'Ping or daemonized PM2',
        autoRun: true,
        exec: async () => {
            return await actionStore.ping()
        }
    })
}

const update = async () => {
    createTerminalResultBlade({
        title: 'Update the in-memory PM2 daemon',
        autoRun: true,
        exec: async () => {
            return await actionStore.update()
        }
    })
}
</script>
