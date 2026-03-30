<template>
    <div
        class="max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm overflow-hidden">
        <div
            class="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
            <h2
                class="text-xs font-bold text-gray-500 dark:text-gray-400 tracking-tight">
                {{ $t('stringList.items') }} ({{ list.length }})
            </h2>
            <button
                @click.prevent="add"
                class="text-xs font-medium text-primary hover:text-primary-700 flex items-center gap-1">
                <UIcon name="i-lucide-plus" />
                {{ $t('stringList.add') }}
            </button>
        </div>

        <div
            class="divide-y divide-gray-100 dark:divide-gray-700 max-h-48 overflow-y-auto">
            <div
                v-for="(item, index) in list"
                :key="index"
                class="flex items-center px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-800 group">
                <span class="text-[10px] text-gray-400 w-4 font-mono">
                    {{ index + 1 }}
                </span>
                <input
                    v-model="list[index]"
                    type="text"
                    placeholder="Value.."
                    class="flex-1 bg-transparent border-none text-sm px-2 py-1 outline-none focus:ring-0 text-gray-900 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600" />
                <button
                    @click.prevent="remove(index)"
                    class="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity">
                    <UIcon name="i-lucide-x" />
                </button>
            </div>
            <div
                v-if="list.length === 0"
                class="p-4 text-center text-xs text-gray-400">
                {{ $t('stringList.listIsEmpty') }}
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({
    modelValue: Array
})
const list = computed(() => props.modelValue)
const add = () => list.value.push('')
const remove = i => list.value.splice(i, 1)
</script>
