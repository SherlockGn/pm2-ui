<template>
    <div class="flex">
        <UFormField>
            <UButton
                color="primary"
                icon="i-lucide-refresh-ccw"
                variant="outline"
                :label="$t('common.refresh')"
                @click="refresh" />
        </UFormField>
    </div>

    <TableCommonAction :use-filter="false" :table="table">
        <UFormField :label="$t('adminLog.filterAction')">
            <USelect
                @change="refreshDataDebounce"
                :placeholder="$t('adminLog.filterActions')"
                v-model="actionList"
                multiple
                :items="actions"
                class="w-64" />
        </UFormField>
        <UFormField :label="$t('adminLog.filterCategory')">
            <USelect
                @change="refreshDataDebounce"
                :placeholder="$t('adminLog.filterCategories')"
                v-model="categoryList"
                multiple
                :items="categories"
                class="w-64" />
        </UFormField>
        <UFormField :label="$t('adminLog.filterStatus')">
            <USelect
                @change="refreshDataDebounce"
                :placeholder="$t('adminLog.filterStatuses')"
                v-model="statusList"
                multiple
                :items="statuses"
                class="w-64" />
        </UFormField>
        <UFormField :label="$t('adminLog.filterResourceName')">
            <UInput
                @update:modelValue="refreshDataDebounce"
                v-model="resourceNamePattern"
                :placeholder="$t('adminLog.filterResourceNamePlaceholder')"
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
                    {{ $t('adminLog.successful') }}
                </UBadge>
                <UBadge v-else class="uppercase" variant="subtle" color="error">
                    {{ $t('adminLog.failed') }}
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
import { useI18n } from 'vue-i18n'
import { useAdminLogStore } from '../stores/adminLog.js'
import {
    addSuccessfulToast,
    formatDate,
    createTerminalResultBlade
} from '../utils.js'
import { useDebounceFn } from '@vueuse/core'

import TableCommonAction from '../components/TableCommonAction.vue'

const { t } = useI18n()

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
        addSuccessfulToast(t('toast.refreshedSuccessfully'))
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
        header: t('adminLog.action'),
        cell: ({ row }) => getLabel(row.original.action, actions.value)
    },
    {
        accessorKey: 'category',
        header: t('adminLog.category'),
        cell: ({ row }) => getLabel(row.original.category, categories.value)
    },
    {
        accessorKey: 'status',
        header: t('adminLog.status')
    },
    {
        accessorKey: 'resource name',
        header: t('adminLog.resourceName'),
        cell: ({ row }) => row.original.resourceName
    },
    {
        accessorKey: 'triggeredBy',
        header: t('adminLog.triggeredBy')
    },
    {
        accessorKey: 'createdAt',
        header: t('adminLog.createTime'),
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
            label: t('common.actions')
        },
        {
            label: t('adminLog.viewResourceData'),
            icon: 'i-lucide-view',
            async onSelect() {
                createTerminalResultBlade({
                    title: t('adminLog.resourceData'),
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
        'label': t('adminLog.actions.callRpc')
    },
    {
        'label': t('adminLog.actions.create'),
        'value': 'create'
    },
    {
        'value': 'createAndStart',
        'label': t('adminLog.actions.createAndStart')
    },
    {
        'label': t('adminLog.actions.delete'),
        'value': 'delete'
    },
    {
        'value': 'deploy',
        'label': t('adminLog.actions.deploy')
    },
    {
        'value': 'exec',
        'label': t('adminLog.actions.execute')
    },
    {
        'label': t('adminLog.actions.flushLog'),
        'value': 'flushLog'
    },
    {
        'label': t('adminLog.actions.kill'),
        'value': 'kill'
    },
    {
        'label': t('adminLog.actions.logIn'),
        'value': 'login'
    },
    {
        'value': 'manage',
        'label': t('adminLog.actions.manage')
    },
    {
        'label': t('adminLog.actions.ping'),
        'value': 'ping'
    },
    {
        'value': 'reload',
        'label': t('adminLog.actions.reload')
    },
    {
        'label': t('adminLog.actions.regenerateKey'),
        'value': 'regenerateKey'
    },
    {
        'label': t('adminLog.actions.resetCounter'),
        'value': 'resetCounter'
    },
    {
        'value': 'restart',
        'label': t('adminLog.actions.restart')
    },
    {
        'label': t('adminLog.actions.restore'),
        'value': 'restore'
    },
    {
        'label': t('adminLog.actions.resurrect'),
        'value': 'resurrect'
    },
    {
        'value': 'revert',
        'label': t('adminLog.actions.revert')
    },
    {
        'label': t('adminLog.actions.save'),
        'value': 'save'
    },
    {
        'value': 'sendData',
        'label': t('adminLog.actions.sendData')
    },
    {
        'value': 'sendSignal',
        'label': t('adminLog.actions.sendSignal')
    },
    {
        'value': 'setup',
        'label': t('adminLog.actions.setup')
    },
    {
        'value': 'start',
        'label': t('adminLog.actions.start')
    },
    {
        'value': 'stop',
        'label': t('adminLog.actions.stop')
    },
    {
        'label': t('adminLog.actions.update'),
        'value': 'update'
    },
    {
        'label': t('adminLog.actions.updatePm2'),
        'value': 'updatePm2'
    },
    {
        'value': 'upgrade',
        'label': t('adminLog.actions.upgrade')
    },
    {
        'label': t('adminLog.actions.upload'),
        'value': 'upload'
    }
])

const categories = ref([
    {
        'value': 'user',
        'label': t('adminLog.categories.user')
    },
    {
        'label': t('adminLog.categories.process'),
        'value': 'process'
    },
    {
        'label': t('adminLog.categories.setting'),
        'value': 'setting'
    },
    {
        'label': t('adminLog.categories.communication'),
        'value': 'communication'
    },
    {
        'label': t('adminLog.categories.cleanup'),
        'value': 'cleanup'
    },
    {
        'label': t('adminLog.categories.deployment'),
        'value': 'deployment'
    },
    {
        'label': t('adminLog.categories.action'),
        'value': 'action'
    },
    {
        'label': t('adminLog.categories.backup'),
        'value': 'backup'
    },
    {
        'label': t('adminLog.categories.globalSetting'),
        'value': 'kv'
    }
])

const statuses = ref([
    {
        'value': 'success',
        'label': t('adminLog.successful')
    },
    {
        'label': t('adminLog.failed'),
        'value': 'failed'
    }
])

const table = useTemplateRef('table')
</script>
