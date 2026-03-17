<template>
    <UDropdownMenu
        :items="items"
        :content="{ align: 'center', collisionPadding: 12 }"
        :ui="{
            content: collapsed
                ? 'w-48'
                : 'w-(--reka-dropdown-menu-trigger-width)'
        }">
        <UButton
            v-bind="{
                ...user,
                label: collapsed ? undefined : user?.name,
                trailingIcon: collapsed
                    ? undefined
                    : 'i-lucide-chevrons-up-down'
            }"
            color="neutral"
            variant="ghost"
            block
            :square="collapsed"
            class="data-[state=open]:bg-elevated"
            :ui="{
                trailingIcon: 'text-dimmed'
            }" />

        <template #chip-leading="{ item }">
            <div
                class="inline-flex items-center justify-center shrink-0 size-5">
                <span
                    class="rounded-full ring ring-bg bg-(--chip-light) dark:bg-(--chip-dark) size-2"
                    :style="{
                        '--chip-light': `var(--color-${item.chip}-500)`,
                        '--chip-dark': `var(--color-${item.chip}-400)`
                    }" />
            </div>
        </template>
    </UDropdownMenu>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useColorMode } from '@vueuse/core'
import { useUserStore } from '../stores/user.js'

defineProps({
    collapsed: Boolean
})

const colorMode = useColorMode()
const appConfig = useAppConfig()
const userStore = useUserStore()

const router = useRouter()

const colors = [
    'red',
    'orange',
    'amber',
    'yellow',
    'lime',
    'green',
    'emerald',
    'teal',
    'cyan',
    'sky',
    'blue',
    'indigo',
    'violet',
    'purple',
    'fuchsia',
    'pink',
    'rose'
]

const user = computed(() => {
    const name = userStore.currentUser?.displayName ?? 'Anonymous'
    return {
        name,
        avatar: {
            icon:
                userStore.currentUser?.avatar ??
                'streamline-stickies-color:baby',
            alt: name
        }
    }
})

const items = computed(() => [
    [
        {
            type: 'label',
            label: user.value.name,
            avatar: user.value.avatar
        }
    ],
    [
        {
            label: 'Theme',
            icon: 'i-lucide-palette',
            children: colors.map(color => ({
                label: color,
                chip: color,
                slot: 'chip',
                checked: appConfig.ui.colors.primary === color,
                type: 'checkbox',
                onSelect: e => {
                    e.preventDefault()
                    appConfig.ui.colors.primary = color
                }
            }))
        },
        {
            label: 'Appearance',
            icon: 'i-lucide-sun-moon',
            children: [
                {
                    label: 'Light',
                    icon: 'i-lucide-sun',
                    type: 'checkbox',
                    checked: colorMode.value === 'light',
                    onSelect(e) {
                        e.preventDefault()
                        colorMode.value = 'light'
                    }
                },
                {
                    label: 'Dark',
                    icon: 'i-lucide-moon',
                    type: 'checkbox',
                    checked: colorMode.value === 'dark',
                    onUpdateChecked(checked) {
                        if (checked) {
                            colorMode.value = 'dark'
                        }
                    },
                    onSelect(e) {
                        e.preventDefault()
                    }
                }
            ]
        }
    ],
    [
        {
            label: 'Log out',
            icon: 'i-lucide-log-out',
            onSelect: () => {
                router.push({ name: 'login' })
            }
        }
    ]
])
</script>
