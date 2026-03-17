<template>
    <UDrawer
        handle-only
        direction="right"
        :handle="false"
        :dismissible="true"
        v-model:open="backupStore.backupDownloadBladeOpen">
        <template #body>
            <div class="flex items-center justify-between gap-4 mb-2 p-2">
                <h2 class="text-highlighted font-semibold">Download file</h2>
                <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-lucide-x"
                    @click="backupStore.backupDownloadBladeOpen = false" />
            </div>
            <div class="w-200 p-2">
                <UForm
                    class="space-y-4 flex flex-col h-[80vh]"
                    @submit="onSubmit">
                    <UCheckbox
                        label="Include processes"
                        v-model="includeApps" />
                    <UCheckbox
                        label="Include deployments"
                        v-model="includeDeployments" />

                    <UFormField label="Select file name">
                        <USelect
                            v-model="fileName"
                            :items="filesNames"
                            class="w-64" />
                    </UFormField>
                    <UFormField label="Select download type">
                        <USelect
                            v-model="downloadType"
                            :items="downloadTypes"
                            class="w-64" />
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
import { useBackupStore } from '../stores/backup.js'
import { addSuccessfulToast } from '../utils.js'

const backupStore = useBackupStore()

const includeApps = ref(true)
const includeDeployments = ref(true)
const fileName = ref('ecosystem')
const downloadType = ref('raw')

const filesNames = ['ecosystem', 'ecosystem.config']

const downloadTypes = [
    {
        label: 'Raw',
        value: 'raw'
    },
    {
        label: 'JSON',
        value: 'json'
    },
    {
        label: 'Common JS',
        value: 'cjs'
    },
    {
        label: 'ESM',
        value: 'esm'
    }
]

const onSubmit = async () => {
    try {
        const { text } = await backupStore.getDownloadText(
            backupStore.active.id,
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
            addSuccessfulToast('Downloaded successfully!')
        }
    } finally {
        backupStore.backupDownloadBladeOpen = false
    }
}
</script>
