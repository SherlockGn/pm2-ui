<template>
    <UDrawer
        handle-only
        direction="right"
        :handle="false"
        :dismissible="true"
        :open="props.open"
        @update:open="e => e || emit('cancel')"
        @animationEnd="e => e || emit('close')">
        <template #body>
            <div class="flex items-center justify-between gap-4 mb-2 p-2">
                <h2 class="text-highlighted font-semibold">
                    {{
                        props.mode === 'create'
                            ? $t('backupBlade.createBackup')
                            : $t('backupBlade.updateBackup')
                    }}
                </h2>
                <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-lucide-x"
                    @click="emit('cancel')" />
            </div>
            <div class="w-200 p-2">
                <UForm
                    class="space-y-4 flex flex-col h-[80vh]"
                    @submit="onSubmit">
                    <UFormField :label="$t('backupBlade.backupName')">
                        <UInput v-model="name" class="w-64" />
                    </UFormField>

                    <div class="mt-auto mb-20">
                        <UButton type="submit" class="">
                            {{ $t('common.submit') }}
                        </UButton>
                    </div>
                </UForm>
            </div>
        </template>
    </UDrawer>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
    open: Boolean,
    initVal: Object,
    mode: {
        type: String,
        default: 'create'
    }
})

const emit = defineEmits(['submit', 'cancel', 'close'])

const name = ref(props.initVal.name)

const onSubmit = async () => {
    emit('submit', { name: name.value })
}
</script>
