<template>
    <UDrawer
        handle-only
        direction="right"
        :handle="false"
        :dismissible="true"
        :open="open"
        @update:open="e => e || emit('cancel')"
        @animationEnd="e => (e ? onOpen() : emit('close'))">
        <template #body>
            <div class="flex items-center justify-between gap-4 mb-2 p-2">
                <h2 class="text-highlighted font-semibold">
                    {{ title }}
                </h2>
                <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-lucide-x"
                    @click="emit('update:modelValue', false)" />
            </div>
            <div class="w-200 p-2">
                <UForm class="space-y-4 flex flex-col" @submit="onSubmit">
                    <UFormField v-if="value" :label="value.label">
                        <UInputNumber
                            v-if="value?.type === 'number'"
                            v-model="input"
                            v-bind="value?.attrs ?? {}" />
                        <UInput
                            v-if="value?.type === 'text'"
                            v-model="input"
                            class="w-80"
                            v-bind="value?.attrs ?? {}" />
                    </UFormField>
                    <ProcessSelector
                        v-if="value?.type === 'processSelector'"
                        v-model="input"
                        :use-tooltip="false"
                        v-bind="value?.attrs ?? {}"></ProcessSelector>

                    <UProgress animation="swing" v-if="loading" />

                    <div class="mt-5 mb-20" v-if="!autoRun">
                        <UButton type="submit" class="">Submit</UButton>
                    </div>
                </UForm>
                <Terminal v-if="data" v-model="data"></Terminal>
            </div>
        </template>
    </UDrawer>
</template>

<script setup>
import { computed, ref } from 'vue'
import ProcessSelector from '../ProcessSelector.vue'
import Terminal from '../Terminal.vue'

const props = defineProps({
    open: Boolean,
    initVal: Object,
    title: {
        type: String,
        default: 'Deployment Result'
    },
    value: Object,
    autoRun: Boolean,
    exec: Function
})

const emit = defineEmits(['cancel', 'close'])

const title = computed(() => props.initVal.title)
const value = computed(() => props.initVal.value)
const autoRun = computed(() => props.initVal.autoRun)
const exec = computed(() => props.initVal.exec)

const getDefaultValue = () => {
    if (value?.type === 'number') {
        return 1
    }

    if (value?.type === 'string') {
        return ''
    }
}

const onSubmit = async () => {
    try {
        loading.value = true
        await execute()
    } finally {
        loading.value = false
    }
}
const loading = ref(false)

const execute = async () => {
    data.value = await exec.value(input.value)
}

const onOpen = async () => {
    if (autoRun.value) {
        await onSubmit()
    }
}

const input = ref(getDefaultValue())
const data = ref(null)
</script>
