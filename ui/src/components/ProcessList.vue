<template>
    <div class="flex-1 divide-y divide-accented w-full">
        <TableCommonAction
            :table="table"
            filterProp="name"
            filterText="Filter name...">
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
                    :data="processStore.processes"
                    :columns="columns">
                    <template #id-header="{ column }">
                        <SortableTableHeader :column="column" label="#" />
                    </template>
                    <template #name-header="{ column }">
                        <SortableTableHeader :column="column" label="Name" />
                    </template>
                    <template #script-header="{ column }">
                        <SortableTableHeader :column="column" label="Script" />
                    </template>
                    <template #status-header="{ column }">
                        <SortableTableHeader :column="column" label="Status" />
                    </template>
                    <template #mode-header="{ column }">
                        <SortableTableHeader :column="column" label="Mode" />
                    </template>
                    <template #restartCount-header="{ column }">
                        <SortableTableHeader
                            :column="column"
                            label="Restart Count" />
                    </template>
                    <template #upTime-header="{ column }">
                        <SortableTableHeader
                            :column="column"
                            label="Run Period" />
                    </template>
                    <template #cpu-header="{ column }">
                        <SortableTableHeader :column="column" label="CPU" />
                    </template>
                    <template #memory-header="{ column }">
                        <SortableTableHeader :column="column" label="Memory" />
                    </template>
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
                    <template #name-cell="{ row }">
                        <ULink
                            v-if="getProcessLink(row.original)"
                            class="underline"
                            target="_blank"
                            :to="getProcessLink(row.original)">
                            {{ row.original.name }}
                        </ULink>
                        <span v-else>{{ row.original.name }}</span>
                    </template>
                    <template #status-cell="{ row }">
                        <UBadge
                            class="uppercase"
                            variant="subtle"
                            :color="getStatusColor(row.original.status)">
                            {{ row.original.status }}
                        </UBadge>
                    </template>
                    <template #mode-cell="{ row }">
                        <UKbd v-if="row.original.exeMode">
                            {{ row.original.exeMode.replace('_mode', '') }}
                        </UKbd>
                        <template v-else>N/A</template>
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
                    <template #script-cell="{ row }">
                        <UTooltip :text="row.original.script">
                            <ULink class="underline">
                                {{
                                    processStore.getFileName(
                                        row.original.script
                                    )
                                }}
                            </ULink>
                        </UTooltip>
                    </template>
                    <template #upTime-cell="{ row }">
                        <UTooltip :text="formatDate(row.original.upTime)">
                            <ULink class="underline">
                                {{
                                    row.original.status?.toLowerCase() ===
                                    'online'
                                        ? toFriendlyPeriod(
                                              new Date() - row.original.upTime
                                          )
                                        : 'N/A'
                                }}
                            </ULink>
                        </UTooltip>
                    </template>
                    <template #restartCount-cell="{ row }">
                        <span>{{ row.original.restartCount }}</span>
                        <span
                            v-if="
                                row.original.status.toLowerCase() ===
                                    'online' &&
                                row.original.app?.updatedAt &&
                                row.original.upTime <
                                    new Date(
                                        row.original.app?.updatedAt
                                    ).getTime()
                            ">
                            <UBadge
                                color="neutral"
                                variant="outline"
                                class="ml-3">
                                Restart required
                            </UBadge>
                        </span>
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
                    :total="processStore.processes.length"></TableFilterResult>
            </template>
        </FullHeight>
    </div>
</template>

<script setup>
import { onMounted, useTemplateRef } from 'vue'
import { useClipboard } from '@vueuse/core'

import { useProcessStore } from '../stores/process.js'
import { useUserStore } from '../stores/user.js'
import { useAppStore } from '../stores/app.js'
import {
    formatDate,
    toFriendlyPeriod,
    addSuccessfulToast,
    toFriendlyMemory,
    getStatusColor
} from '../utils.js'

import SortableTableHeader from './SortableTableHeader.vue'
import TableCommonAction from './TableCommonAction.vue'
import TableFilterResult from './TableFilterResult.vue'
import FullHeight from './FullHeight.vue'

const userStore = useUserStore()
const appStore = useAppStore()
const processStore = useProcessStore()
const { copy } = useClipboard()

onMounted(async () => {
    await processStore.refresh()
    await userStore.refresh()
})

const refresh = async () => {
    if (await processStore.refresh()) {
        addSuccessfulToast('Refreshed successfully!')
    }
}

const columns = [
    {
        accessorKey: 'id',
        cell: ({ row }) => row.original.pmId
    },
    {
        accessorKey: 'name'
    },
    {
        accessorKey: 'script',
        cell: ({ row }) => row.original.script
    },

    {
        accessorKey: 'status',
        cell: ({ row }) => row.original.status
    },
    {
        accessorKey: 'mode'
    },
    {
        accessorKey: 'restartCount',
        cell: ({ row }) => row.original.restartCount
    },
    {
        accessorKey: 'upTime',
        cell: ({ row }) => row.original.upTime
    },
    {
        accessorKey: 'cpu',
        cell: ({ row }) => row.original.cpu + '%'
    },
    {
        accessorKey: 'memory',
        cell: ({ row }) => toFriendlyMemory(row.original.memory)
    },
    {
        accessorKey: 'createdBy'
    },
    {
        accessorKey: 'createdAt',
        cell: ({ row }) => formatDate(row.original.createdAt)
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
            label: 'Start',
            icon: 'i-lucide-play',
            async onSelect() {
                if (
                    await processStore.start(
                        row.original.pmId,
                        row.original.app
                    )
                ) {
                    addSuccessfulToast('Started successfully!')
                    processStore.refresh()
                }
            },
            enabled: row.original.status?.toLowerCase() !== 'online'
        },
        {
            label: 'Restart',
            icon: 'i-lucide-list-restart',
            async onSelect() {
                if (
                    await processStore.restart(
                        row.original.pmId,
                        row.original.app
                    )
                ) {
                    addSuccessfulToast('Restarted successfully!')
                    processStore.refresh()
                }
            },
            enabled: row.original.status?.toLowerCase() === 'online'
        },
        {
            label: 'Reload',
            icon: 'i-lucide-refresh-ccw-dot',
            async onSelect() {
                if (await processStore.reload(row.original.pmId)) {
                    addSuccessfulToast('Reloaded successfully!')
                    processStore.refresh()
                }
            },
            enabled: row.original.status?.toLowerCase() === 'online'
        },
        {
            label: 'Stop',
            icon: 'i-lucide-square-stop',
            async onSelect() {
                if (await processStore.stop(row.original.pmId)) {
                    addSuccessfulToast('Stopped successfully!')
                    processStore.refresh()
                }
            },
            enabled: row.original.status?.toLowerCase() === 'online'
        },
        {
            label: 'Delete',
            icon: 'i-lucide-trash-2',
            async onSelect() {
                if (await processStore.deleteItem(row.original.pmId)) {
                    addSuccessfulToast('Deleted successfully!')
                    await processStore.refresh()
                }
            }
        },
        {
            label: 'Edit configurations',
            icon: 'i-lucide-edit',
            async onSelect() {
                appStore.setAppForUpdate(row.original.app)
                appStore.appBladeOpen = true
                processStore.activeProcess = row.original
            },
            enabled: row.original.app != null
        },
        {
            label: 'Manage configuration',
            icon: 'i-lucide-tower-control',
            async onSelect() {
                const app = appStore.getAppFromProcess(row.original)
                if (await processStore.manage(row.original.pmId, app)) {
                    addSuccessfulToast('Managed successfully!')
                    processStore.refresh()
                }
            },
            enabled: row.original.app == null
        },
        {
            label: 'View description',
            icon: 'i-lucide-file-text',
            async onSelect() {
                processStore.activeProcess = row.original
                processStore.descriptionBladeOpen = true
            },
            enabled: row.original.pmId >= 0
        },
        {
            label: 'Copy configuration as JSON',
            icon: 'i-lucide-copy',
            async onSelect() {
                appStore.setAppForUpdate(row.original.app)
                copy(appStore.getCurrentAppJson())
                addSuccessfulToast('Copied successfully!')
            },
            enabled: row.original.app != null
        },
        {
            label: 'Duplicate configuration',
            icon: 'i-lucide-trending-up-down',
            async onSelect() {
                if (await processStore.create(row.original.app, false)) {
                    addSuccessfulToast('Duplicated successfully!')
                    await processStore.refresh()
                }
            },
            enabled: row.original.app != null
        }
    ].filter(a => (a.enabled ?? true) === true)
}

const getProcessLink = process => {
    let port = null
    if (
        process.script.toLowerCase() === 'serve' ||
        process.script.toLowerCase().endsWith('/serve.js') ||
        process.script.toLowerCase().endsWith('\\serve.js')
    ) {
        port =
            process.env.custom.find(i => i.key === 'PM2_SERVE_PORT')?.value ??
            '8080'
        port = +port
    }

    const portEnv = process.env.custom.find(i => i.key === 'PORT')
    if (port === null && portEnv) {
        port = +portEnv.value
    }

    if (!port) {
        return null
    }

    const { hostname, protocol } = new URL(window.location.href)
    const u = new URL(protocol + '//' + hostname)
    u.port = port
    return u.toString()
}

const table = useTemplateRef('table')
</script>
