<template>
    <UDrawer
        handle-only
        direction="right"
        :handle="false"
        :dismissible="true"
        v-model:open="communicationStore.viewDataBladeOpen">
        <template #body>
            <div class="flex items-center justify-between gap-4 mb-2 p-2">
                <h2 class="text-highlighted font-semibold">
                    Remote Procedure Call (RPC)
                </h2>
                <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-lucide-x"
                    @click="communicationStore.viewDataBladeOpen = false" />
            </div>
            <div class="w-200 p-2">
                <UForm class="space-y-4 flex flex-col h-[80vh]">
                    <UFormField label="Data">
                        <Json5
                            v-if="dataString !== ''"
                            v-model="dataString"
                            :readonly="true"
                            class="w-120" />
                        <UKbd v-else>Undefined</UKbd>
                    </UFormField>

                    <UFormField label="Response" v-if="rspString !== ''">
                        <Json5
                            v-model="rspString"
                            :readonly="true"
                            class="w-120" />
                    </UFormField>
                </UForm>
            </div>
        </template>
    </UDrawer>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useCommunicationStore } from '../stores/communication.js'

import Json5 from './Json5.vue'

const communicationStore = useCommunicationStore()

const dataString = ref('')
const rspString = ref('')

watchEffect(() => {
    const data = communicationStore.activeCommunication?.data
    dataString.value = data === undefined ? '' : JSON.stringify(data, null, 4)

    const rsp = communicationStore.activeCommunication?.rsp
    rspString.value = rsp === undefined ? '' : JSON.stringify(rsp, null, 4)
})
</script>
