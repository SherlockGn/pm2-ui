<template>
    <div class="flex">
        <ProcessSelector v-model="selected"></ProcessSelector>
        <UFormField label="Line count" class="ml-20">
            <UInputNumber :min="1" v-model="count"></UInputNumber>
        </UFormField>
        <UFormField label="Auto refresh" class="ml-20">
            <USwitch v-model="autoRefresh"></USwitch>
        </UFormField>
    </div>
    <UFormField>
        <UButton
            color="primary"
            icon="i-lucide-refresh-ccw"
            variant="outline"
            label="Refresh log"
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

import LogMonitor from '../components/LogMonitor.vue'
import ProcessSelector from '../components/ProcessSelector.vue'

const manualSignal = ref(0)
const selected = ref(null)

const count = ref(10)
const autoRefresh = ref(false)

const isRefreshing = ref(false)

const logPathValid = path => path && path !== 'NULL' && path !== '/dev/null'
const allConfigs = computed(() => {
    return [
        {
            title: 'StdOut',
            path: selected.value?.attrs?.find(i => i.key === 'pm_out_log_path')
                ?.value,
            key: 'output'
        },
        {
            title: 'StdErr',
            path: selected.value?.attrs?.find(i => i.key === 'pm_err_log_path')
                ?.value,
            key: 'error'
        },
        {
            title: 'Combined',
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
