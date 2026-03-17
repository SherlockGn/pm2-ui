<template>
    <div class="flex">
        <ProcessSelector
            v-model="selected"
            @refresh="refreshData"></ProcessSelector>
    </div>
    <div class="flex">
        <UFormField>
            <UButton
                color="primary"
                icon="i-lucide-refresh-ccw"
                variant="outline"
                label="Refresh"
                @click="refresh" />
        </UFormField>
        <UFormField class="ml-5">
            <UDropdownMenu :items="sendActions">
                <UButton color="primary" icon="i-lucide-send" variant="outline">
                    Send
                </UButton>
            </UDropdownMenu>
        </UFormField>
    </div>

    <TableCommonAction :use-filter="false" :table="table">
        <UFormField label="Filter type">
            <USelect
                @change="refreshDataDebounce"
                placeholder="Filter type..."
                v-model="typeList"
                multiple
                :items="types"
                class="w-64" />
        </UFormField>
        <UFormField label="Filter name">
            <UInput
                @update:modelValue="refreshDataDebounce"
                v-model="namePattern"
                placeholder="Filter name..."
                class="w-64" />
        </UFormField>
    </TableCommonAction>

    <div class="h-full overflow-y-auto">
        <UTable
            ref="table"
            sticky
            :data="communicationStore.communications"
            :columns="columns">
            <template #triggeredBy-cell="{ row }">
                <ULink
                    v-if="row.original.userId != null"
                    class="underline"
                    to="/user">
                    {{
                        userStore.users.find(u => u.id === row.original.userId)
                            ?.displayName ?? ''
                    }}
                </ULink>
            </template>
            <template #type-cell="{ row }">
                <UKbd>
                    {{ getTypeName(row.original.type) }}
                </UKbd>
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
        :total="communicationStore.count" />

    <!-- <SendSignalBlade /> -->
</template>

<script setup>
import { ref, useTemplateRef, nextTick, watch } from 'vue'
import JSON5 from 'json5'
import { useCommunicationStore } from '../stores/communication.js'
import { useUserStore } from '../stores/user.js'
import { useProcessStore } from '../stores/process.js'
import { addSuccessfulToast, formatDate } from '../utils.js'
import { useDebounceFn } from '@vueuse/core'

import ProcessSelector from '../components/ProcessSelector.vue'
import TableCommonAction from '../components/TableCommonAction.vue'

const selected = ref(null)

const communicationStore = useCommunicationStore()
const userStore = useUserStore()
const processStore = useProcessStore()

const refreshData = async () => {
    await nextTick()
    return await communicationStore.refresh(
        selected.value.pmId,
        typeList.value,
        namePattern.value,
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

const columns = ref([
    {
        accessorKey: 'id',
        header: '#',
        cell: ({ row }) => row.original.id
    },
    {
        accessorKey: 'type',
        header: 'Type'
    },
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => row.original.name
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
        accessorKey: 'updatedAt',
        header: 'Update Time',
        cell: ({ row }) => formatDate(row.original.updatedAt)
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
            label: 'View data',
            icon: 'i-lucide-view',
            async onSelect() {
                communicationStore.activeCommunication = row.original
                communicationStore.viewDataBladeOpen = true
            }
        }
    ]
}

const typeList = ref([])
const namePattern = ref('')

const types = ref([
    {
        label: 'Receive Data',
        value: 'recMsg'
    },
    {
        label: 'Request Data',
        value: 'reqMsg'
    },
    {
        label: 'RPC',
        value: 'rpc'
    },
    {
        label: 'Send Signal',
        value: 'sig'
    }
])

const sendActions = ref([
    {
        label: 'Send Signal',
        icon: 'i-lucide-signal',
        async onSelect() {
            processStore.activeProcess = selected.value
            communicationStore.sendSignalBladeOpen = true
        }
    },
    {
        label: 'RPC',
        icon: 'i-lucide-phone-outgoing',
        async onSelect() {
            processStore.activeProcess = selected.value
            communicationStore.sendRpcBladeOpen = true
        }
    },
    {
        label: 'Send Data',
        icon: 'i-lucide-package',
        async onSelect() {
            processStore.activeProcess = selected.value
            communicationStore.sendDataBladeOpen = true
        }
    }
])

const getTypeName = type => {
    return types.value.find(t => t.value === type)?.label ?? type
}

const table = useTemplateRef('table')

watch([() => communicationStore.sendSignalBladeOpen], async () => {
    if (!communicationStore.sendSignalBladeOpen) {
        await refreshData()
    }
})

watch([() => communicationStore.sendRpcBladeOpen], async () => {
    if (!communicationStore.sendRpcBladeOpen) {
        await refreshData()
    }
})

watch([() => communicationStore.sendDataBladeOpen], async () => {
    if (!communicationStore.sendDataBladeOpen) {
        await refreshData()
    }
})

watch([() => selected.value], async () => {
    if (!communicationStore.sendDataBladeOpen) {
        await refreshData()
    }
})
</script>
