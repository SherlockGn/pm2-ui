<template>
    <div class="flex-1 divide-y divide-accented w-full">
        <TableCommonAction
            :table="table"
            filterProp="name"
            :filterText="$t('processList.filterName')">
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
                    :data="processStore.processes"
                    :columns="columns">
                    <template #id-header="{ column }">
                        <SortableTableHeader :column="column" label="#" />
                    </template>
                    <template #name-header="{ column }">
                        <SortableTableHeader
                            :column="column"
                            :label="$t('processList.name')" />
                    </template>
                    <template #script-header="{ column }">
                        <SortableTableHeader
                            :column="column"
                            :label="$t('processList.script')" />
                    </template>
                    <template #status-header="{ column }">
                        <SortableTableHeader
                            :column="column"
                            :label="$t('processList.status')" />
                    </template>
                    <template #mode-header="{ column }">
                        <SortableTableHeader
                            :column="column"
                            :label="$t('processList.mode')" />
                    </template>
                    <template #restartCount-header="{ column }">
                        <SortableTableHeader
                            :column="column"
                            :label="$t('processList.restartCount')" />
                    </template>
                    <template #upTime-header="{ column }">
                        <SortableTableHeader
                            :column="column"
                            :label="$t('processList.runPeriod')" />
                    </template>
                    <template #cpu-header="{ column }">
                        <SortableTableHeader
                            :column="column"
                            :label="$t('processList.cpu')" />
                    </template>
                    <template #memory-header="{ column }">
                        <SortableTableHeader
                            :column="column"
                            :label="$t('processList.memory')" />
                    </template>
                    <template #createdBy-header="{ column }">
                        <SortableTableHeader
                            :column="column"
                            :label="$t('processList.createdBy')" />
                    </template>
                    <template #createdAt-header="{ column }">
                        <SortableTableHeader
                            :column="column"
                            :label="$t('processList.createTime')" />
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
                        <template v-else>{{ $t('common.na') }}</template>
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
                                        : $t('common.na')
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
                                {{ $t('processList.restartRequired') }}
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
import { useI18n } from 'vue-i18n'
import { useClipboard } from '@vueuse/core'

import { useProcessStore } from '../stores/process.js'
import { useUserStore } from '../stores/user.js'
import { useAppStore } from '../stores/app.js'
import {
    formatDate,
    toFriendlyPeriod,
    addSuccessfulToast,
    toFriendlyMemory,
    getStatusColor,
    createCommonBlade
} from '../utils.js'

import SortableTableHeader from './SortableTableHeader.vue'
import TableCommonAction from './TableCommonAction.vue'
import TableFilterResult from './TableFilterResult.vue'
import FullHeight from './FullHeight.vue'
import AppBlade from './Blades/AppBlade.vue'
import DescriptionBlade from './Blades/DescriptionBlade.vue'

const userStore = useUserStore()
const appStore = useAppStore()
const processStore = useProcessStore()
const { copy } = useClipboard()
const { t } = useI18n()

onMounted(async () => {
    await processStore.refresh()
    await userStore.refresh()
})

const refresh = async () => {
    if (await processStore.refresh()) {
        addSuccessfulToast(t('toast.refreshedSuccessfully'))
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
            label: t('common.actions')
        },
        {
            label: t('processList.start'),
            icon: 'i-lucide-play',
            async onSelect() {
                if (
                    await processStore.start(
                        row.original.pmId,
                        row.original.app
                    )
                ) {
                    addSuccessfulToast(t('toast.startedSuccessfully'))
                    processStore.refresh()
                }
            },
            enabled: row.original.status?.toLowerCase() !== 'online'
        },
        {
            label: t('processList.restart'),
            icon: 'i-lucide-list-restart',
            async onSelect() {
                if (
                    await processStore.restart(
                        row.original.pmId,
                        row.original.app
                    )
                ) {
                    addSuccessfulToast(t('toast.restartedSuccessfully'))
                    processStore.refresh()
                }
            },
            enabled: row.original.status?.toLowerCase() === 'online'
        },
        {
            label: t('processList.reload'),
            icon: 'i-lucide-refresh-ccw-dot',
            async onSelect() {
                if (await processStore.reload(row.original.pmId)) {
                    addSuccessfulToast(t('toast.reloadedSuccessfully'))
                    processStore.refresh()
                }
            },
            enabled: row.original.status?.toLowerCase() === 'online'
        },
        {
            label: t('processList.stop'),
            icon: 'i-lucide-square-stop',
            async onSelect() {
                if (await processStore.stop(row.original.pmId)) {
                    addSuccessfulToast(t('toast.stoppedSuccessfully'))
                    processStore.refresh()
                }
            },
            enabled: row.original.status?.toLowerCase() === 'online'
        },
        {
            label: t('processList.delete'),
            icon: 'i-lucide-trash-2',
            async onSelect() {
                if (await processStore.deleteItem(row.original.pmId)) {
                    addSuccessfulToast(t('toast.deletedSuccessfully'))
                    await processStore.refresh()
                }
            }
        },
        {
            label: t('processList.editConfigurations'),
            icon: 'i-lucide-edit',
            async onSelect() {
                const { event, data } = await createCommonBlade(AppBlade, {
                    initVal: appStore.toUIObjectApp(row.original.app),
                    props: {
                        mode: 'update'
                    }
                })
                if (event === 'cancel') {
                    return
                }
                if (
                    await processStore.update(
                        row.original.pmId,
                        appStore.fromUIObjectApp(data)
                    )
                ) {
                    addSuccessfulToast(t('toast.updatedSuccessfully'))
                    processStore.refresh()
                }
            },
            enabled: row.original.app != null
        },
        {
            label: t('processList.manageConfiguration'),
            icon: 'i-lucide-tower-control',
            async onSelect() {
                const app = appStore.getAppFromProcess(row.original)
                if (await processStore.manage(row.original.pmId, app)) {
                    addSuccessfulToast(t('toast.managedSuccessfully'))
                    processStore.refresh()
                }
            },
            enabled: row.original.app == null
        },
        {
            label: t('processList.viewDescription'),
            icon: 'i-lucide-file-text',
            async onSelect() {
                await createCommonBlade(DescriptionBlade, {
                    initVal: row.original,
                    subscribedEvents: ['cancel']
                })
            },
            enabled: row.original.pmId >= 0
        },
        {
            label: t('processList.copyConfigurationAsJson'),
            icon: 'i-lucide-copy',
            async onSelect() {
                copy(appStore.toJsonObjectApp(row.original.app))
                addSuccessfulToast(t('toast.copiedSuccessfully'))
            },
            enabled: row.original.app != null
        },
        {
            label: t('processList.duplicateConfiguration'),
            icon: 'i-lucide-trending-up-down',
            async onSelect() {
                if (await processStore.create(row.original.app, false)) {
                    addSuccessfulToast(t('toast.duplicatedSuccessfully'))
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
