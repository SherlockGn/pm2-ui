<template>
    <div class="flex">
        <ProcessSelector v-model="selected"></ProcessSelector>
        <UFormField :label="$t('log.lineCount')" class="ml-20">
            <UInputNumber :min="1" v-model="count"></UInputNumber>
        </UFormField>
        <UFormField :label="$t('log.autoRefresh')" class="ml-20">
            <USwitch v-model="autoRefresh"></USwitch>
        </UFormField>
    </div>
    <UFormField>
        <UButton
            color="primary"
            icon="i-lucide-refresh-ccw"
            variant="outline"
            :label="$t('log.refreshLog')"
            @click="triggerManualSync" />
    </UFormField>
    <div class="h-full overflow-y-auto">
        <LogMonitor
            :configs="filteredViewers"
            :is-auto="autoRefresh"
            :manual-signal="manualSignal"
            :process-id="selected?.pmId ?? -1"
            :line-count="count"
            @refreshed="onRefreshComplete"></LogMonitor>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

import LogMonitor from '../components/LogMonitor.vue'
import ProcessSelector from '../components/ProcessSelector.vue'

const { t } = useI18n()

const manualSignal = ref(0)
const selected = ref(null)

const count = ref(10)
const autoRefresh = ref(false)

const isRefreshing = ref(false)

const logPathValid = path => path && path !== 'NULL' && path !== '/dev/null'
const allConfigs = computed(() => {
    return [
        {
            title: t('log.stdOut'),
            path: selected.value?.attrs?.find(i => i.key === 'pm_out_log_path')
                ?.value,
            key: 'output'
        },
        {
            title: t('log.stdErr'),
            path: selected.value?.attrs?.find(i => i.key === 'pm_err_log_path')
                ?.value,
            key: 'error'
        },
        {
            title: t('log.combined'),
            path: selected.value?.attrs?.find(i => i.key === 'pm_log_path')
                ?.value,
            key: 'combined'
        }
    ]
})
const filteredViewers = computed(() =>
    allConfigs.value.filter(i => logPathValid(i.path))
)

const triggerManualSync = () => {
    isRefreshing.value = true
    manualSignal.value++ // Send signal to LogMonitor
}

const onRefreshComplete = () => {
    setTimeout(() => {
        isRefreshing.value = false
    }, 300)
}
</script>
