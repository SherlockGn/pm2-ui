<style scoped>
[v-cloak] {
    display: none;
}
.spinner {
    border: 2px solid #f3f3f3;
    border-top: 2px solid #10b981;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
}
@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
<template>
    <div class="relative">
        <div class="flex group">
            <UInput
                v-model="value"
                :placeholder="props.placeholder"
                class="w-100"
                :value="modelValue"
                @blur="emitFormBlur()"
                @input="$emit('update:modelValue', $event.target.value)"
                :ui="{ trailing: 'pe-1' }">
                <template #trailing>
                    <UButton
                        @click.prevent="openBrowser"
                        @blur="emitFormBlur()"
                        color="neutral"
                        variant="link"
                        size="sm"
                        :icon="
                            props.type === 'file'
                                ? 'i-lucide-file'
                                : 'i-lucide-folder'
                        "
                        aria-label="Clear input"
                        @click="value = ''" />
                </template>
            </UInput>
        </div>

        <div
            v-if="isOpen"
            class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div
                class="bg-white w-full max-w-xl rounded-2xl shadow-2xl flex flex-col h-[500px] border border-slate-200 overflow-hidden">
                <div
                    class="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-1 overflow-x-auto whitespace-nowrap">
                    <button
                        @click.prevent="navTo([])"
                        class="hover:text-emerald-600 text-slate-400">
                        <UIcon name="i-lucide-home" class="text-primary" />
                    </button>
                    <template v-for="(seg, i) in buffer" :key="i">
                        <span class="text-slate-300 font-bold px-1">
                            {{ sep }}
                        </span>
                        <button
                            @click.prevent="navTo(buffer.slice(0, i + 1))"
                            class="text-xs font-bold text-slate-600 hover:text-emerald-600">
                            {{ seg }}
                        </button>
                    </template>
                </div>

                <div class="flex-1 overflow-y-auto p-4 relative bg-white">
                    <div
                        v-if="loading"
                        class="absolute inset-0 bg-white/80 z-10 flex flex-col items-center justify-center">
                        <div class="spinner mb-2"></div>
                        <span
                            class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Accessing File System...
                        </span>
                    </div>

                    <div class="space-y-1">
                        <div
                            v-for="f in remote.folders"
                            :key="f"
                            @click="navTo([...buffer, f])"
                            class="flex items-center gap-3 p-2 rounded-lg hover:bg-emerald-50 cursor-pointer group transition-colors">
                            <UIcon
                                name="i-lucide-folder-dot"
                                class="text-primary" />
                            <span class="text-sm font-medium text-slate-700 hidden [display:block] min-[900px]:block">
                                {{ f }}
                            </span>
                        </div>

                        <div
                            v-for="file in remote.files"
                            :key="file"
                            @click="selectedFile = file"
                            :class="[
                                'flex items-center gap-3 p-2 rounded-lg cursor-pointer border transition-all',
                                selectedFile === file
                                    ? 'bg-emerald-100 border-emerald-300'
                                    : 'border-transparent hover:bg-slate-50'
                            ]">
                            <UIcon name="i-lucide-file" class="text-primary" />
                            <span class="text-sm font-medium text-slate-700">
                                {{ file }}
                            </span>
                        </div>
                    </div>
                </div>

                <div
                    class="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <div
                        class="text-[10px] font-mono text-slate-400 truncate max-w-[280px]">
                        Preview: {{ sep === '/' ? '/' : ''
                        }}{{ buffer.join(sep)
                        }}{{ selectedFile ? sep + selectedFile : '' }}
                    </div>
                    <div class="flex gap-3">
                        <button
                            @click.prevent="isOpen = false"
                            class="text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors">
                            Cancel
                        </button>
                        <button
                            @click.prevent="confirm"
                            :disabled="
                                props.type === 'file'
                                    ? !selectedFile
                                    : !!selectedFile || buffer.length === 0
                            "
                            class="bg-primary hover:bg-primary-700 disabled:opacity-40 text-white px-5 py-2 rounded-lg transition-all shadow-md">
                            {{
                                props.type === 'file'
                                    ? 'Confirm'
                                    : 'Select this folder'
                            }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive, computed } from 'vue'

const props = defineProps({
    modelValue: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'folder'
    },
    sep: {
        type: String,
        default: '\\'
    },
    placeholder: {
        type: String,
        default: 'Select a file'
    },
    walk: {
        type: Function,
        default: async pathArray => {
            await new Promise(r => setTimeout(r, 200))
            if (pathArray[0] === 'E:') {
                throw new Error('E: drive is not ready')
            }
            const depth = pathArray.length
            if (depth === 0) {
                return { folders: ['C:', 'D:', 'E:'], files: [] }
            }
            const folders = [
                'etc',
                'var',
                'home',
                'usr',
                'bin',
                'www',
                'html'
            ].filter((_, i) => (i + depth) % 2 === 0)
            const files = [
                'config.json',
                'index.html',
                'package.json',
                'server.js',
                'app.yml'
            ].filter((_, i) => (i + depth) % 2 !== 0)

            return { folders, files }
        }
    }
})

const emit = defineEmits(['update:modelValue'])

const { emitFormBlur } = useFormField()

const isOpen = ref(false)
const loading = ref(false)
const buffer = ref([])
const selectedFile = ref(null)
const remote = reactive({ folders: [], files: [] })

const sep = computed(() => props.sep)

const openBrowser = async () => {
    // Parse existing string into the buffer (draft)
    const parts = props.modelValue.split(/[\\\/]/).filter(p => p)

    // Check if last part is a file
    if (parts.length > 0 && parts[parts.length - 1].includes('.')) {
        selectedFile.value = parts.pop()
    } else {
        selectedFile.value = null
    }

    buffer.value = parts
    isOpen.value = true
    navTo(buffer.value)
}

const navTo = async newPathArr => {
    buffer.value = newPathArr
    selectedFile.value = null
    try {
        loading.value = true
        const data = await props.walk(buffer.value)
        remote.folders = data.folders
        remote.files = data.files
    } catch (error) {
        if (newPathArr.length > 0) {
            navTo([])
        } else {
            remote.folders = []
            remote.files = []
        }
    } finally {
        loading.value = false
    }
}

const confirm = () => {
    const prefix = sep.value === '/' ? '/' : ''
    const folderPart = buffer.value.join(sep.value)
    const filePart = selectedFile.value || ''

    // Build the final path string
    const result =
        prefix +
        folderPart +
        (folderPart && filePart ? sep.value : '') +
        filePart

    emit('update:modelValue', result)
    isOpen.value = false
}
</script>
