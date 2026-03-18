<template>
    <div class="flex items-center gap-2 px-4 py-3.5">
        <UInput
            v-if="props.useFilter"
            :model-value="
                table?.tableApi?.getColumn(props.filterProp)?.getFilterValue()
            "
            class="max-w-sm min-w-[12ch]"
            :placeholder="props.filterText"
            @update:model-value="
                table?.tableApi
                    ?.getColumn(props.filterProp)
                    ?.setFilterValue($event)
            " />
        <slot></slot>

        <UDropdownMenu
            :items="
                table?.tableApi
                    ?.getAllColumns()
                    .filter(column => column.getCanHide())
                    .map(column => ({
                        label: upperFirst(column.id),
                        type: 'checkbox',
                        checked: column.getIsVisible(),
                        onUpdateChecked(checked) {
                            table?.tableApi
                                ?.getColumn(column.id)
                                ?.toggleVisibility(!!checked)
                        },
                        onSelect(e) {
                            e.preventDefault()
                        }
                    }))
            "
            :content="{ align: 'end' }">
            <UButton
                label="Columns"
                color="neutral"
                variant="outline"
                trailing-icon="i-lucide-chevron-down"
                class="ml-auto"
                aria-label="Columns select dropdown" />
        </UDropdownMenu>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { upperFirst } from 'scule'

const props = defineProps({
    table: {
        type: [Object, null],
        required: false,
        default: null
    },
    useFilter: {
        type: Boolean,
        default: true
    },
    filterProp: {
        type: String,
        default: 'email'
    },
    filterText: {
        type: String,
        default: 'Filter emails...'
    }
})
const table = computed(() => props.table)
</script>
