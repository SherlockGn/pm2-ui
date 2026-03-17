<template>
    <UDrawer
        handle-only
        direction="right"
        :handle="false"
        :dismissible="true"
        v-model:open="backupStore.backupBladeOpen">
        <template #body>
            <div class="flex items-center justify-between gap-4 mb-2 p-2">
                <h2 class="text-highlighted font-semibold">
                    {{
                        backupStore.backupBladeMode === 'create'
                            ? 'Create backup'
                            : 'Update backup'
                    }}
                </h2>
                <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-lucide-x"
                    @click="backupStore.backupBladeOpen = false" />
            </div>
            <div class="w-200 p-2">
                <UForm
                    class="space-y-4 flex flex-col h-[80vh]"
                    @submit="onSubmit">
                    <UFormField label="Backup name">
                        <UInput
                            v-model="backupStore.active.name"
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
import { useBackupStore } from '../stores/backup.js'
import { addSuccessfulToast } from '../utils.js'

const backupStore = useBackupStore()

const onSubmit = async () => {
    try {
        if (backupStore.backupBladeMode === 'create') {
            await backupStore.backupSnapshot(backupStore.active.name)
            addSuccessfulToast('Created successfully!')
        } else {
            await backupStore.update(
                backupStore.active.id,
                backupStore.active.name
            )
            addSuccessfulToast('Updated successfully!')
        }
    } finally {
        backupStore.backupBladeOpen = false
        backupStore.refresh()
    }
}
</script>
