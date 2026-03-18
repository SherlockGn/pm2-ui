<template>
    <UTabs :items="tabs" variant="link" class="w-full">
        <template #subscription>
            <UButton
                class="mt-5 ml-5"
                color="primary"
                icon="i-lucide-refresh-ccw"
                variant="outline"
                label="Refresh"
                @click="refreshSettings" />
            <UFormField label="Message subscriptions" class="mt-5 ml-5">
                <StringList
                    v-model="kvStore.settings.subscribedMsgNames"></StringList>
                <UButton
                    @click="updateSubscribedMsgNames"
                    class="mt-5"
                    color="primary"
                    variant="outline"
                    icon="i-lucide-save"></UButton>
            </UFormField>
        </template>
        <template #monitor>
            <UButton
                class="mt-5 ml-5"
                color="primary"
                icon="i-lucide-refresh-ccw"
                variant="outline"
                label="Refresh"
                @click="refreshSettings" />
            <UBadge variant="subtle" color="warning" class="ml-5">
                Watch out the performance
            </UBadge>
            <UFormField
                label="Monitor interval of data collection"
                class="mt-5 ml-5">
                <div class="mt-3">
                    <DateTimePeriod
                        v-model="
                            kvStore.settings.monitorCollectDelay
                        "></DateTimePeriod>
                </div>
                <UButton
                    @click="updateMonitorCollectDelay"
                    class="mt-3"
                    color="primary"
                    variant="outline"
                    icon="i-lucide-save"></UButton>
            </UFormField>
            <UFormField
                label="Max size of buffered monitor data"
                class="mt-5 ml-5">
                <UInputNumber
                    v-model="
                        kvStore.settings.monitorBufferMaxSize
                    "></UInputNumber>
                <div></div>
                <UButton
                    @click="updateMonitorBufferMaxSize"
                    class="mt-3"
                    color="primary"
                    variant="outline"
                    icon="i-lucide-save"></UButton>
            </UFormField>
            <UFormField
                label="Max age of buffered monitor data"
                class="mt-5 ml-5">
                <DateTimePeriod
                    v-model="
                        kvStore.settings.monitorBufferMaxAge
                    "></DateTimePeriod>
                <div></div>
                <UButton
                    @click="updateMonitorBufferMaxAge"
                    class="mt-3"
                    color="primary"
                    variant="outline"
                    icon="i-lucide-save"></UButton>
            </UFormField>
        </template>
    </UTabs>
</template>

<script setup>
import { ref } from 'vue'
import { useKvStore } from '../stores/kv.js'
import { addSuccessfulToast } from '../utils.js'

import StringList from '../components/StringList.vue'
import DateTime from '../components/DateTime.vue'
import DateTimePeriod from '../components/DateTimePeriod.vue'

const kvStore = useKvStore()

const tabs = ref([
    {
        label: 'Subscription',
        icon: 'i-lucide-book',
        slot: 'subscription'
    },
    {
        label: 'Monitor',
        icon: 'i-lucide-monitor-cog',
        slot: 'monitor'
    }
])

const updateSubscribedMsgNames = async () => {
    if (
        await kvStore.updateSubscribedMsgNames(
            kvStore.settings.subscribedMsgNames
        )
    ) {
        addSuccessfulToast('Updated successfully!')
    }
}

const updateMonitorCollectDelay = async () => {
    if (
        await kvStore.updateMonitorCollectDelay(
            kvStore.settings.monitorCollectDelay
        )
    ) {
        addSuccessfulToast('Updated successfully!')
    }
}

const updateMonitorBufferMaxSize = async () => {
    if (
        await kvStore.updateMonitorBufferMaxSize(
            kvStore.settings.monitorBufferMaxSize
        )
    ) {
        addSuccessfulToast('Updated successfully!')
    }
}

const updateMonitorBufferMaxAge = async () => {
    if (
        await kvStore.updateMonitorBufferMaxAge(
            kvStore.settings.monitorBufferMaxAge
        )
    ) {
        addSuccessfulToast('Updated successfully!')
    }
}

const refreshSettings = async () => {
    if (await kvStore.refresh()) {
        addSuccessfulToast('Refreshed successfully!')
    }
}
</script>
