<template>
    <UDrawer
        handle-only
        direction="right"
        :handle="false"
        :dismissible="true"
        @animationEnd="e => (e ? onOpen() : emit('close'))"
        :open="props.modelValue"
        @update:open="e => emit('update:modelValue', e)">
        <template #body>
            <div class="flex items-center justify-between gap-4 mb-2 p-2">
                <h2 class="text-highlighted font-semibold">
                    {{ props.title }}
                </h2>
                <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-lucide-x"
                    @click="emit('update:modelValue', false)" />
            </div>
            <div class="w-200 p-2">
                <UForm class="space-y-4 flex flex-col" @submit="onSubmit">
                    <UFormField v-if="props.value" :label="props.value.label">
                        <UInputNumber
                            v-if="props.value?.type === 'number'"
                            v-model="input"
                            v-bind="props.value?.attrs ?? {}" />
                        <UInput
                            v-if="props.value?.type === 'text'"
                            v-model="input"
                            class="w-80"
                            v-bind="props.value?.attrs ?? {}" />
                    </UFormField>
                    <ProcessSelector
                        v-if="props.value?.type === 'processSelector'"
                        v-model="input"
                        :use-tooltip="false"
                        v-bind="props.value?.attrs ?? {}"></ProcessSelector>

                    <UProgress animation="swing" v-if="loading" />

                    <div class="mt-5 mb-20" v-if="!props.autoRun">
                        <UButton type="submit" class="">Submit</UButton>
                    </div>
                </UForm>
                <Terminal v-if="data" v-model="data"></Terminal>
            </div>
        </template>
    </UDrawer>
</template>

<script setup>
import { ref } from 'vue'
import ProcessSelector from './ProcessSelector.vue'
import Terminal from './Terminal.vue'

const props = defineProps({
    modelValue: Boolean,
    title: {
        type: String,
        default: 'Deployment Result'
    },
    value: Object,
    autoRun: Boolean,
    exec: Function
})

const emit = defineEmits(['update:modelValue', 'close'])

const getDefaultValue = () => {
    if (props.value?.type === 'number') {
        return 1
    }

    if (props.value?.type === 'string') {
        return ''
    }
}

const onSubmit = async () => {
    try {
        loading.value = true
        await exec()
    } finally {
        loading.value = false
    }
}
const loading = ref(false)

const exec = async () => {
    data.value = await props.exec(input.value)
}

const onOpen = async () => {
    if (props.autoRun) {
        await onSubmit()
    }
}

const input = ref(getDefaultValue())
const data = ref(null)
</script>
