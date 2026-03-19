<template>
    <UTabs :items="tabs" variant="link" class="w-full">
        <template #backup>
            <TableCommonAction
                :table="table"
                filter-prop="name"
                filter-text="Filter name...">
                <UButton
                    color="primary"
                    icon="i-lucide-refresh-ccw"
                    variant="outline"
                    label="Refresh"
                    @click="refresh" />
            </TableCommonAction>
            <UButton
                class="ml-4"
                color="primary"
                icon="i-lucide-database-backup"
                variant="outline"
                label="Create backup"
                @click="startBackup" />
            <UButton
                class="ml-4"
                color="primary"
                icon="i-lucide-hard-drive-upload"
                variant="outline"
                label="Upload backup file"
                @click="uploadFile" />
            <FullHeight>
                <template #body>
                    <UTable
                        ref="table"
                        sticky
                        :data="backupStore.backups"
                        :columns="columns">
                        <template #createdBy-header="{ column }">
                            <SortableTableHeader
                                :column="column"
                                label="Created By" />
                        </template>
                        <template #createdAt-header="{ column }">
                            <SortableTableHeader
                                :column="column"
                                label="Create Time" />
                        </template>
                        <template #updatedAt-header="{ column }">
                            <SortableTableHeader
                                :column="column"
                                label="Update Time" />
                        </template>
                        <template #createdBy-cell="{ row }">
                            <ULink
                                v-if="row.original.userId != null"
                                class="underline"
                                to="/user">
                                {{
                                    userStore.users.find(
                                        u => u.id === row.original.userId
                                    )?.displayName ?? 'Anonymous'
                                }}
                            </ULink>
                            <UBadge
                                v-else
                                class="uppercase"
                                variant="subtle"
                                color="success">
                                Automatically
                            </UBadge>
                        </template>
                        <template #actions-cell="{ row }">
                            <UDropdownMenu
                                :content="{
                                    align: 'end'
                                }"
                                :items="getActions(row)"
                                aria-label="Actions dropdown">
                                <UButton
                                    icon="i-lucide-ellipsis-vertical"
                                    color="neutral"
                                    variant="ghost"
                                    aria-label="Actions dropdown"></UButton>
                            </UDropdownMenu>
                        </template>
                    </UTable>
                </template>
                <template #footer>
                    <TableFilterResult
                        :table="table"
                        :total="backupStore.backups.length"></TableFilterResult>
                </template>
            </FullHeight>
        </template>
        <template #automatic-backup>
            <UButton
                class="mt-5 ml-5"
                color="primary"
                icon="i-lucide-refresh-ccw"
                variant="outline"
                label="Refresh"
                @click="refreshSettings" />
            <UFormField
                label="Enable automatic backup"
                description="Automatic backup occurs 00:00 AM daily"
                class="mt-5 ml-5">
                <USwitch
                    @change="updateAutomaticBackup"
                    v-model="kvStore.settings.enableAutoBackup"></USwitch>
            </UFormField>
        </template>
    </UTabs>
</template>

<script setup>
import { ref, useTemplateRef, onMounted } from 'vue'

import { useBackupStore } from '../stores/backup.js'
import { useUserStore } from '../stores/user.js'
import { useKvStore } from '../stores/kv.js'

import FullHeight from '../components/FullHeight.vue'
import TableCommonAction from '../components/TableCommonAction.vue'
import BackupBlade from '../components/Blades/BackupBlade.vue'
import backupDownloadBlade from '../components/Blades/BackupDownloadBlade.vue'

import {
    formatDate,
    addSuccessfulToast,
    addErrorToast,
    toFriendlyMemory,
    createCommonBlade
} from '../utils.js'

import JSON5 from 'json5'

const backupStore = useBackupStore()
const userStore = useUserStore()
const kvStore = useKvStore()

onMounted(async () => {
    await backupStore.refresh()
})

const refresh = async () => {
    await backupStore.refresh()
    addSuccessfulToast('Refreshed successfully!')
}

const tabs = ref([
    {
        label: 'Backup',
        icon: 'i-lucide-database-backup',
        slot: 'backup'
    },
    {
        label: 'Automatic Backup',
        icon: 'i-lucide-bot',
        slot: 'automatic-backup'
    }
])

const columns = [
    {
        accessorKey: 'id',
        header: '#',
        cell: ({ row }) => row.getValue('id')
    },
    {
        accessorKey: 'name',
        cell: ({ row }) => row.getValue('name')
    },
    {
        accessorKey: 'createdBy'
    },
    {
        acccessorKey: 'proccessCount',
        header: 'Process Count',
        cell: ({ row }) => row.original.metadata.appCount
    },
    {
        accessorKey: 'deploymentCount',
        header: 'Deployment Count',
        cell: ({ row }) => row.original.metadata.deploymentCount
    },
    {
        accessorKey: 'size',
        header: 'Size',
        cell: ({ row }) => toFriendlyMemory(row.original.metadata.size)
    },
    {
        accessorKey: 'createdAt',
        cell: ({ row }) => formatDate(row.getValue('createdAt'))
    },
    {
        accessorKey: 'updatedAt',
        cell: ({ row }) => formatDate(row.getValue('updatedAt'))
    },
    {
        id: 'actions',
        enableHiding: false,
        meta: {
            class: {
                td: 'text-right'
            }
        }
    }
]

const getActions = row => {
    return [
        {
            type: 'label',
            label: 'Actions'
        },
        {
            label: 'Download',
            icon: 'i-lucide-hard-drive-download',
            async onSelect() {
                const { event } = await createCommonBlade(
                    backupDownloadBlade,
                    {
                        initVal: row.original
                    }
                )
                if (event === 'cancel') {
                    return
                }
                addSuccessfulToast('Downloaded successfully!')
            }
        },
        {
            label: 'Restore',
            icon: 'i-lucide-archive-restore',
            async onSelect() {
                if (await backupStore.restore(row.original.id)) {
                    addSuccessfulToast('Restored successfully!')
                    await backupStore.refresh()
                }
            }
        },
        {
            label: 'Edit',
            icon: 'i-lucide-edit',
            async onSelect() {
                const { event, data } = await createCommonBlade(BackupBlade, {
                    initVal: { name: row.original.name },
                    props: {
                        mode: 'update'
                    }
                })
                if (event === 'cancel') {
                    return
                }
                if (await backupStore.update(row.original.id, data.name)) {
                    addSuccessfulToast('Updated successfully!')
                }
                await backupStore.refresh()
            }
        },
        {
            label: 'Delete',
            icon: 'i-lucide-trash-2',
            async onSelect() {
                if (await backupStore.deleteItem(row.original.id)) {
                    addSuccessfulToast('Deleted successfully!')
                    await backupStore.refresh()
                }
            }
        }
    ]
}

const startBackup = async () => {
    const { event, data } = await createCommonBlade(BackupBlade, {
        initVal: { name: '' }
    })
    console.log(event, data)
    if (event === 'cancel') {
        return
    }
    if (await backupStore.backupSnapshot(data.name)) {
        addSuccessfulToast('Created successfully!')
        await backupStore.refresh()
    }
}

const uploadFile = async () => {
    let { text, filename } = await new Promise(resolve => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.json,.js,.cjs,.mjs'
        input.onchange = async () => {
            const file = input.files[0]
            const filename = file.name
            const reader = new FileReader()
            reader.onload = async () => {
                const text = reader.result
                input.remove()
                resolve({ text, filename })
            }
            reader.readAsText(file)
        }
        input.click()
    })
    const cjsRegex = /^\s*module\.exports\s*=\s*/
    const esmRegex = /^\s*export\s+default\s+/
    const trimSemiRegex = /\s*;\s*$/
    let type = 'json'
    let obj = null
    try {
        if (cjsRegex.test(text)) {
            type = 'cjs'
            text = text.replace(cjsRegex, '').replace(trimSemiRegex, '')
            obj = JSON5.parse(text)
        } else if (esmRegex.test(text)) {
            type = 'esm'
            text = text.replace(esmRegex, '').replace(trimSemiRegex, '')
            obj = JSON5.parse(text)
        } else {
            type = 'json'
            obj = JSON.parse(text)
            if (obj.type === 'raw') {
                type = 'raw'
            }
        }
    } catch (error) {
        addErrorToast(error.message ?? 'Error parsing file')
        return
    }

    if (await backupStore.upload(filename, type, obj)) {
        addSuccessfulToast('Uploaded successfully!')
        await backupStore.refresh()
    }
}

const refreshSettings = async () => {
    if (await kvStore.refresh()) {
        addSuccessfulToast('Refreshed successfully!')
    }
}

const updateAutomaticBackup = async () => {
    if (
        await kvStore.updateEnableAutoBackup(kvStore.settings.enableAutoBackup)
    ) {
        addSuccessfulToast('Updated successfully!')
    }
}

const table = useTemplateRef('table')
</script>
