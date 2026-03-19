<template>
    <div class="flex-1 divide-y divide-accented w-full">
        <TableCommonAction
            filter-prop="name"
            filter-text="Filter name..."
            :table="table">
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
                    :data="deploymentStore.deployments"
                    :columns="columns">
                    <template #email-header="{ column }">
                        <SortableTableHeader :column="column" label="Email" />
                    </template>
                    <template #name-header="{ column }">
                        <SortableTableHeader :column="column" label="Name" />
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
                                )?.displayName ?? 'Anonymous'
                            }}
                        </ULink>
                        <UBadge
                            v-else
                            class="uppercase"
                            variant="subtle"
                            color="warning">
                            Unmanaged
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

onMounted(async () => {
    await deploymentStore.refresh()
    await userStore.refresh()
})

const refresh = async () => {
    if (await deploymentStore.refresh()) {
        addSuccessfulToast('Refreshed successfully!')
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
        header: 'User'
    },
    {
        accessorKey: 'repo',
        header: 'Repo'
    },
    {
        accessorKey: 'createdBy',
        header: 'Created By'
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
                copy(deploymentStore.getJson(row.original))
                addSuccessfulToast('Copied successfully!')
            }
        },
        {
            label: 'Delete item',
            icon: 'i-lucide-trash-2',
            async onSelect() {
                if (await deploymentStore.deleteItem(row.original.id)) {
                    addSuccessfulToast('Deleted successfully!')
                    await deploymentStore.refresh()
                }
            }
        },
        {
            label: 'Edit item',
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
                    addSuccessfulToast('Updated successfully')
                    deploymentStore.refresh()
                }
            }
        },
        {
            label: 'Setup',
            icon: 'i-lucide-cable',
            async onSelect() {
                const id = row.original.id
                createTerminalResultBlade({
                    title: 'Setup',
                    value: null,
                    autoRun: true,
                    async exec() {
                        return deploymentStore.setup(id)
                    }
                })
            }
        },
        {
            label: 'Deploy',
            icon: 'i-lucide-bus',
            async onSelect() {
                const id = row.original.id
                createTerminalResultBlade({
                    title: 'Deploy',
                    value: null,
                    autoRun: true,
                    async exec() {
                        return deploymentStore.deploy(id)
                    }
                })
            }
        },
        {
            label: 'Update',
            icon: 'i-lucide-calendar-sync',
            async onSelect() {
                const id = row.original.id
                createTerminalResultBlade({
                    title: 'Update',
                    value: null,
                    autoRun: true,
                    async exec() {
                        return deploymentStore.updateAction(id)
                    }
                })
            }
        },
        {
            label: 'Revert',
            icon: 'i-lucide-arrow-left',
            async onSelect() {
                const id = row.original.id
                createTerminalResultBlade({
                    title: 'Revert',
                    value: {
                        type: 'number',
                        label: 'Revert number',
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
            label: 'View Current',
            icon: 'i-lucide-calendar',
            async onSelect() {
                const id = row.original.id
                createTerminalResultBlade({
                    title: 'View Current',
                    value: null,
                    autoRun: true,
                    async exec() {
                        return deploymentStore.curr(id)
                    }
                })
            }
        },
        {
            label: 'View Previous',
            icon: 'i-lucide-calendar-arrow-up',
            async onSelect() {
                const id = row.original.id
                createTerminalResultBlade({
                    title: 'View Previous',
                    value: null,
                    autoRun: true,
                    async exec() {
                        return deploymentStore.prev(id)
                    }
                })
            }
        },
        {
            label: 'Execute',
            icon: 'i-lucide-square-function',
            async onSelect() {
                const id = row.original.id
                createTerminalResultBlade({
                    title: 'Execute',
                    value: {
                        type: 'text',
                        label: 'Command',
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
            label: 'List',
            icon: 'i-lucide-list',
            async onSelect() {
                const id = row.original.id
                createTerminalResultBlade({
                    title: 'List',
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
