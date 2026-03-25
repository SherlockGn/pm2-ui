<template>
    <div class="flex">
        <ProcessSelector v-model="selected" @refresh="refresh" />
        <UFormField :label="$t('metric.enableMonitor')" class="ml-20">
            <USwitch
                :disabled="!selected"
                @change="updateSetting"
                v-model="settingStore.setting.enableMonitor"></USwitch>
        </UFormField>
    </div>
    <div class="flex">
        <UFormField :label="$t('metric.startTime')">
            <DateTime v-model="start" />
        </UFormField>
        <UFormField :label="$t('metric.endTime')" class="ml-5">
            <DateTime v-model="end" />
        </UFormField>
        <UFormField label="&nbsp;" class="ml-5">
            <UDropdownMenu :items="quickActions">
                <UButton color="primary" variant="outline">
                    {{ $t('metric.quickSelect') }}
                </UButton>
            </UDropdownMenu>
        </UFormField>
        <UFormField class="ml-5">
            <template #label>
                <span>{{ $t('metric.sampleDuration') }}</span>
                <span v-if="sampleCount > 500" class="inline-block ml-2">
                    <UBadge variant="subtle" color="warning">
                        {{
                            $t('metric.resultsGenerated', {
                                count: sampleCount
                            })
                        }}
                    </UBadge>
                </span>
            </template>
            <DateTimePeriod v-model="sample" />
        </UFormField>
    </div>
    <div class="flex">
        <UFormField :label="$t('metric.selectMetric')">
            <USelectMenu class="w-60" v-model="metricName" :items="metrics" />
        </UFormField>
        <UFormField :label="$t('metric.aggregation')" class="ml-20">
            <USelectMenu
                class="w-40"
                v-model="aggreation"
                value-key="id"
                :items="aggregations" />
        </UFormField>
    </div>
    <UFormField>
        <UButton
            color="primary"
            icon="i-lucide-refresh-ccw"
            variant="outline"
            :label="$t('metric.syncMetric')"
            :disabled="!selected"
            @click="getMetrics" />
    </UFormField>
    <UCard
        v-if="selected"
        ref="cardRef"
        :ui="{ root: 'overflow-visible', body: '!px-0 !pt-0 !pb-3' }">
        <template #header>
            <div>
                <p class="text-xs text-muted uppercase mb-1.5">
                    {{ $t('metric.metricLabel') }}
                </p>
                <p class="text-3xl text-highlighted font-semibold">
                    {{
                        `${targetMetric?.name} ${targetMetric?.unit ? `(${targetMetric?.unit})` : ''}`
                    }}
                </p>
            </div>
        </template>

        <VisXYContainer
            v-if="data.length"
            :data="data"
            :padding="{ top: 40 }"
            class="h-[calc(100vh-550px)]">
            <VisLine :x="d => d.x" :y="d => d.y" color="var(--ui-primary)" />
            <VisArea
                :x="d => d.x"
                :y="d => d.y"
                color="var(--ui-primary)"
                :opacity="0.1" />

            <VisAxis
                type="x"
                :x="d => d.x"
                :tick-format="x => new Date(x).toDateString()" />

            <VisCrosshair
                color="var(--ui-primary)"
                :template="templateFormat" />

            <VisTooltip />
        </VisXYContainer>
    </UCard>
</template>

<script setup>
import { ref, onMounted, watchEffect, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettingStore } from '../stores/setting.js'
import { useMetricStore } from '../stores/metric.js'
import { addSuccessfulToast, toFriendlyMemory } from '../utils.js'

const { t } = useI18n()
import DateTime from '../components/DateTime.vue'

import {
    VisXYContainer,
    VisLine,
    VisAxis,
    VisArea,
    VisCrosshair,
    VisTooltip
} from '@unovis/vue'
import DateTimePeriod from '../components/DateTimePeriod.vue'
import ProcessSelector from '../components/ProcessSelector.vue'

onMounted(async () => {
    await settingStore.refresh(selected.value?.id)

    if (!metricName.value && metrics.value.length > 0) {
        metricName.value = metrics.value[0]
    }
})

const refresh = async () => {
    if (!metricName.value && metrics.value.length > 0) {
        metricName.value = metrics.value[0]
    }
}

const settingStore = useSettingStore()
const metricStore = useMetricStore()
const selected = ref(null)
const start = ref(new Date(Date.now() - 60 * 60 * 1000))
const end = ref(new Date())
const sample = ref(5 * 60 * 1000)

const metricName = ref(null)
const aggreation = ref('avg')

const metrics = computed(() => {
    return selected.value?.metrics?.map(i => i.name) ?? []
})

const aggregations = ref([
    {
        id: 'avg',
        label: t('metric.aggregations.average')
    },
    {
        id: 'min',
        label: t('metric.aggregations.minimum')
    },
    {
        id: 'max',
        label: t('metric.aggregations.maximum')
    },
    {
        id: 'sum',
        label: t('metric.aggregations.sum')
    },
    {
        id: 'count',
        label: t('metric.aggregations.count')
    }
])

const setQuickTime = last => {
    end.value = new Date()
    start.value = new Date(end.value.getTime() - last)
}

const quickActions = ref([
    [
        {
            label: t('metric.quickTimes.last5Minutes'),
            onSelect() {
                setQuickTime(5 * 60 * 1000)
            }
        },
        {
            label: t('metric.quickTimes.last15Minutes'),
            onSelect() {
                setQuickTime(15 * 60 * 1000)
            }
        },
        {
            label: t('metric.quickTimes.last30Minutes'),
            onSelect() {
                setQuickTime(30 * 60 * 1000)
            }
        },
        {
            label: t('metric.quickTimes.last1Hour'),
            onSelect() {
                setQuickTime(60 * 60 * 1000)
            }
        },
        {
            label: t('metric.quickTimes.last3Hours'),
            onSelect() {
                setQuickTime(3 * 60 * 60 * 1000)
            }
        },
        {
            label: t('metric.quickTimes.last6Hours'),
            onSelect() {
                setQuickTime(6 * 60 * 60 * 1000)
            }
        },
        {
            label: t('metric.quickTimes.last12Hours'),
            onSelect() {
                setQuickTime(12 * 60 * 60 * 1000)
            }
        },
        {
            label: t('metric.quickTimes.last1Day'),
            onSelect() {
                setQuickTime(24 * 60 * 60 * 1000)
            }
        },
        {
            label: t('metric.quickTimes.last2Days'),
            onSelect() {
                setQuickTime(2 * 24 * 60 * 60 * 1000)
            }
        },
        {
            label: t('metric.quickTimes.last3Days'),
            onSelect() {
                setQuickTime(3 * 24 * 60 * 60 * 1000)
            }
        },
        {
            label: t('metric.quickTimes.last7Days'),
            onSelect() {
                setQuickTime(7 * 24 * 60 * 60 * 1000)
            }
        }
    ]
])

watchEffect(async () => {
    await settingStore.refresh(selected.value?.pmId)
})

watchEffect(() => {
    if (!metrics.value.includes(metricName.value) && metrics.value.length > 0) {
        metricName.value = metrics.value[0]
    }
})

const updateSetting = async () => {
    if (await settingStore.update(selected.value?.pmId)) {
        addSuccessfulToast(t('toast.updatedSuccessfully'))
    }
}

const getMetrics = async () => {
    data.value = await metricStore.getMetric(
        selected.value?.pmId,
        metricName.value,
        start.value.getTime(),
        end.value.getTime(),
        aggreation.value,
        sample.value
    )
}

const calculateCleanGap = (startTs, endTs, targetCount = 500) => {
    const duration = endTs - startTs
    if (duration === 0) {
        return 1
    }
    const minGap = duration / targetCount
    const units = [1000, 60000, 3600000, 86400000] // Sec, Min, Hour, Day
    let bestUnit = units[0]
    for (const unit of units) {
        if (minGap >= unit) bestUnit = unit
    }
    return Math.ceil(minGap / bestUnit) * bestUnit
}

watchEffect(() => {
    sample.value = calculateCleanGap(start.value.getTime(), end.value.getTime())
})

const targetMetric = computed(() => {
    return selected.value?.metrics?.find(i => i.name === metricName.value)
})

const sampleCount = computed(() => {
    return Math.ceil(
        (end.value.getTime() - start.value.getTime()) / sample.value
    )
})

const templateFormat = item => {
    const time = new Date(item.x).toLocaleString()
    let value, unit
    if (
        targetMetric.value?.name === 'Memory' &&
        targetMetric.value?.unit === 'B'
    ) {
        const friendlyFormat = toFriendlyMemory(item.y)
        ;[value, unit] = friendlyFormat.split(' ')
    } else {
        value = item.y.toFixed(2)
        unit = targetMetric.value?.unit
    }

    value = value.replace(/\.00$/, '')
    if (value.includes('.')) {
        value = value.replace(/0$/, '')
    }

    const v = `${value} ${unit ? `(${unit})` : ''}`
    return `${time}: ${v}`
}

const data = ref([])
</script>
