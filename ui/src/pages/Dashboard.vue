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
                            src: logoSrc
                        },
                        label: collapsed ? undefined : 'My PM2 Dashboard'
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
    <UserBlade></UserBlade>
    <AppBlade></AppBlade>
    <DescriptionBlade></DescriptionBlade>
    <SendSignalBlade></SendSignalBlade>
    <SendRpcBlade></SendRpcBlade>
    <SendDataBlade></SendDataBlade>
    <ViewDataBlade></ViewDataBlade>
    <DeploymentBlade></DeploymentBlade>
    <BackupBlade></BackupBlade>
    <BackupBladeDownloadBlade></BackupBladeDownloadBlade>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import logoSrc from '../assets/vue.svg'
import UserMenu from '../components/UserMenu.vue'

import { useUserStore } from '../stores/user.js'
import { useAppStore } from '../stores/app.js'
import { useFsStore } from '../stores/fs.js'
import { useDeploymentStore } from '../stores/deployment.js'
import { useKvStore } from '../stores/kv.js'

import UserBlade from '../components/UserBlade.vue'
import AppBlade from '../components/AppBlade.vue'
import DescriptionBlade from '../components/DescriptionBlade.vue'
import SendSignalBlade from '../components/SendSignalBlade.vue'
import SendRpcBlade from '../components/SendRpcBlade.vue'
import SendDataBlade from '../components/SendDataBlade.vue'
import ViewDataBlade from '../components/ViewDataBlade.vue'
import DeploymentBlade from '../components/DeploymentBlade.vue'
import BackupBlade from '../components/BackupBlade.vue'
import BackupBladeDownloadBlade from '../components/BackupBladeDownloadBlade.vue'

const route = useRoute()
const userStore = useUserStore()
const appStore = useAppStore()
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
        label: 'Admininistration',
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

const add = () => {
    if (route.name === 'user') {
        userStore.setUserForCreate()
        userStore.userBladeOpen = true
    }
    if (route.name === 'management') {
        appStore.setAppForCreate()
        appStore.appBladeOpen = true
    }
    if (route.name === 'deployment') {
        deploymentStore.setForCreate()
        deploymentStore.deploymentBladeOpen = true
    }
}
</script>
