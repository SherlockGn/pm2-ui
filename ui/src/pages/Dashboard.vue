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
                        label: collapsed ? undefined : $t('dashboard.appName')
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
                    :items="
                        collapsed
                            ? navigators.map(i => i.children).flat()
                            : navigators
                    "
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
                    label: $t('dashboard.goTo'),
                    items: navigators.map(i => i.children).flat()
                }
            ]" />
        <UDashboardPanel>
            <template #header>
                <UDashboardNavbar :title="routeTitle">
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
import { onMounted, computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

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

const { t } = useI18n()
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

const routeTitle = computed(() => {
    const name = route.name
    const key = `dashboard.nav.${name}`
    return t(key)
})

const navigators = computed(() => [
    {
        label: t('dashboard.nav.home'),
        icon: 'i-lucide-house',
        defaultOpen: true,
        children: [
            {
                label: t('dashboard.nav.management'),
                icon: 'i-lucide-app-window-mac',
                to: '/management'
            },
            {
                label: t('dashboard.nav.logs'),
                icon: 'i-lucide-file-text',
                to: '/logs'
            },
            {
                label: t('dashboard.nav.metric'),
                icon: 'i-lucide-chart-line',
                to: '/metric'
            },
            {
                label: t('dashboard.nav.communication'),
                icon: 'i-lucide-message-square-share',
                to: '/communication'
            },
            {
                label: t('dashboard.nav.deployment'),
                icon: 'i-lucide-server',
                to: '/deployment'
            },
            {
                label: t('dashboard.nav.action'),
                icon: 'i-lucide-biceps-flexed',
                to: '/action'
            },
            {
                label: t('dashboard.nav.backup'),
                icon: 'i-lucide-send-to-back',
                to: '/backup'
            }
        ]
    },
    {
        label: t('dashboard.nav.settings'),
        icon: 'i-lucide-settings',
        defaultOpen: true,
        children: [
            {
                label: t('dashboard.nav.general'),
                icon: 'i-lucide-settings-2',
                to: '/general'
            },
            {
                label: t('dashboard.nav.security'),
                icon: 'i-lucide-lock-keyhole',
                to: '/security'
            },
            {
                label: t('dashboard.nav.database'),
                icon: 'i-lucide-database',
                to: '/database'
            }
        ]
    },
    {
        label: t('dashboard.nav.administration'),
        icon: 'i-lucide-chess-king',
        defaultOpen: true,
        children: [
            {
                label: t('dashboard.nav.adminLog'),
                icon: 'i-lucide-logs',
                to: '/adminLog'
            },
            {
                label: t('dashboard.nav.user'),
                icon: 'i-lucide-circle-user',
                to: '/user'
            }
        ]
    }
])

const addUser = async () => {
    const { event, data } = await createCommonBlade(UserBlade, {
        initVal: userStore.getDefault()
    })
    if (event === 'cancel') {
        return
    }
    if (await userStore.createUser(data.user)) {
        addSuccessfulToast(t('toast.createdSuccessfully'))
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
        addSuccessfulToast(t('toast.createdSuccessfully'))
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
        addSuccessfulToast(t('toast.createdSuccessfully'))
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
