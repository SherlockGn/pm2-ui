<template>
    <UDrawer
        handle-only
        direction="right"
        :handle="false"
        :dismissible="true"
        v-model:open="communicationStore.sendDataBladeOpen">
        <template #body>
            <div class="flex items-center justify-between gap-4 mb-2 p-2">
                <h2 class="text-highlighted font-semibold">
                    Send data
                </h2>
                <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-lucide-x"
                    @click="communicationStore.sendDataBladeOpen = false" />
            </div>
            <div class="w-200 p-2">
                <UForm
                    class="space-y-4 flex flex-col h-[80vh]"
                    @submit="onSubmit">
                    <UFormField label="Data">
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
import { ref } from 'vue'
import { useCommunicationStore } from '../stores/communication.js'
import { useProcessStore } from '../stores/process.js'
import { addSuccessfulToast } from '../utils.js'

import JSON5 from 'json5'

const communicationStore = useCommunicationStore()
const processStore = useProcessStore()

const contentString = ref('')

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
            await communicationStore.sendData(
                processStore.activeProcess.pmId,
                parseContent(contentString.value)
            )
        ) {
            addSuccessfulToast('Sent successfully!')
        }
    } finally {
        communicationStore.sendDataBladeOpen = false
        contentString.value = ''
    }
}
</script>
