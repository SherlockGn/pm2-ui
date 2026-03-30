<template>
    <div
        v-cloak
        class="w-200 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl flex overflow-hidden"
        style="height: 400px">
        <div
            class="w-50 border-r border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex flex-col">
            <div
                class="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-900">
                <h2 class="font-bold text-gray-400 tracking-widest">
                    {{ $t('environmentProfiles.profiles') }}
                </h2>
                <button
                    @click.prevent="addProfile"
                    class="p-1 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-primary rounded"
                    :title="$t('environmentProfiles.newProfile')">
                    <UIcon name="i-lucide-plus"></UIcon>
                </button>
            </div>

            <div class="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                <div
                    v-for="(profile, idx) in state.profiles"
                    :key="profile.name"
                    @click="selectedIndex = idx"
                    :class="[
                        'group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all',
                        selectedIndex === idx
                            ? 'bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-600'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'
                    ]">
                    <div class="flex items-center gap-2 truncate">
                        <div
                            @click.stop="state.active = idx"
                            :class="[
                                'w-2.5 h-2.5 rounded-full border-2 transition-colors',
                                state.active === idx
                                    ? 'bg-primary border-primary-500'
                                    : 'border-gray-300 dark:border-gray-500'
                            ]"></div>
                        <span
                            class="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                            {{ profile.name }}
                        </span>
                    </div>

                    <div
                        class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            @click.prevent="duplicateProfile(profile)"
                            class="p-1 text-gray-400 hover:text-blue-500"
                            :title="$t('environmentProfiles.duplicateProfile')">
                            <UIcon name="i-lucide-copy"></UIcon>
                        </button>
                        <button
                            v-if="state.profiles.length > 1"
                            @click.prevent="removeProfile(profile.name)"
                            class="p-1 text-gray-400 hover:text-red-500">
                            <UIcon name="i-lucide-x"></UIcon>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div
            class="flex-1 flex flex-col bg-white dark:bg-gray-900"
            v-if="currentProfile">
            <div
                class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-900">
                <div class="flex-1">
                    <input
                        v-model="currentProfile.name"
                        class="text-xl font-bold text-gray-900 dark:text-gray-100 bg-transparent border-b border-transparent focus:border-emerald-500 outline-none w-full max-w-md transition-colors" />
                    <div class="flex items-center gap-2 mt-1 h-3">
                        <span
                            v-show="state.active === selectedIndex"
                            class="text-[10px] bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 px-1.5 py-0.5 rounded font-bold uppercase">
                            Active
                        </span>
                        <span class="text-[10px] text-gray-400 tracking-tight">
                            {{ $t('environmentProfiles.environmentVariables') }}
                        </span>
                    </div>
                </div>
                <button
                    @click.prevent="addEnv"
                    class="bg-primary-500 hover:bg-primary-600 text-white text-sm px-4 py-2 rounded-lg font-semibold shadow-md transition-all">
                    {{ $t('environmentProfiles.addVariable') }}
                </button>
            </div>

            <div class="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-3">
                <div
                    v-for="(env, index) in currentProfile.env"
                    :key="index"
                    class="flex gap-2 items-center group bg-gray-50/50 dark:bg-gray-800/50 p-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <input
                        v-model="env.key"
                        placeholder="VARIABLE_KEY"
                        class="w-1/3 px-3 py-2 text-xs font-mono bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none placeholder-gray-400 dark:placeholder-gray-500" />
                    <input
                        v-model="env.value"
                        placeholder="value"
                        class="flex-1 px-3 py-2 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none placeholder-gray-400 dark:placeholder-gray-500" />

                    <div
                        class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity pr-1">
                        <button
                            @click.prevent="syncVariable(env)"
                            class="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                            :title="
                                $t('environmentProfiles.syncToAllProfiles')
                            ">
                            <UIcon name="i-lucide-arrow-left-right"></UIcon>
                        </button>
                        <button
                            @click.prevent="removeEnv(index)"
                            class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded">
                            <UIcon name="i-lucide-x"></UIcon>
                        </button>
                    </div>
                </div>
                <div
                    v-if="currentProfile.env.length === 0"
                    class="text-center py-20 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-xl">
                    <p class="text-gray-400 text-sm">
                        {{ $t('environmentProfiles.noVariablesInThisProfile') }}
                    </p>
                </div>
            </div>
            <details
                class="mt-auto border-t border-gray-100 dark:border-gray-700">
                <summary
                    class="px-6 py-2 text-[10px] font-bold text-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    {{ $t('environmentProfiles.jsonStateTesting') }}
                </summary>
                <pre
                    class="p-4 text-[10px] bg-gray-900 text-emerald-400 overflow-x-auto h-40"
                    >{{ state }}</pre
                >
            </details>
        </div>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    modelValue: Object
})

const state = computed(() => props.modelValue)

const selectedIndex = ref(0)

const currentProfile = computed(() => state.value.profiles[selectedIndex.value])

// --- Profile Logic ---
const addProfile = () => {
    const name = `new_profile_${state.value.profiles.length + 1}`
    state.value.profiles.push({ name, env: [] })
    selectedIndex.value = state.value.profiles.length - 1
}

const duplicateProfile = profile => {
    const newName = `${profile.name}_copy`
    // Deep clone env to avoid reference sharing
    const clonedenv = profile.env.map(e => ({ ...e }))
    state.value.profiles.push({ name: newName, env: clonedenv })
    selectedIndex.value = state.value.profiles.length - 1
}

const removeProfile = name => {
    const idx = state.value.profiles.findIndex(p => p.name === name)
    state.value.profiles.splice(idx, 1)
    if (selectedIndex.value === idx) selectedIndex.value = 0
    if (state.value.active === idx) state.value.active = 0
}
// --- Variable Logic ---
const addEnv = () => currentProfile.value.env.push({ key: '', value: '' })
const removeEnv = idx => currentProfile.value.env.splice(idx, 1)

const syncVariable = variable => {
    state.value.profiles.forEach((p, idx) => {
        // Don't sync to yourself
        if (idx === selectedIndex.value) return

        const existing = p.env.find(e => e.key === variable.key)
        if (existing) {
            existing.value = variable.value
        } else {
            p.env.push({ ...variable })
        }
    })
}
</script>
