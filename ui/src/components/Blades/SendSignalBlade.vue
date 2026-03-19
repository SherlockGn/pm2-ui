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
                <h2 class="text-highlighted font-semibold">Send signal</h2>
                <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-lucide-x"
                    @click="communicationStore.sendSignalBladeOpen = false" />
            </div>
            <div class="w-200 p-2">
                <UForm
                    class="space-y-4 flex flex-col h-[80vh]"
                    @submit="onSubmit">
                    <UFormField label="Select signal type">
                        <USelect
                            v-model="signal"
                            :items="allSignals"
                            class="w-64" />
                    </UFormField>

                    <div class="mt-auto mb-20">
                        <UButton type="submit" class="">Submit</UButton>
                    </div>
                </UForm>
            </div>
        </template>
    </UDrawer>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    open: Boolean
})

const emit = defineEmits(['submit', 'cancel', 'close'])

const signal = ref('SIGINT')

const allSignals = [
    'SIGABRT',
    'SIGALRM',
    'SIGBUS',
    'SIGCHLD',
    'SIGCONT',
    'SIGFPE',
    'SIGHUP',
    'SIGILL',
    'SIGINT',
    'SIGIO',
    'SIGIOT',
    'SIGKILL',
    'SIGPIPE',
    'SIGPOLL',
    'SIGPROF',
    'SIGPWR',
    'SIGQUIT',
    'SIGSEGV',
    'SIGSTKFLT',
    'SIGSTOP',
    'SIGSYS',
    'SIGTERM',
    'SIGTRAP',
    'SIGTSTP',
    'SIGTTIN',
    'SIGTTOU',
    'SIGUNUSED',
    'SIGURG',
    'SIGUSR1',
    'SIGUSR2',
    'SIGVTALRM',
    'SIGWINCH',
    'SIGXCPU',
    'SIGXFSZ',
    'SIGBREAK',
    'SIGLOST',
    'SIGINFO'
]

const onSubmit = async () => {
    emit('submit', signal.value)
}
</script>
