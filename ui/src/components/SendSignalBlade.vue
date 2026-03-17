<template>
    <UDrawer
        handle-only
        direction="right"
        :handle="false"
        :dismissible="true"
        v-model:open="communicationStore.sendSignalBladeOpen">
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
import { useCommunicationStore } from '../stores/communication.js'
import { useProcessStore } from '../stores/process.js'
import { addSuccessfulToast } from '../utils.js'

const communicationStore = useCommunicationStore()
const processStore = useProcessStore()
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
    try {
        if (
            await communicationStore.sendSignal(
                processStore.activeProcess.pmId,
                signal.value
            )
        ) {
            addSuccessfulToast('Sent successfully!')
        }
    } finally {
        communicationStore.sendSignalBladeOpen = false
    }
}
</script>
