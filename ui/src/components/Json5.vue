<template>
    <div
        class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div class="editor-viewport">
            <template v-if="!readonly">
                <pre
                    class="layer-highlight editor-base language-javascript"
                    ref="preLayer"><code class="language-javascript" ref="codeLayer">{{ modelValue }}</code></pre>
                <textarea
                    class="layer-textarea editor-base custom-scrollbar"
                    :value="modelValue"
                    @input="handleInput"
                    @scroll="syncScroll"
                    spellcheck="false"></textarea>
            </template>

            <div v-else class="readonly-container custom-scrollbar">
                <pre
                    class="editor-base language-javascript"><code ref="readonlyCode" class="language-javascript">{{ modelValue }}</code></pre>
            </div>
        </div>

        <div
            class="px-4 py-2 border-t border-slate-100 bg-white flex justify-between items-center">
            <div class="flex items-center gap-2">
                <div
                    :class="[
                        'w-1.5 h-1.5 rounded-full',
                        isValid ? 'bg-emerald-500' : 'bg-rose-500'
                    ]"></div>
                <span class="text-[10px] font-bold text-slate-400 uppercase">
                    {{
                        isValid ? $t('json5.syntaxOk') : $t('json5.syntaxError')
                    }}
                </span>
            </div>
            <button
                v-if="!readonly"
                @click.prevent="formatSource"
                class="text-[10px] font-bold text-indigo-600 hover:text-indigo-800">
                {{ $t('json5.prettify') }}
            </button>
        </div>
    </div>
</template>
<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import Prism from 'prismjs'
import JSON5 from 'json5'

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    readonly: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue'])

const codeLayer = ref(null)
const preLayer = ref(null)
const readonlyCode = ref(null)
const isValid = ref(true)

const runPrism = el => {
    Prism.highlightElement(el)
}

const handleInput = e => {
    emit('update:modelValue', e.target.value)
    validate(e.target.value)
    nextTick(() => runPrism(codeLayer.value))
}

const validate = val => {
    if (val === '') {
        isValid.value = true
        return
    }
    try {
        JSON5.parse(val)
        isValid.value = true
    } catch (e) {
        isValid.value = false
    }
}

const syncScroll = e => {
    if (preLayer.value) {
        preLayer.value.scrollTop = e.target.scrollTop
        preLayer.value.scrollLeft = e.target.scrollLeft
    }
}

const formatSource = () => {
    try {
        const obj = JSON5.parse(props.modelValue)
        emit('update:modelValue', JSON.stringify(obj, null, 4))
        nextTick(() => runPrism(codeLayer.value))
    } catch (e) {}
}

watch(
    () => props.readonly,
    async val => {
        await nextTick()
        runPrism(val ? readonlyCode.value : codeLayer.value)
    }
)

onMounted(async () => {
    window.Prism = Prism
    validate(props.modelValue)
    await nextTick()
    runPrism(props.readonly ? readonlyCode.value : codeLayer.value)
})
</script>

<style scoped>
[v-cloak] {
    display: none;
}

/* Shared Base Styles */
.editor-base {
    margin: 0 !important;
    padding: 20px !important;
    font-family:
        ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
    font-size: 13px !important;
    line-height: 1.6 !important;
    tab-size: 2;
    border: none !important;
    white-space: pre-wrap !important;
    word-break: break-all !important;
    width: 100%;
    height: 100%;
}

/* Unified Viewport */
.editor-viewport {
    position: relative;
    height: 200px;
    overflow: hidden;
}

/* Edit Mode Layers */
.layer-textarea,
.layer-highlight {
    position: absolute !important;
    top: 0;
    left: 0;
}

.layer-textarea {
    z-index: 2;
    color: transparent !important;
    background: transparent !important;
    caret-color: #0f172a;
    resize: none;
    outline: none;
    overflow-y: auto;
}

.layer-highlight {
    z-index: 1;
    pointer-events: none;
    background: #ffffff !important;
    overflow: hidden;
}

/* Readonly Mode - Unified Background */
.readonly-container {
    height: 100%;
    width: 100%;
    overflow-y: auto;
    background: #f8fafc; /* nuxt-style light slate */
}

/* Prism Clean-up Overrides */
code[class*='language-'],
pre[class*='language-'] {
    text-shadow: none !important;
    background: transparent !important; /* Forces inheritance of parent bg */
}

.token.property {
    color: #2563eb !important;
    font-weight: 600;
}
.token.string {
    color: #059669 !important;
}
.token.number {
    color: #d97706 !important;
}
.token.boolean {
    color: #7c3aed !important;
}
.token.comment {
    color: #94a3b8 !important;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}
</style>
