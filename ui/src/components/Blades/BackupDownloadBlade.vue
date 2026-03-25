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
                    {{ $t('backupDownloadBlade.downloadFile') }}
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
                    <UCheckbox
                        :label="$t('backupDownloadBlade.includeProcesses')"
                        v-model="includeApps" />
                    <UCheckbox
                        :label="$t('backupDownloadBlade.includeDeployments')"
                        v-model="includeDeployments" />

                    <UFormField
                        :label="$t('backupDownloadBlade.selectFileName')">
                        <USelect
                            v-model="fileName"
                            :items="filesNames"
                            class="w-64" />
                    </UFormField>
                    <UFormField
                        :label="$t('backupDownloadBlade.selectDownloadType')">
                        <USelect
                            v-model="downloadType"
                            :items="downloadTypes"
                            class="w-64" />
                    </UFormField>

                    <div class="mt-auto mb-20">
                        <UButton type="submit" class="">
                            {{ $t('common.submit') }}
                        </UButton>
                    </div>
                </UForm>
            </div>
        </template>
    </UDrawer>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBackupStore } from '../../stores/backup.js'

const { t } = useI18n()

const props = defineProps({
    open: Boolean,
    initVal: Object
})

const emit = defineEmits(['submit', 'cancel', 'close'])

const backupStore = useBackupStore()

const backup = ref(props.initVal)

const includeApps = ref(true)
const includeDeployments = ref(true)
const fileName = ref('ecosystem')
const downloadType = ref('raw')

const filesNames = ['ecosystem', 'ecosystem.config']

const downloadTypes = [
    {
        label: t('backupDownloadBlade.downloadTypes.raw'),
        value: 'raw'
    },
    {
        label: t('backupDownloadBlade.downloadTypes.json'),
        value: 'json'
    },
    {
        label: t('backupDownloadBlade.downloadTypes.commonJs'),
        value: 'cjs'
    },
    {
        label: t('backupDownloadBlade.downloadTypes.esm'),
        value: 'esm'
    }
]

const onSubmit = async () => {
    const { text } = await backupStore.getDownloadText(
        backup.value.id,
        includeApps.value,
        includeDeployments.value,
        downloadType.value
    )
    if (text) {
        let ext = 'json'
        if (downloadType.value === 'cjs') {
            ext = 'cjs'
        }
        if (downloadType.value === 'esm') {
            ext = 'mjs'
        }
        const filename = `${fileName.value}.${ext}`
        const blob = new Blob([text], { type: 'text/plain' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = filename
        link.click()

        setTimeout(() => {
            link.remove()
        }, 1000)
        emit('submit')
    }
}
</script>
