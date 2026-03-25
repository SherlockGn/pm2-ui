<template>
    <div
        class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col font-sans">
        <div
            class="px-4 py-2 bg-slate-50/50 border-b border-slate-200 flex items-center justify-between">
            <div class="flex gap-1.5">
                <div class="w-2 h-2 rounded-full bg-slate-200"></div>
                <div class="w-2 h-2 rounded-full bg-slate-200"></div>
            </div>
            <span class="text-[9px] font-bold">
                {{ $t('terminal.processInspector') }}
            </span>
        </div>

        <div
            ref="scrollBox"
            class="h-[200px] overflow-y-auto p-5 terminal-scrollbar bg-white">
            <pre
                class="terminal-pre font-mono-terminal text-[13px] leading-relaxed text-slate-600"><template v-for="(chunk, index) in modelValue.ret" :key="index"><span :class="chunk.type === 'error' ? 'text-rose-500' : ''">{{ chunk.data }}</span></template></pre>
        </div>

        <div
            class="px-3 py-2 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="flex items-center gap-2">
                    <span
                        v-if="modelValue.code === 0 && !modelValue.timeout"
                        class="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-100 text-emerald-700 uppercase">
                        {{ $t('terminal.success') }}
                    </span>

                    <span
                        v-else-if="modelValue.timeout"
                        class="px-2 py-0.5 rounded text-[9px] font-black bg-amber-100 text-amber-700 uppercase">
                        {{ $t('terminal.timeout') }}
                    </span>

                    <span
                        v-else
                        class="px-2 py-0.5 rounded text-[9px] font-black bg-rose-100 text-rose-700 uppercase">
                        {{ $t('terminal.exitCode') }} {{ modelValue.code }}
                    </span>
                </div>
            </div>

            <span
                class="text-[9px] font-bold text-slate-300 uppercase tracking-widest font-mono">
                {{ modelValue.ret.length }} {{ $t('terminal.chunks') }}
            </span>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: Object
})
const emit = defineEmits(['update:modelValue'])
</script>
<style scoped>
[v-cloak] {
    display: none;
}
.terminal-scrollbar::-webkit-scrollbar {
    width: 4px;
    height: 8px;
}
.terminal-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
}

.font-mono-terminal {
    font-family:
        ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
</style>
