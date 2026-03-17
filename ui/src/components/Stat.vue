<template>
    <UPageGrid class="lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px">
        <UPageCard
            v-for="(stat, index) in stats"
            :key="index"
            :icon="stat.icon"
            :title="stat.title"
            variant="subtle"
            :ui="{
                container: 'gap-y-1.5',
                wrapper: 'items-start',
                leading:
                    'p-2.5 rounded-full bg-primary/10 ring ring-inset ring-primary/25',
                title: 'font-normal text-muted text-xs uppercase'
            }"
            class="lg:rounded-none first:rounded-l-lg last:rounded-r-lg hover:z-1">
            <div class="flex items-center gap-2">
                <span class="text-2xl font-semibold text-highlighted">
                    {{ stat.value }}
                </span>
                <UBadge
                    v-if="stat.extra"
                    :color="stat.extraColor ?? 'success'"
                    variant="subtle"
                    class="text-xs">
                    {{ stat.extra }}
                </UBadge>
            </div>
        </UPageCard>
    </UPageGrid>
</template>

<script setup>
import { computed } from 'vue'
import { useProcessStore } from '../stores/process.js'

const processStore = useProcessStore()

const total = computed(() => processStore.processes.length)
const runningCount = computed(() => processStore.processes.filter((p) => p.status?.toLowerCase() ==='online').length)
const stoppedCount = computed(() => total.value - runningCount.value)
const restartCount = computed(() => processStore.processes.map(i => i.restartCount).reduce((a, b) => a + b, 0))

const stats = computed(() => {
    const runningPercent =
        runningCount.value >= total.value
            ? 100
            : Math.round((runningCount.value / total.value) * 100)
    const stoppedPercent = 100 - runningPercent
    return [
        {
            title: 'Total Count',
            icon: 'lucide:app-window',
            value: total.value
        },
        {
            title: 'Running Count',
            icon: 'lucide:monitor-check',
            value: runningCount.value,
            extra: `${runningPercent}%`
        },
        {
            title: 'Stopped Count',
            icon: 'lucide:monitor-x',
            value: stoppedCount.value,
            extra: `${stoppedPercent}%`,
            extraColor: 'error'
        },
        {
            title: 'Total Restart Count',
            icon: 'lucide:monitor-play',
            value: restartCount.value
        }
    ]
})
</script>
