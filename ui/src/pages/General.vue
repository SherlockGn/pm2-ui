<template>
    <UTabs :items="tabs" variant="link" class="w-full">
        <template #subscription>
            <UButton
                class="mt-5 ml-5"
                color="primary"
                icon="i-lucide-refresh-ccw"
                variant="outline"
                :label="$t('common.refresh')"
                @click="refreshSettings" />
            <UFormField
                :label="$t('general.messageSubscriptions')"
                class="mt-5 ml-5">
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
                :label="$t('common.refresh')"
                @click="refreshSettings" />
            <UBadge variant="subtle" color="warning" class="ml-5">
                {{ $t('general.watchOutThePerformance') }}
            </UBadge>
            <UFormField
                :label="$t('general.monitorIntervalOfDataCollection')"
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
                :label="$t('general.maxSizeOfBufferedMonitorData')"
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
                :label="$t('general.maxAgeOfBufferedMonitorData')"
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
        <template #preferences>
            <UFormField
                :label="$t('general.clearPreferences')"
                :description="$t('general.clearPreferencesDescription')"
                class="mt-5 ml-5">
                <UButton
                    @click="clearPreferences"
                    class="mt-3"
                    color="error"
                    variant="outline"
                    icon="i-lucide-trash-2">
                    {{ $t('general.clearPreferences') }}
                </UButton>
            </UFormField>
        </template>
    </UTabs>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useKvStore } from '../stores/kv.js'
import { addSuccessfulToast } from '../utils.js'

import StringList from '../components/StringList.vue'
import DateTime from '../components/DateTime.vue'
import DateTimePeriod from '../components/DateTimePeriod.vue'

const { t } = useI18n()
const kvStore = useKvStore()

const tabs = ref([
    {
        label: t('general.tabs.subscription'),
        icon: 'i-lucide-book',
        slot: 'subscription'
    },
    {
        label: t('general.tabs.monitor'),
        icon: 'i-lucide-monitor-cog',
        slot: 'monitor'
    },
    {
        label: t('general.tabs.preferences'),
        icon: 'i-lucide-settings',
        slot: 'preferences'
    }
])

const updateSubscribedMsgNames = async () => {
    if (
        await kvStore.updateSubscribedMsgNames(
            kvStore.settings.subscribedMsgNames
        )
    ) {
        addSuccessfulToast(t('toast.updatedSuccessfully'))
    }
}

const updateMonitorCollectDelay = async () => {
    if (
        await kvStore.updateMonitorCollectDelay(
            kvStore.settings.monitorCollectDelay
        )
    ) {
        addSuccessfulToast(t('toast.updatedSuccessfully'))
    }
}

const updateMonitorBufferMaxSize = async () => {
    if (
        await kvStore.updateMonitorBufferMaxSize(
            kvStore.settings.monitorBufferMaxSize
        )
    ) {
        addSuccessfulToast(t('toast.updatedSuccessfully'))
    }
}

const updateMonitorBufferMaxAge = async () => {
    if (
        await kvStore.updateMonitorBufferMaxAge(
            kvStore.settings.monitorBufferMaxAge
        )
    ) {
        addSuccessfulToast(t('toast.updatedSuccessfully'))
    }
}

const clearPreferences = () => {
    const token = localStorage.getItem('token')
    localStorage.clear()
    if (token) {
        localStorage.setItem('token', token)
    }
    location.reload()
}

const refreshSettings = async () => {
    if (await kvStore.refresh()) {
        addSuccessfulToast(t('toast.refreshedSuccessfully'))
    }
}
</script>
