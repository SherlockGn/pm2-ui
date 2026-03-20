<template>
    <UDashboardGroup>
        <UDashboardSidebar
            collapsible
            resizable
            :ui="{ footer: 'border-t border-default' }">
            <template #header="{ collapsed }">
                <UButton
                    v-bind="{
                        avatar: {
                            src: 'app.svg'
                        },
                        label: collapsed ? undefined : 'PM2 UI'
                    }"
                    color="neutral"
                    variant="ghost"
                    block
                    :square="collapsed"
                    class="data-[state=open]:bg-elevated"
                    :class="[!collapsed && 'py-2']"
                    :ui="{
                        trailingIcon: 'text-dimmed'
                    }" />
            </template>

            <template #default="{ collapsed }">
                <UDashboardSearchButton :collapsed="collapsed" />

                <UNavigationMenu
                    :collapsed="collapsed"
                    :items="navigators"
                    orientation="vertical" />
            </template>

            <template #footer="{ collapsed }">
                <UserMenu :collapsed="collapsed" />
            </template>
        </UDashboardSidebar>

        <UDashboardSearch
            :groups="[
                {
                    id: 'navigators',
                    label: 'Go to ...',
                    items: navigators.map(i => i.children).flat()
                }
            ]" />
        <UDashboardPanel>
            <template #header>
                <UDashboardNavbar :title="toTitleCase(route.name)">
                    <template #leading>
                        <UDashboardSidebarCollapse />
                    </template>

                    <template #right>
                        <UButton
                            icon="i-lucide-plus"
                            class="font-bold rounded-full"
                            size="md"
                            color="primary"
                            @click="add"
                            variant="solid" />
                    </template>
                </UDashboardNavbar>
            </template>
            <template #body>
                <RouterView />
            </template>
        </UDashboardPanel>
    </UDashboardGroup>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterView, useRoute } from 'vue-router'

import { useUserStore } from '../stores/user.js'
import { useAppStore } from '../stores/app.js'
import { useProcessStore } from '../stores/process.js'
import { useFsStore } from '../stores/fs.js'
import { useDeploymentStore } from '../stores/deployment.js'
import { useKvStore } from '../stores/kv.js'

import UserMenu from '../components/UserMenu.vue'
import UserBlade from '../components/Blades/UserBlade.vue'
import AppBlade from '../components/Blades/AppBlade.vue'
import DeploymentBlade from '../components/Blades/DeploymentBlade.vue'

import { createCommonBlade, addSuccessfulToast } from '../utils.js'

const route = useRoute()
const userStore = useUserStore()
const appStore = useAppStore()
const processStore = useProcessStore()
const deploymentStore = useDeploymentStore()
const fsStore = useFsStore()
const kvStore = useKvStore()

onMounted(async () => {
    await fsStore.refresh()
    await userStore.refresh()
    await kvStore.refresh()
})

const toTitleCase = str =>
    str
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, firstChar => firstChar.toUpperCase())
        .trim()

const navigators = [
    {
        label: 'Home',
        icon: 'i-lucide-house',
        defaultOpen: true,
        children: [
            {
                label: 'Management',
                icon: 'i-lucide-app-window-mac',
                to: '/management'
            },
            {
                label: 'Logs',
                icon: 'i-lucide-file-text',
                to: '/logs'
            },
            {
                label: 'Metric',
                icon: 'i-lucide-chart-line',
                to: '/metric'
            },
            {
                label: 'Communication',
                icon: 'i-lucide-message-square-share',
                to: '/communication'
            },
            {
                label: 'Deployment',
                icon: 'i-lucide-server',
                to: '/deployment'
            },
            {
                label: 'Action',
                icon: 'i-lucide-biceps-flexed',
                to: '/action'
            },
            {
                label: 'Backup',
                icon: 'i-lucide-send-to-back',
                to: '/backup'
            }
        ]
    },
    {
        label: 'Settings',
        icon: 'i-lucide-settings',
        defaultOpen: true,
        children: [
            {
                label: 'General',
                icon: 'i-lucide-settings-2',
                to: '/general'
            },
            {
                label: 'Security',
                icon: 'i-lucide-lock-keyhole',
                to: '/security'
            },
            {
                label: 'Database',
                icon: 'i-lucide-database',
                to: '/database'
            }
        ]
    },
    {
        label: 'Administration',
        icon: 'i-lucide-chess-king',
        defaultOpen: true,
        children: [
            {
                label: 'Admin Log',
                icon: 'i-lucide-logs',
                to: '/adminLog'
            },
            {
                label: 'User',
                icon: 'i-lucide-circle-user',
                to: '/user'
            }
        ]
    }
]

const addUser = async () => {
    const { event, data } = await createCommonBlade(UserBlade, {
        initVal: userStore.getDefault()
    })
    if (event === 'cancel') {
        return
    }
    if (await userStore.createUser(data.user)) {
        addSuccessfulToast('Created successfully')
        await userStore.refresh()
    }
}

const addProcess = async () => {
    const { event, data } = await createCommonBlade(AppBlade, {
        initVal: appStore.getDefaultUIApp(),
        subscribedEvents: ['cancel', 'submit', 'createOnly']
    })
    if (event === 'cancel') {
        return
    }
    const willStart = event === 'submit'
    if (await processStore.create(appStore.fromUIObjectApp(data), willStart)) {
        addSuccessfulToast('Created successfully!')
        processStore.refresh()
    }
}

const addDeployment = async () => {
    const { event, data } = await createCommonBlade(DeploymentBlade, {
        initVal: deploymentStore.getDefault()
    })
    if (event === 'cancel') {
        return
    }
    if (await deploymentStore.create(data)) {
        addSuccessfulToast('Created successfully')
        deploymentStore.refresh()
    }
}

const add = async () => {
    if (route.name === 'user') {
        await addUser()
    }
    if (route.name === 'management') {
        await addProcess()
    }
    if (route.name === 'deployment') {
        await addDeployment()
    }
}
</script>
