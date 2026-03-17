<template>
    <UInputNumber
        :modelValue="value"
        :min="1"
        @update:modelValue="updateValue" />
    <USelectMenu
        class="w-40"
        :modelValue="unit"
        @update:modelValue="updateUnit"
        value-key="id"
        :items="units" />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    modelValue: Number
})

const emit = defineEmits(['update:modelValue'])

const units = [
    { id: 'day', label: 'Days' },
    { id: 'hour', label: 'Hours' },
    { id: 'minute', label: 'Minutes' },
    { id: 'second', label: 'Seconds' },
    { id: 'millisecond', label: 'Milliseconds' }
]

const getBestDisplay = value => {
    if (value % 1000 != 0) {
        return { value, unit: 'millisecond' }
    }
    value = value / 1000
    if (value % 60 != 0) {
        return { value, unit: 'second' }
    }
    value = value / 60
    if (value % 60 != 0) {
        return { value, unit: 'minute' }
    }
    value = value / 60
    if (value % 24 != 0) {
        return { value, unit: 'hour' }
    }
    value = value / 24
    return { value, unit: 'day' }
}

const unit = computed(() => getBestDisplay(props.modelValue).unit)
const value = computed(() => getBestDisplay(props.modelValue).value)

const updateValue = e => {
    let d = e,
        u = unit.value
    if (u == 'second') {
        d *= 1000
    } else if (u == 'minute') {
        d *= 60 * 1000
    } else if (u == 'hour') {
        d *= 60 * 60 * 1000
    } else if (u == 'day') {
        d *= 24 * 60 * 60 * 1000
    }
    emit('update:modelValue', d)
}

const updateUnit = e => {
    let d = value.value,
        u = e
    if (u == 'second') {
        d *= 1000
    } else if (u == 'minute') {
        d *= 60 * 1000
    } else if (u == 'hour') {
        d *= 60 * 60 * 1000
    } else if (u == 'day') {
        d *= 24 * 60 * 60 * 1000
    }
    emit('update:modelValue', d)
}
</script>
