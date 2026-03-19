<template>
    <UDrawer
        handle-only
        direction="right"
        :handle="false"
        :dismissible="true"
        :open="props.open"
        @update:open="e => e || emit('cancel')"
        @animationEnd="e => e || emit('close')">
        <template #body>
            <div class="flex items-center justify-between gap-4 mb-2 p-2">
                <h2 class="text-highlighted font-semibold">
                    Remote Procedure Call (RPC)
                </h2>
                <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-lucide-x"
                    @click="emit('cancel')" />
            </div>
            <div class="w-200 p-2">
                <UForm
                    class="space-y-4 flex flex-col h-[80vh]"
                    @submit="onSubmit">
                    <UFormField label="Select RPC name">
                        <USelect
                            v-model="rpcName"
                            :items="rpcNames"
                            class="w-64" />
                    </UFormField>
                    <UFormField v-if="hasParam" label="Parameter">
                        <Json5 v-model="contentString" class="w-120" />
                    </UFormField>

                    <div class="mt-auto mb-20">
                        <UButton type="submit" class="">Submit</UButton>
                    </div>
                </UForm>
            </div>
        </template>
    </UDrawer>
</template>

<script setup>
import { computed, ref } from 'vue'
import JSON5 from 'json5'

const props = defineProps({
    open: Boolean,
    initVal: Object
})

const emit = defineEmits(['submit', 'cancel', 'close'])

const process = ref(props.initVal)

const rpcNames = computed(() => {
    return process.value.rpc.map(i => i.name)
})

const rpcName = ref(null)
const contentString = ref('')

const hasParam = computed(() => {
    return (
        process.value.rpc.find(i => i.name === rpcName.value)?.hasParam ?? false
    )
})

const parseContent = content => {
    if (content === '') {
        return undefined
    }
    try {
        return JSON5.parse(content)
    } catch (e) {
        return undefined
    }
}

const onSubmit = async () => {
    emit('submit', {
        rpcName: rpcName.value,
        content: hasParam.value ? parseContent(contentString.value) : null
    })
}
</script>
