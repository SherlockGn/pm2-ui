<template>
    <div class="px-4 py-3.5 text-sm text-muted">
        {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }}
        {{ $t('tableFilterResult.of') }}
        {{ props.total }} {{ $t('tableFilterResult.rowsFiltered') }}
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
