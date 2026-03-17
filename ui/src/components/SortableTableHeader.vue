<template>
    <UButton
        color="neutral"
        variant="ghost"
        :label="props.label"
        :icon="
            props.column.getIsSorted()
                ? props.column.getIsSorted() === 'asc'
                    ? 'i-lucide-arrow-up-narrow-wide'
                    : 'i-lucide-arrow-down-wide-narrow'
                : 'i-lucide-arrow-up-down'
        "
        class="-mx-2.5 font-bold"
        :onClick="
            () =>
                props.column.toggleSorting(props.column.getIsSorted() === 'asc')
        "></UButton>
</template>

<script setup>
const props = defineProps({
    column: {
        type: Object,
        required: true
    },
    label: {
        type: String,
        required: true
    }
})
</script>
