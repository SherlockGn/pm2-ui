<template>
    <div class="flex flex-col">
        <div class="bg-white border-x border-slate-200 h-1.5 relative">
            <div
                v-if="isAuto"
                class="h-full bg-primary-500 transition-all duration-100 ease-linear"
                :style="{ width: progress + '%' }"></div>
            <div v-else class="h-full bg-slate-100 w-full opacity-50"></div>
        </div>

        <div
            class="bg-white p-6 border-x border-b border-slate-200 rounded-b-2xl">
            <div
                :class="[
                    'grid gap-6 transition-all duration-500',
                    configs.length === 1
                        ? 'grid-cols-1'
                        : configs.length === 2
                          ? 'grid-cols-1 md:grid-cols-2'
                          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                ]">
                <transition-group name="viewer">
                    <LogViewer
                        v-for="conf in props.configs"
                        :key="conf.key"
                        v-bind="conf"
                        :stream-key="conf.key"
                        :lines="log[conf.key]"
                        :refresh-counter="internalRefreshCounter"></LogViewer>
                </transition-group>
            </div>
            <div
                v-if="configs.length === 0"
                class="py-20 text-center border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 italic text-sm">
                {{ $t('logMonitor.noActiveStreams') }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import LogViewer from './LogViewer.vue'
import { useProcessStore } from '../stores/process.js'

const processStore = useProcessStore()

const props = defineProps({
    configs: Array,
    isAuto: Boolean,
    manualSignal: Number,
    processId: Number,
    lineCount: Number
})

const emit = defineEmits(['refreshed'])

const progress = ref(100)
const internalRefreshCounter = ref(0)
let timer = null
let elapsed = 0
const INTERVAL = 10000
const TICK = 100

const log = ref({
    output: [],
    error: [],
    combined: []
})

const refreshAll = async () => {
    internalRefreshCounter.value++
    elapsed = 0
    progress.value = 100
    emit('refreshed')

    const { output, error, combined } = await processStore.readLogs(
        props.processId,
        props.lineCount
    )
    log.value.output = output ?? []
    log.value.error = error ?? []
    log.value.combined = combined ?? []
}

const startTimer = () => {
    clearInterval(timer)
    timer = setInterval(() => {
        if (!props.isAuto) return
        elapsed += TICK
        progress.value = 100 - (elapsed / INTERVAL) * 100
        if (elapsed >= INTERVAL) refreshAll()
    }, TICK)
}

// Watch for manual signal from parent to reset timer and refresh
watch(
    () => props.manualSignal,
    () => refreshAll()
)

watch(
    () => props.isAuto,
    val => {
        if (val) startTimer()
        else clearInterval(timer)
    }
)

onMounted(startTimer)
onUnmounted(() => clearInterval(timer))
</script>
