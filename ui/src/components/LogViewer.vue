<template>
    <div
        ref="container"
        class="bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
        <div
            class="px-4 py-3 bg-slate-50/50 border-b border-slate-100 flex flex-col">
            <span class="text-3 font-bold font-mono uppercase">
                {{ title }}
            </span>
            <span class="text-3 text-slate-400 font-mono truncate">
                {{ path }}
            </span>
        </div>
        <div
            ref="scrollBox"
            class="h-full overflow-y-auto p-0 font-mono text-[15px] leading-relaxed custom-scrollbar bg-white">
            <div
                v-for="(line, i) in lines"
                :key="i"
                :class="[
                    'px-4 py-1 flex gap-3 border-b border-slate-50 last:border-0',
                    streamKey === 'error'
                        ? 'err-line'
                        : 'hover:bg-slate-50 transition-colors'
                ]">
                <span
                    class="text-slate-300 shrink-0 w-6 text-right select-none">
                    {{ i + 1 }}
                </span>
                <span
                    class="text-slate-600 break-all"
                    v-html="highlight(line)"></span>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, watch, onMounted, nextTick, useTemplateRef } from 'vue'
import { useProcessStore } from '../stores/process.js'

const props = defineProps({
    title: String,
    path: String,
    streamKey: String,
    refreshCounter: Number,
    lines: Array
})

const scrollBox = ref(null)
const tsRegex =
    /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*?Z|\w{3} \w{3} \d{2} \d{4} \d{2}:\d{2}:\d{2}.*?|\d{1,2}:\d{2}:\d{2} [AP]M)/g

const highlight = text => {
    if (!text) return ''
    const safe = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    return safe.replace(
        tsRegex,
        match => `<span class="ts-highlight">${match}</span>`
    )
}

const fetchLogs = async () => {
    await nextTick()
    if (scrollBox.value) {
        scrollBox.value.scrollTop = scrollBox.value.scrollHeight
    }
}

const container = useTemplateRef('container')

watch(() => props.refreshCounter, fetchLogs)
onMounted(async () => {
    fetchLogs()
    await new Promise(resolve => setTimeout(resolve, 100))
    container.value.style.height = `${window.innerHeight - 350}px`
})
</script>
<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: #f8fafc;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
}
.ts-highlight {
    color: #059669;
    font-weight: 600;
}
.err-line {
    background-color: #fff1f2;
    color: #be123c;
}
.viewer-enter-active,
.viewer-leave-active {
    transition: all 0.3s ease;
}
.viewer-enter-from,
.viewer-leave-to {
    opacity: 0;
    transform: translateY(10px);
}
</style>
