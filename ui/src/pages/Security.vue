<template>
    <div>
        <UButton
            class="mt-5 ml-5"
            color="primary"
            icon="i-lucide-refresh-ccw"
            variant="outline"
            label="Refresh"
            @click="refreshSettings" />
        <UFormField label="Regenerate JWT private key" class="mt-5 ml-5">
            <UBadge variant="subtle" color="warning" class="mt-3">
                This forces existing users logging out
            </UBadge>
            <div class="mt-3">
                <UButton
                    @click="updateJwtKey"
                    color="primary"
                    variant="outline"
                    icon="i-lucide-key">
                    Regenerate
                </UButton>
            </div>
        </UFormField>
        <UFormField label="Token expiration" class="mt-5 ml-5">
            <UBadge variant="subtle" color="warning" class="mt-3">
                Logged in users are not affected
            </UBadge>
            <div class="mt-3">
                <DateTimePeriod
                    v-model="kvStore.settings.tokenExpireTime"></DateTimePeriod>
            </div>
            <UButton
                @click="updateTokenExpireTime"
                class="mt-3"
                color="primary"
                variant="outline"
                icon="i-lucide-save"></UButton>
        </UFormField>
        <UFormField label="Enable CORS" class="mt-5 ml-5">
            <UBadge variant="subtle" color="warning" class="mt-3">
                Will take effect after restart server
            </UBadge>
            <div class="mt-3">
                <USwitch
                    v-model="kvStore.settings.enableCors"
                    @change="updateEnableCors"></USwitch>
            </div>
        </UFormField>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useKvStore } from '../stores/kv.js'
import { addSuccessfulToast } from '../utils.js'

import StringList from '../components/StringList.vue'
import DateTime from '../components/DateTime.vue'
import DateTimePeriod from '../components/DateTimePeriod.vue'

const kvStore = useKvStore()

const updateJwtKey = async () => {
    if (await kvStore.updateJwtKey()) {
        addSuccessfulToast('Updated successfully!')
    }
}

const updateTokenExpireTime = async () => {
    if (await kvStore.updateTokenExpireTime(kvStore.settings.tokenExpireTime)) {
        addSuccessfulToast('Updated successfully!')
    }
}

const updateEnableCors = async () => {
    if (await kvStore.updateEnableCors(kvStore.settings.enableCors)) {
        addSuccessfulToast('Updated successfully!')
    }
}

const refreshSettings = async () => {
    if (await kvStore.refresh()) {
        addSuccessfulToast('Refreshed successfully!')
    }
}
</script>
