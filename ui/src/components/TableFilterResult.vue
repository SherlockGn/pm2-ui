<template>
    <div class="px-4 py-3.5 text-sm text-muted">
        {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }}
        of
        {{ props.total }} row(s) filtered.
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    table: {
        type: [Object, null],
        required: false,
        default: null
    },
    total: Number
})

const table = computed(() => props.table)
</script>
