<template>
    <div>
        <UButton
            class="mt-5 ml-5"
            color="primary"
            icon="i-lucide-refresh-ccw"
            variant="outline"
            :label="$t('common.refresh')"
            @click="refreshSettings" />
        <UFormField
            :label="$t('security.regenerateJwtPrivateKey')"
            class="mt-5 ml-5">
            <UBadge variant="subtle" color="warning" class="mt-3">
                {{ $t('security.thisForcesExistingUsersLoggingOut') }}
            </UBadge>
            <div class="mt-3">
                <UButton
                    @click="updateJwtKey"
                    color="primary"
                    variant="outline"
                    icon="i-lucide-key">
                    {{ $t('security.regenerate') }}
                </UButton>
            </div>
        </UFormField>
        <UFormField :label="$t('security.tokenExpiration')" class="mt-5 ml-5">
            <UBadge variant="subtle" color="warning" class="mt-3">
                {{ $t('security.loggedInUsersAreNotAffected') }}
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
        <UFormField :label="$t('security.enableCors')" class="mt-5 ml-5">
            <UBadge variant="subtle" color="warning" class="mt-3">
                {{ $t('security.willTakeEffectAfterRestartServer') }}
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
import { useI18n } from 'vue-i18n'
import { useKvStore } from '../stores/kv.js'
import { addSuccessfulToast } from '../utils.js'

import StringList from '../components/StringList.vue'
import DateTime from '../components/DateTime.vue'
import DateTimePeriod from '../components/DateTimePeriod.vue'

const { t } = useI18n()
const kvStore = useKvStore()

const updateJwtKey = async () => {
    if (await kvStore.updateJwtKey()) {
        addSuccessfulToast(t('toast.updatedSuccessfully'))
    }
}

const updateTokenExpireTime = async () => {
    if (await kvStore.updateTokenExpireTime(kvStore.settings.tokenExpireTime)) {
        addSuccessfulToast(t('toast.updatedSuccessfully'))
    }
}

const updateEnableCors = async () => {
    if (await kvStore.updateEnableCors(kvStore.settings.enableCors)) {
        addSuccessfulToast(t('toast.updatedSuccessfully'))
    }
}

const refreshSettings = async () => {
    if (await kvStore.refresh()) {
        addSuccessfulToast(t('toast.refreshedSuccessfully'))
    }
}
</script>
