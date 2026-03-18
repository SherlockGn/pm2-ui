<template>
    <UTabs :items="tabs" variant="link" class="w-full">
        <template #cleanup>
            <UButton
                class="mt-5 ml-5"
                color="primary"
                icon="i-lucide-refresh-ccw"
                variant="outline"
                label="Refresh"
                @click="refresh" />

            <UFormField label="Expiration Info" class="mt-5 ml-5">
                <p>Admin logs: {{ cleanupStore.info.adminLogs }} item(s).</p>
                <p>Process settings: {{ cleanupStore.info.settings }} item(s).</p>
                <p>Communication logs: {{ cleanupStore.info.communications }} item(s).</p>
                <p>Process metrics: {{ cleanupStore.info.metrics }} item(s).</p>
            </UFormField>

            <UFormField label="Set Expiration Time" class="mt-5 ml-5">
                <DateTimePeriod
                    v-model="
                        kvStore.settings.dbCleanUpEarlierThan
                    "></DateTimePeriod>
                <div></div>
                <UButton
                    @click="updateDbCleanUpEarlierThan"
                    class="mt-3"
                    color="primary"
                    variant="outline"
                    icon="i-lucide-save"></UButton>
            </UFormField>
            <UFormField label="Clean Up Database" class="mt-5 ml-5">
                <UButton
                    @click="cleanup"
                    class="mt-3"
                    color="primary"
                    variant="outline"
                    icon="i-lucide-brush-cleaning">
                    Clean Up
                </UButton>
            </UFormField>
        </template>
        <template #automatic-cleanup>
            <UButton
                class="mt-5 ml-5"
                color="primary"
                icon="i-lucide-refresh-ccw"
                variant="outline"
                label="Refresh"
                @click="refresh" />
            <UFormField
                label="Enable automatic database clean-up"
                description="Automatic database clean-up runs daily at 1:00 AM"
                class="mt-5 ml-5">
                <USwitch
                    @change="updateEnableAutoDbCleanup"
                    v-model="kvStore.settings.enableAutoDbCleanup"></USwitch>
            </UFormField>
        </template>
    </UTabs>
</template>

<script setup>
import { onMounted, ref } from 'vue'

import { useKvStore } from '../stores/kv.js'
import { useCleanupStore } from '../stores/cleanup.js'
import { addSuccessfulToast } from '../utils.js'

import DateTimePeriod from '../components/DateTimePeriod.vue'

const kvStore = useKvStore()
const cleanupStore = useCleanupStore()

onMounted(async () => {
    await kvStore.refresh()
    await cleanupStore.refresh()
})

const refresh = async () => {
    if ((await kvStore.refresh()) && (await cleanupStore.refresh())) {
        addSuccessfulToast('Refreshed successfully!')
    }
}

const tabs = ref([
    {
        label: 'Cleanup',
        icon: 'i-lucide-brush-cleaning',
        slot: 'cleanup'
    },
    {
        label: 'Automatic Cleanup',
        icon: 'i-lucide-bot',
        slot: 'automatic-cleanup'
    }
])

const updateEnableAutoDbCleanup = async value => {
    if (
        await kvStore.updateEnableAutoDbCleanup(
            kvStore.settings.enableAutoDbCleanup
        )
    ) {
        addSuccessfulToast('Updated successfully!')
    }
}

const updateDbCleanUpEarlierThan = async () => {
    if (
        (await kvStore.updateDbCleanUpEarlierThan(
            kvStore.settings.dbCleanUpEarlierThan
        )) &&
        (await cleanupStore.refresh())
    ) {
        addSuccessfulToast('Updated successfully!')
    }
}

const cleanup = async () => {
    if ((await cleanupStore.cleanup()) && (await cleanupStore.refresh())) {
        addSuccessfulToast('Cleaned up successfully!')
    }
}
</script>
