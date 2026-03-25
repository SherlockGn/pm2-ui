<template>
    <div class="flex-1 divide-y divide-accented w-full">
        <TableCommonAction
            filter-prop="name"
            :filter-text="$t('deployment.filterName')"
            :table="table">
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
                    :data="deploymentStore.deployments"
                    :columns="columns">
                    <template #email-header="{ column }">
                        <SortableTableHeader
                            :column="column"
                            :label="$t('common.email')" />
                    </template>
                    <template #name-header="{ column }">
                        <SortableTableHeader
                            :column="column"
                            :label="$t('common.name')" />
                    </template>
                    <template #createdAt-header="{ column }">
                        <SortableTableHeader
                            :column="column"
                            :label="$t('deployment.createTime')" />
                    </template>
                    <template #updatedAt-header="{ column }">
                        <SortableTableHeader
                            :column="column"
                            :label="$t('deployment.updateTime')" />
                    </template>
                    <template #repo-cell="{ row }">
                        <UTooltip :text="row.original.repo">
                            <ULink class="underline">
                                {{ row.original.repo.split('/').pop() }}
                            </ULink>
                        </UTooltip>
                    </template>
                    <template #createdBy-cell="{ row }">
                        <ULink
                            v-if="row.original.userId != null"
                            class="underline"
                            to="/user">
                            {{
                                userStore.users.find(
                                    u => u.id === row.original.userId
                                )?.displayName ?? $t('common.anonymous')
                            }}
                        </ULink>
                        <UBadge
                            v-else
                            class="uppercase"
                            variant="subtle"
                            color="warning">
                            {{ $t('common.unmanaged') }}
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
import { useDeploymentStore } from '../stores/deployment.js'
import {
    formatDate,
    addSuccessfulToast,
    createTerminalResultBlade,
    createCommonBlade
} from '../utils.js'

import SortableTableHeader from '../components/SortableTableHeader.vue'
import TableCommonAction from '../components/TableCommonAction.vue'
import TableFilterResult from '../components/TableFilterResult.vue'
import FullHeight from '../components/FullHeight.vue'
import DeploymentBlade from '../components/Blades/DeploymentBlade.vue'

const userStore = useUserStore()
const deploymentStore = useDeploymentStore()
const { copy } = useClipboard()
const { t } = useI18n()

onMounted(async () => {
    await deploymentStore.refresh()
    await userStore.refresh()
})

const refresh = async () => {
    if (await deploymentStore.refresh()) {
        addSuccessfulToast(t('toast.refreshedSuccessfully'))
    }
}

const columns = [
    {
        accessorKey: 'id',
        header: '#',
        cell: ({ row }) => row.getValue('id')
    },
    {
        accessorKey: 'name'
    },
    {
        accessorKey: 'user',
        header: t('deployment.user')
    },
    {
        accessorKey: 'repo',
        header: t('deployment.repo')
    },
    {
        accessorKey: 'createdBy',
        header: t('deployment.createdBy')
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
            label: t('deployment.copyRawJson'),
            icon: 'i-lucide-copy',
            onSelect() {
                copy(deploymentStore.getJson(row.original))
                addSuccessfulToast(t('toast.copiedSuccessfully'))
            }
        },
        {
            label: t('deployment.deleteItem'),
            icon: 'i-lucide-trash-2',
            async onSelect() {
                if (await deploymentStore.deleteItem(row.original.id)) {
                    addSuccessfulToast(t('toast.deletedSuccessfully'))
                    await deploymentStore.refresh()
                }
            }
        },
        {
            label: t('deployment.editItem'),
            icon: 'i-lucide-edit-2',
            async onSelect() {
                const { event, data } = await createCommonBlade(
                    DeploymentBlade,
                    {
                        initVal: deploymentStore.toViewObject(row.original),
                        props: {
                            mode: 'update'
                        }
                    }
                )
                if (event === 'cancel') {
                    return
                }
                if (
                    await deploymentStore.update(
                        deploymentStore.fromViewObject(data)
                    )
                ) {
                    addSuccessfulToast(t('toast.updatedSuccessfully'))
                    deploymentStore.refresh()
                }
            }
        },
        {
            label: t('deployment.setup'),
            icon: 'i-lucide-cable',
            async onSelect() {
                const id = row.original.id
                createTerminalResultBlade({
                    title: t('deployment.setup'),
                    value: null,
                    autoRun: true,
                    async exec() {
                        return deploymentStore.setup(id)
                    }
                })
            }
        },
        {
            label: t('deployment.deploy'),
            icon: 'i-lucide-bus',
            async onSelect() {
                const id = row.original.id
                createTerminalResultBlade({
                    title: t('deployment.deploy'),
                    value: null,
                    autoRun: true,
                    async exec() {
                        return deploymentStore.deploy(id)
                    }
                })
            }
        },
        {
            label: t('deployment.update'),
            icon: 'i-lucide-calendar-sync',
            async onSelect() {
                const id = row.original.id
                createTerminalResultBlade({
                    title: t('deployment.update'),
                    value: null,
                    autoRun: true,
                    async exec() {
                        return deploymentStore.updateAction(id)
                    }
                })
            }
        },
        {
            label: t('deployment.revert'),
            icon: 'i-lucide-arrow-left',
            async onSelect() {
                const id = row.original.id
                createTerminalResultBlade({
                    title: t('deployment.revert'),
                    value: {
                        type: 'number',
                        label: t('deployment.revertNumber'),
                        attrs: {
                            min: 1
                        }
                    },
                    autoRun: false,
                    async exec(revNum) {
                        return deploymentStore.revert(id, revNum)
                    }
                })
            }
        },
        {
            label: t('deployment.viewCurrent'),
            icon: 'i-lucide-calendar',
            async onSelect() {
                const id = row.original.id
                createTerminalResultBlade({
                    title: t('deployment.viewCurrent'),
                    value: null,
                    autoRun: true,
                    async exec() {
                        return deploymentStore.curr(id)
                    }
                })
            }
        },
        {
            label: t('deployment.viewPrevious'),
            icon: 'i-lucide-calendar-arrow-up',
            async onSelect() {
                const id = row.original.id
                createTerminalResultBlade({
                    title: t('deployment.viewPrevious'),
                    value: null,
                    autoRun: true,
                    async exec() {
                        return deploymentStore.prev(id)
                    }
                })
            }
        },
        {
            label: t('deployment.execute'),
            icon: 'i-lucide-square-function',
            async onSelect() {
                const id = row.original.id
                createTerminalResultBlade({
                    title: t('deployment.execute'),
                    value: {
                        type: 'text',
                        label: t('deployment.command'),
                        attrs: {
                            placeholder: 'pwd'
                        }
                    },
                    autoRun: false,
                    async exec(cmd) {
                        return deploymentStore.exec(id, cmd)
                    }
                })
            }
        },
        {
            label: t('deployment.list'),
            icon: 'i-lucide-list',
            async onSelect() {
                const id = row.original.id
                createTerminalResultBlade({
                    title: t('deployment.list'),
                    value: null,
                    autoRun: true,
                    async exec() {
                        return deploymentStore.list(id)
                    }
                })
            }
        }
    ]
}

const table = useTemplateRef('table')
</script>
