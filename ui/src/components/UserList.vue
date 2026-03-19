<template>
    <div class="flex-1 divide-y divide-accented w-full">
        <TableCommonAction :table="table">
            <UButton
                color="primary"
                icon="i-lucide-refresh-ccw"
                variant="outline"
                label="Refresh"
                @click="refresh" />
        </TableCommonAction>
        <FullHeight>
            <template #body>
                <UTable
                    ref="table"
                    sticky
                    :data="userStore.users"
                    :columns="columns">
                    <template #email-header="{ column }">
                        <SortableTableHeader :column="column" label="Email" />
                    </template>
                    <template #displayName-header="{ column }">
                        <SortableTableHeader
                            :column="column"
                            label="Display Name" />
                    </template>
                    <template #lastLogin-header="{ column }">
                        <SortableTableHeader
                            :column="column"
                            label="Last Log In" />
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
                    <template #email-cell="{ row }">
                        <span>{{ row.original.email }}</span>
                        <span
                            v-if="
                                row.original.id === userStore.currentUser?.id
                            ">
                            <UBadge
                                color="neutral"
                                variant="outline"
                                class="ml-3">
                                Yourself
                            </UBadge>
                        </span>
                    </template>
                    <template #avatar-cell="{ row }">
                        <UAvatar :icon="row.original.avatar" size="md" />
                    </template>
                    <template #enabled-cell="{ row }">
                        <USwitch
                            v-model="row.original.enabled"
                            :disabled="
                                row.original.id === userStore.currentUser?.id
                            "
                            @change="
                                async () =>
                                    await updateEnabled(
                                        row.original.id,
                                        row.original.enabled
                                    )
                            "></USwitch>
                    </template>
                    <template #superUser-cell="{ row }">
                        <USwitch
                            v-model="row.original.superUser"
                            :disabled="
                                row.original.id === userStore.currentUser?.id
                            "
                            @change="
                                async () =>
                                    await updateSuperUser(
                                        row.original.id,
                                        row.original.superUser
                                    )
                            "></USwitch>
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
                    :total="userStore.users.length"></TableFilterResult>
            </template>
        </FullHeight>
    </div>
</template>

<script setup>
import { onMounted, useTemplateRef } from 'vue'
import { useClipboard } from '@vueuse/core'

import { useUserStore } from '../stores/user.js'
import { formatDate, addSuccessfulToast, createCommonBlade } from '../utils.js'

import UserBlade from './Blades/UserBlade.vue'
import SortableTableHeader from './SortableTableHeader.vue'
import TableCommonAction from './TableCommonAction.vue'
import TableFilterResult from './TableFilterResult.vue'
import FullHeight from './FullHeight.vue'

const userStore = useUserStore()
const { copy } = useClipboard()

onMounted(async () => {
    await userStore.refresh()
})

const refresh = async () => {
    if (await userStore.refresh()) {
        addSuccessfulToast('Refreshed successfully!')
    }
}

const updateEnabled = async (id, enabled) => {
    if (await userStore.updateEnabled(id, enabled)) {
        addSuccessfulToast('Updated successfully!')
    }
}

const updateSuperUser = async (id, superUser) => {
    if (await userStore.updateSuperUser(id, superUser)) {
        addSuccessfulToast('Updated successfully!')
    }
}

const columns = [
    {
        accessorKey: 'id',
        header: '#',
        cell: ({ row }) => row.getValue('id')
    },
    {
        accessorKey: 'email'
    },
    {
        accessorKey: 'avatar',
        header: 'Avatar'
    },
    {
        accessorKey: 'displayName',
        cell: ({ row }) => row.getValue('displayName')
    },
    {
        accessorKey: 'enabled',
        header: 'Enabled'
    },
    {
        accessorKey: 'superUser',
        header: 'Super User'
    },
    {
        accessorKey: 'lastLogin',
        cell: ({ row }) => formatDate(row.getValue('lastLogin'))
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
            label: 'Copy raw JSON',
            icon: 'i-lucide-copy',
            onSelect() {
                copy(JSON.stringify(row.original))
                addSuccessfulToast('Copied successfully!')
            }
        },
        {
            label: 'Delete item',
            icon: 'i-lucide-trash-2',
            disabled: row.original.id === userStore.currentUser?.id,
            async onSelect() {
                if (await userStore.deleteItem(row.original.id)) {
                    addSuccessfulToast('Deleted successfully!')
                    await userStore.refresh()
                }
            }
        },
        {
            label: 'Edit item',
            icon: 'i-lucide-edit-2',
            async onSelect() {
                const { event, data } = await createCommonBlade(UserBlade, {
                    initVal: { ...row.original, password: '******' },
                    props: { mode: 'update' }
                })
                if (event === 'cancel') {
                    return
                }
                if (!data.passwordChanged) {
                    delete data.user.password
                }
                if (await userStore.updateUser(data.user)) {
                    addSuccessfulToast('Updated successfully!')
                    await userStore.refresh()
                }
            }
        }
    ]
}

const table = useTemplateRef('table')
</script>
