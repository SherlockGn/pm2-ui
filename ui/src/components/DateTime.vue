<template>
    <div class="flex items-center gap-2">
        <UInputDate :modelValue="date" @update:modelValue="updateDate" />
        <UInputTime
            :modelValue="time"
            :hour-cycle="24"
            @update:modelValue="updateTime" />
    </div>
</template>

<script setup>
import { computed } from 'vue'

import { CalendarDate, Time } from '@internationalized/date'

const props = defineProps({
    modelValue: Date
})

const emit = defineEmits(['update:modelValue'])

const date = computed(() => {
    return new CalendarDate(
        props.modelValue.getFullYear(),
        props.modelValue.getMonth() + 1,
        props.modelValue.getDate()
    )
})

const time = computed(() => {
    return new Time(
        props.modelValue.getHours(),
        props.modelValue.getMinutes(),
        props.modelValue.getSeconds()
    )
})

const updateDate = e => {
    const d = new Date()
    d.setFullYear(e.year)
    d.setMonth(e.month - 1)
    d.setDate(e.day)
    d.setHours(props.modelValue.getHours())
    d.setMinutes(props.modelValue.getMinutes())
    d.setSeconds(0)
    d.setMilliseconds(0)
    emit('update:modelValue', d)
}

const updateTime = e => {
    const d = new Date()
    d.setFullYear(props.modelValue.getFullYear())
    d.setMonth(props.modelValue.getMonth())
    d.setDate(props.modelValue.getDate())
    d.setHours(e.hour)
    d.setMinutes(e.minute)
    d.setSeconds(0)
    d.setMilliseconds(0)
    emit('update:modelValue', d)
}
</script>
