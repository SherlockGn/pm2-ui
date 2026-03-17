<template>
    <div class="flex gap-2 items-center">
        <UFormField label="Select the process">
            <USelectMenu
                :items="processStore.managedProcesses"
                v-model="selected"
                :modelValue="props.modelValue"
                @update:modelValue="e => emit('update:modelValue', e)"
                :filter-fields="['name']"
                icon="i-lucide-user"
                placeholder="Select process"
                class="w-80">
                <template #leading>
                    <UIcon name="i-lucide-app-window-mac" />
                </template>

                <template #default>
                    {{ selected?.name ?? '&nbsp;' }}
                </template>

                <template #item-label="{ item }">
                    <div class="flex items-center gap-2">
                        <span class="p1">{{ item.name }}</span>

                        <UTooltip v-if="props.useTooltip" :text="item.script">
                            <ULink
                                class="flex-1 underline w-20 inline-block truncate">
                                {{ processStore.getFileName(item.script) }}
                            </ULink>
                        </UTooltip>
                        <ULink
                            v-else
                            class="flex-1 underline w-20 inline-block truncate">
                            {{ processStore.getFileName(item.script) }}
                        </ULink>

                        <UBadge
                            class="uppercase p1"
                            variant="subtle"
                            :color="getStatusColor(item.status)">
                            {{ item.status }}
                        </UBadge>
                    </div>
                </template>
            </USelectMenu>
        </UFormField>
        <UFormField label="&nbsp;">
            <UButton
                icon="i-lucide-refresh-ccw"
                variant="outline"
                @click="refresh"></UButton>
        </UFormField>
    </div>
</template>
<script setup>
import { onMounted, computed } from 'vue'

import { useProcessStore } from '../stores/process.js'
import { getStatusColor, addSuccessfulToast } from '../utils.js'

const props = defineProps({
    modelValue: Object,
    useTooltip: {
        type: Boolean,
        default: true
    }
})
const emit = defineEmits(['update:modelValue', 'refresh'])

const processStore = useProcessStore()

const selected = computed(() => props.modelValue)

const refresh = async () => {
    if (await processStore.refresh()) {
        addSuccessfulToast('Refreshed successfully!')
    }
    emit('refresh')
}

onMounted(async () => {
    await processStore.refresh()
    emit('update:modelValue', processStore.managedProcesses[0])
})
</script>
