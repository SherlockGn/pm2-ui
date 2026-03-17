<template>
    <UDrawer
        handle-only
        direction="right"
        class="w-200"
        :handle="false"
        :dismissible="true"
        v-model:open="processStore.descriptionBladeOpen">
        <template #body>
            <UCommandPalette
                :fuse="{
                    resultLimit: 1000
                }"
                :groups="data"
                class="flex-1" />
        </template>
    </UDrawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useProcessStore } from '../stores/process.js'

const processStore = useProcessStore()

const data = computed(() => {
    if (processStore.activeProcess == null) {
        return []
    }
    return [
        {
            id: 'basic',
            label: 'Basic Information',
            items: Object.entries(processStore.activeProcess)
                .filter(i => typeof i[1] !== 'object')
                .map(i => {
                    return {
                        label: i[0],
                        suffix: i[1]?.toString() ?? 'null'
                    }
                })
        },
        {
            id: 'attr',
            label: 'Attributes',
            items: processStore.activeProcess.attrs.map(i => {
                return {
                    label: i.key,
                    suffix: i.value?.toString() ?? 'null'
                }
            })
        },
        {
            id: 'rpc',
            label: 'RPCs',
            items: processStore.activeProcess.rpc.map(i => {
                return {
                    label: i.name,
                    suffix: i.isBuiltIn ? 'builtIn' : ''
                }
            })
        },
        {
            id: 'metrics',
            label: 'Metrics',
            items: processStore.activeProcess.metrics.map(i => {
                return {
                    label: i.name,
                    suffix: `${i.value} ${i.unit ?? ''} ${i.type ? `(${i.type})` : ''}`
                }
            })
        },
        {
            id: 'customEnv',
            label: 'Custom Environment Variables',
            items: processStore.activeProcess.env.custom.map(i => {
                return {
                    label: i.key,
                    suffix: i.value.toString()
                }
            })
        },
        {
            id: 'commonEnv',
            label: 'Common Environment Variables',
            items: processStore.activeProcess.env.common.map(i => {
                return {
                    label: i.key,
                    suffix: i.value.toString()
                }
            })
        }
    ]
})
</script>
