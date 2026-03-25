<template>
    <div class="flex-1 divide-y divide-accented w-full">
        <TableCommonAction :table="table">
            <UButton
                color="primary"
                icon="i-lucide-refresh-ccw"
                variant="outline"
                :label="$t('common.refresh')"
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
                        <SortableTableHeader
                            :column="column"
                            :label="$t('user.email')" />
                    </template>
                    <template #displayName-header="{ column }">
                        <SortableTableHeader
                            :column="column"
                            :label="$t('user.displayName')" />
                    </template>
                    <template #lastLogin-header="{ column }">
                        <SortableTableHeader
                            :column="column"
                            :label="$t('user.lastLogIn')" />
                    </template>
                    <template #createdAt-header="{ column }">
                        <SortableTableHeader
                            :column="column"
                            :label="$t('user.createTime')" />
                    </template>
                    <template #updatedAt-header="{ column }">
                        <SortableTableHeader
                            :column="column"
                            :label="$t('user.updateTime')" />
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
                                {{ $t('user.yourself') }}
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
import { useI18n } from 'vue-i18n'
import { useClipboard } from '@vueuse/core'

import { useUserStore } from '../stores/user.js'
import { formatDate, addSuccessfulToast, createCommonBlade } from '../utils.js'

import UserBlade from './Blades/UserBlade.vue'
import SortableTableHeader from './SortableTableHeader.vue'
import TableCommonAction from './TableCommonAction.vue'
import TableFilterResult from './TableFilterResult.vue'
import FullHeight from './FullHeight.vue'

const { t } = useI18n()
const userStore = useUserStore()
const { copy } = useClipboard()

onMounted(async () => {
    await userStore.refresh()
})

const refresh = async () => {
    if (await userStore.refresh()) {
        addSuccessfulToast(t('toast.refreshedSuccessfully'))
    }
}

const updateEnabled = async (id, enabled) => {
    if (await userStore.updateEnabled(id, enabled)) {
        addSuccessfulToast(t('toast.updatedSuccessfully'))
    }
}

const updateSuperUser = async (id, superUser) => {
    if (await userStore.updateSuperUser(id, superUser)) {
        addSuccessfulToast(t('toast.updatedSuccessfully'))
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
        header: t('user.avatar')
    },
    {
        accessorKey: 'displayName',
        cell: ({ row }) => row.getValue('displayName')
    },
    {
        accessorKey: 'enabled',
        header: t('user.enabled')
    },
    {
        accessorKey: 'superUser',
        header: t('user.superUser')
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
            label: t('common.actions')
        },
        {
            label: t('user.copyRawJson'),
            icon: 'i-lucide-copy',
            onSelect() {
                copy(JSON.stringify(row.original))
                addSuccessfulToast(t('toast.copiedSuccessfully'))
            }
        },
        {
            label: t('user.deleteItem'),
            icon: 'i-lucide-trash-2',
            disabled: row.original.id === userStore.currentUser?.id,
            async onSelect() {
                if (await userStore.deleteItem(row.original.id)) {
                    addSuccessfulToast(t('toast.deletedSuccessfully'))
                    await userStore.refresh()
                }
            }
        },
        {
            label: t('user.editItem'),
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
                    addSuccessfulToast(t('toast.updatedSuccessfully'))
                    await userStore.refresh()
                }
            }
        }
    ]
}

const table = useTemplateRef('table')
</script>
