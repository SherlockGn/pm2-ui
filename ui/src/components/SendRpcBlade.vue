<template>
    <UDrawer
        handle-only
        direction="right"
        :handle="false"
        :dismissible="true"
        v-model:open="communicationStore.sendRpcBladeOpen">
        <template #body>
            <div class="flex items-center justify-between gap-4 mb-2 p-2">
                <h2 class="text-highlighted font-semibold">
                    Remote Procedure Call (RPC)
                </h2>
                <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-lucide-x"
                    @click="communicationStore.sendRpcBladeOpen = false" />
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
import { useCommunicationStore } from '../stores/communication.js'
import { useProcessStore } from '../stores/process.js'
import { addSuccessfulToast } from '../utils.js'

import JSON5 from 'json5'

const communicationStore = useCommunicationStore()
const processStore = useProcessStore()

const rpcNames = computed(() => {
    return processStore.activeProcess?.rpc?.map(i => i.name) ?? []
})

const rpcName = ref(null)
const contentString = ref('')

const hasParam = computed(() => {
    return (
        processStore.activeProcess?.rpc?.find(i => i.name === rpcName.value)
            ?.hasParam ?? false
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
    try {
        if (
            await communicationStore.sendRpc(
                processStore.activeProcess.pmId,
                rpcName.value,
                hasParam.value ? parseContent(contentString.value) : null
            )
        ) {
            addSuccessfulToast('Sent successfully!')
        }
    } finally {
        communicationStore.sendRpcBladeOpen = false
        contentString.value = ''
        rpcName.value = null
    }
}
</script>
