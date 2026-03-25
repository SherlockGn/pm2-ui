<template>
    <UDrawer
        handle-only
        direction="right"
        class="w-200"
        :handle="false"
        :dismissible="true"
        :open="props.open"
        @update:open="e => e || emit('cancel')"
        @animationEnd="e => e || emit('close')">
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
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
    open: Boolean,
    initVal: Object,
    mode: {
        type: String,
        default: 'create'
    }
})

const emit = defineEmits(['close', 'cancel'])

const process = ref(props.initVal)

const data = computed(() => {
    if (process.value == null) {
        return []
    }
    return [
        {
            id: 'basic',
            label: t('descriptionBlade.basicInformation'),
            items: Object.entries(process.value)
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
            label: t('descriptionBlade.attributes'),
            items: process.value.attrs.map(i => {
                return {
                    label: i.key,
                    suffix: i.value?.toString() ?? 'null'
                }
            })
        },
        {
            id: 'rpc',
            label: t('descriptionBlade.rpcs'),
            items: process.value.rpc.map(i => {
                return {
                    label: i.name,
                    suffix: i.isBuiltIn ? t('descriptionBlade.builtIn') : ''
                }
            })
        },
        {
            id: 'metrics',
            label: t('descriptionBlade.metrics'),
            items: process.value.metrics.map(i => {
                return {
                    label: i.name,
                    suffix: `${i.value} ${i.unit ?? ''} ${i.type ? `(${i.type})` : ''}`
                }
            })
        },
        {
            id: 'customEnv',
            label: t('descriptionBlade.customEnvironmentVariables'),
            items: process.value.env.custom.map(i => {
                return {
                    label: i.key,
                    suffix: i.value.toString()
                }
            })
        },
        {
            id: 'commonEnv',
            label: t('descriptionBlade.commonEnvironmentVariables'),
            items: process.value.env.common.map(i => {
                return {
                    label: i.key,
                    suffix: i.value.toString()
                }
            })
        }
    ]
})
</script>
