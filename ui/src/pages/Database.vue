<template>
    <UTabs :items="tabs" variant="link" class="w-full">
        <template #cleanup>
            <UButton
                class="mt-5 ml-5"
                color="primary"
                icon="i-lucide-refresh-ccw"
                variant="outline"
                :label="$t('common.refresh')"
                @click="refresh" />

            <UFormField
                :label="$t('database.expirationInfo')"
                class="mt-5 ml-5">
                <p>
                    {{
                        $t('database.adminLogs', {
                            count: cleanupStore.info.adminLogs
                        })
                    }}
                </p>
                <p>
                    {{
                        $t('database.processSettings', {
                            count: cleanupStore.info.settings
                        })
                    }}
                </p>
                <p>
                    {{
                        $t('database.communicationLogs', {
                            count: cleanupStore.info.communications
                        })
                    }}
                </p>
                <p>
                    {{
                        $t('database.processMetrics', {
                            count: cleanupStore.info.metrics
                        })
                    }}
                </p>
            </UFormField>

            <UFormField
                :label="$t('database.setExpirationTime')"
                class="mt-5 ml-5">
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
            <UFormField
                :label="$t('database.cleanUpDatabase')"
                class="mt-5 ml-5">
                <UButton
                    @click="cleanup"
                    class="mt-3"
                    color="primary"
                    variant="outline"
                    icon="i-lucide-brush-cleaning">
                    {{ $t('database.cleanUp') }}
                </UButton>
            </UFormField>
            <UFormField
                :label="$t('database.vacuumDatabase')"
                :description="$t('database.vacuumDescription')"
                class="mt-5 ml-5">
                <UButton
                    @click="vacuumDb"
                    class="mt-3"
                    color="primary"
                    variant="outline"
                    icon="i-lucide-hard-drive">
                    {{ $t('database.vacuum') }}
                </UButton>
            </UFormField>
        </template>
        <template #automatic-cleanup>
            <UButton
                class="mt-5 ml-5"
                color="primary"
                icon="i-lucide-refresh-ccw"
                variant="outline"
                :label="$t('common.refresh')"
                @click="refresh" />
            <UFormField
                :label="$t('database.enableAutomaticDatabaseCleanUp')"
                :description="$t('database.automaticCleanupDescription')"
                class="mt-5 ml-5">
                <USwitch
                    @change="updateEnableAutoDbCleanup"
                    v-model="kvStore.settings.enableAutoDbCleanup"></USwitch>
            </UFormField>
            <UFormField
                :label="$t('database.enableAutomaticVacuum')"
                :description="$t('database.automaticVacuumDescription')"
                class="mt-5 ml-5">
                <USwitch
                    @change="updateEnableAutoVacuum"
                    v-model="kvStore.settings.enableAutoVacuum"></USwitch>
            </UFormField>
        </template>
    </UTabs>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useKvStore } from '../stores/kv.js'
import { useCleanupStore } from '../stores/cleanup.js'
import { addSuccessfulToast } from '../utils.js'

import DateTimePeriod from '../components/DateTimePeriod.vue'

const { t } = useI18n()
const kvStore = useKvStore()
const cleanupStore = useCleanupStore()

onMounted(async () => {
    await kvStore.refresh()
    await cleanupStore.refresh()
})

const refresh = async () => {
    if ((await kvStore.refresh()) && (await cleanupStore.refresh())) {
        addSuccessfulToast(t('toast.refreshedSuccessfully'))
    }
}

const tabs = ref([
    {
        label: t('database.tabs.cleanup'),
        icon: 'i-lucide-brush-cleaning',
        slot: 'cleanup'
    },
    {
        label: t('database.tabs.automaticCleanup'),
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
        addSuccessfulToast(t('toast.updatedSuccessfully'))
    }
}

const updateEnableAutoVacuum = async value => {
    if (
        await kvStore.updateEnableAutoVacuum(kvStore.settings.enableAutoVacuum)
    ) {
        addSuccessfulToast(t('toast.updatedSuccessfully'))
    }
}

const updateDbCleanUpEarlierThan = async () => {
    if (
        (await kvStore.updateDbCleanUpEarlierThan(
            kvStore.settings.dbCleanUpEarlierThan
        )) &&
        (await cleanupStore.refresh())
    ) {
        addSuccessfulToast(t('toast.updatedSuccessfully'))
    }
}

const cleanup = async () => {
    if ((await cleanupStore.cleanup()) && (await cleanupStore.refresh())) {
        addSuccessfulToast(t('toast.cleanedUpSuccessfully'))
    }
}

const vacuumDb = async () => {
    if (await cleanupStore.vacuum()) {
        addSuccessfulToast(t('toast.vacuumedSuccessfully'))
    }
}
</script>
