<template>
    <div class="flex">
        <UFormField>
            <UButton
                color="primary"
                icon="i-lucide-refresh-ccw"
                variant="outline"
                label="Refresh"
                @click="refresh" />
        </UFormField>
    </div>

    <TableCommonAction :use-filter="false" :table="table">
        <UFormField label="Filter action">
            <USelect
                @change="refreshDataDebounce"
                placeholder="Filter actions..."
                v-model="actionList"
                multiple
                :items="actions"
                class="w-64" />
        </UFormField>
        <UFormField label="Filter category">
            <USelect
                @change="refreshDataDebounce"
                placeholder="Filter categories..."
                v-model="categoryList"
                multiple
                :items="categories"
                class="w-64" />
        </UFormField>
        <UFormField label="Filter status">
            <USelect
                @change="refreshDataDebounce"
                placeholder="Filter statuses..."
                v-model="statusList"
                multiple
                :items="statuses"
                class="w-64" />
        </UFormField>
        <UFormField label="Filter resource name">
            <UInput
                @update:modelValue="refreshDataDebounce"
                v-model="resourceNamePattern"
                placeholder="Filter resource name..."
                class="w-64" />
        </UFormField>
    </TableCommonAction>

    <div class="h-full overflow-y-auto">
        <UTable
            ref="table"
            sticky
            :data="adminLogStore.adminLogs"
            :columns="columns">
            <template #triggeredBy-cell="{ row }">
                <ULink class="underline" to="/user">
                    {{ row.original.userDisplayName ?? '' }}
                </ULink>
            </template>
            <template #status-cell="{ row }">
                <UBadge
                    v-if="row.original.successful"
                    class="uppercase"
                    variant="subtle"
                    color="success">
                    Successful
                </UBadge>
                <UBadge v-else class="uppercase" variant="subtle" color="error">
                    Failed
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
    </div>
    <UPagination
        class="mt-3"
        @update:page="refreshData"
        v-model:page="currentPage"
        :total="adminLogStore.count" />
</template>

<script setup>
import { ref, useTemplateRef, nextTick, computed, onMounted } from 'vue'
import { useAdminLogStore } from '../stores/adminLog.js'
import {
    addSuccessfulToast,
    formatDate,
    createTerminalResultBlade
} from '../utils.js'
import { useDebounceFn } from '@vueuse/core'

import TableCommonAction from '../components/TableCommonAction.vue'

onMounted(async () => {
    await refresh()
})

const adminLogStore = useAdminLogStore()

const refreshData = async () => {
    await nextTick()
    return await adminLogStore.refresh(
        actionList.value,
        categoryList.value,
        statusFilter.value,
        resourceNamePattern.value,
        (currentPage.value - 1) * 10,
        10
    )
}

const refreshDataDebounce = useDebounceFn(refreshData, 300)

const refresh = async () => {
    if (await refreshData()) {
        addSuccessfulToast('Refreshed successfully!')
    }
}

const getLabel = (value, items) => {
    const item = items.find(i => i.value === value)
    return item ? item.label : value
}

const columns = ref([
    {
        accessorKey: 'id',
        header: '#',
        cell: ({ row }) => row.original.id
    },
    {
        accessorKey: 'action',
        header: 'Action',
        cell: ({ row }) => getLabel(row.original.action, actions.value)
    },
    {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => getLabel(row.original.category, categories.value)
    },
    {
        accessorKey: 'status',
        header: 'Status'
    },
    {
        accessorKey: 'resource name',
        header: 'Resource Name',
        cell: ({ row }) => row.original.resourceName
    },
    {
        accessorKey: 'triggeredBy',
        header: 'Triggered By'
    },
    {
        accessorKey: 'createdAt',
        header: 'Create Time',
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
])

const currentPage = ref(1)

const getActions = row => {
    return [
        {
            type: 'label',
            label: 'Actions'
        },
        {
            label: 'View resource data',
            icon: 'i-lucide-view',
            async onSelect() {
                createTerminalResultBlade({
                    title: 'Resource data',
                    autoRun: true,
                    exec: async () => {
                        return {
                            code: 0,
                            timeout: false,
                            ret: [
                                {
                                    type: 'data',
                                    data: row.original.resourceData
                                        ? JSON.stringify(
                                              row.original.resourceData,
                                              null,
                                              4
                                          ) + '\n'
                                        : null
                                },
                                {
                                    type: 'error',
                                    data: row.original.errorMsg
                                }
                            ].filter(i => i)
                        }
                    }
                })
            }
        }
    ]
}

const actionList = ref([])
const categoryList = ref([])
const statusList = ref([])
const resourceNamePattern = ref('')

const statusFilter = computed(() => {
    if (statusList.value.length === 0 || statusList.value.length === 2) {
        return null
    }
    return statusList.value[0] === 'success' ? true : false
})

const actions = ref([
    {
        'value': 'rpc',
        'label': 'Call RPC'
    },
    {
        'label': 'Create',
        'value': 'create'
    },
    {
        'value': 'createAndStart',
        'label': 'Create and Start'
    },
    {
        'label': 'Delete',
        'value': 'delete'
    },
    {
        'value': 'deploy',
        'label': 'Deploy'
    },
    {
        'value': 'exec',
        'label': 'Execute'
    },
    {
        'label': 'Flush Log',
        'value': 'flushLog'
    },
    {
        'label': 'Kill',
        'value': 'kill'
    },
    {
        'label': 'Log In',
        'value': 'login'
    },
    {
        'value': 'manage',
        'label': 'Manage'
    },
    {
        'label': 'Ping',
        'value': 'ping'
    },
    {
        'value': 'reload',
        'label': 'Reload'
    },
    {
        'label': 'Regenerate Key',
        'value': 'regenerateKey'
    },
    {
        'label': 'Reset Counter',
        'value': 'resetCounter'
    },
    {
        'value': 'restart',
        'label': 'Restart'
    },
    {
        'label': 'Restore',
        'value': 'restore'
    },
    {
        'label': 'Resurrect',
        'value': 'resurrect'
    },
    {
        'value': 'revert',
        'label': 'Revert'
    },
    {
        'label': 'Save',
        'value': 'save'
    },
    {
        'value': 'sendData',
        'label': 'Send Data'
    },
    {
        'value': 'sendSignal',
        'label': 'Send Signal'
    },
    {
        'value': 'setup',
        'label': 'Setup'
    },
    {
        'value': 'start',
        'label': 'Start'
    },
    {
        'value': 'stop',
        'label': 'Stop'
    },
    {
        'label': 'Update',
        'value': 'update'
    },
    {
        'label': 'Update PM2',
        'value': 'updatePm2'
    },
    {
        'value': 'upgrade',
        'label': 'Upgrade'
    },
    {
        'label': 'Upload',
        'value': 'upload'
    }
])

const categories = ref([
    {
        'value': 'user',
        'label': 'User'
    },
    {
        'label': 'Process',
        'value': 'process'
    },
    {
        'label': 'Setting',
        'value': 'setting'
    },
    {
        'label': 'Communication',
        'value': 'communication'
    },
    {
        'label': 'Cleanup',
        'value': 'cleanup'
    },
    {
        'label': 'Deployment',
        'value': 'deployment'
    },
    {
        'label': 'Action',
        'value': 'action'
    },
    {
        'label': 'Backup',
        'value': 'backup'
    },
    {
        'label': 'Global Setting',
        'value': 'kv'
    }
])

const statuses = ref([
    {
        'value': 'success',
        'label': 'Successful'
    },
    {
        'label': 'Failed',
        'value': 'failed'
    }
])

const table = useTemplateRef('table')
</script>
