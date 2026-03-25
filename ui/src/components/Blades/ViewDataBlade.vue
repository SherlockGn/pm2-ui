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
                    {{ $t('viewDataBlade.title') }}
                </h2>
                <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-lucide-x"
                    @click="emit('cancel')" />
            </div>
            <div class="w-200 p-2">
                <UForm class="space-y-4 flex flex-col h-[80vh]">
                    <UFormField :label="$t('viewDataBlade.data')">
                        <Json5
                            v-if="dataString !== ''"
                            v-model="dataString"
                            :readonly="true"
                            class="w-120" />
                        <UKbd v-else>{{ $t('viewDataBlade.undefined') }}</UKbd>
                    </UFormField>

                    <UFormField
                        :label="$t('viewDataBlade.response')"
                        v-if="rspString !== ''">
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
import { computed } from 'vue'

import Json5 from '../Json5.vue'

const props = defineProps({
    open: Boolean,
    initVal: Object
})

const emit = defineEmits(['cancel', 'close'])

const dataString = computed(() =>
    props.initVal.data === undefined
        ? ''
        : JSON.stringify(props.initVal.data, null, 4)
)
const rspString = computed(() =>
    props.initVal.rsp === undefined
        ? ''
        : JSON.stringify(props.initVal.rsp, null, 4)
)
</script>
