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
                            ? 'Create process'
                            : 'Update process configuration'
                    }}
                </h2>

                <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-lucide-x"
                    @click="emit('cancel')" />
            </div>
            <div class="w-250 p-2">
                <UForm
                    :validate="validate"
                    :state="app"
                    class="space-y-4 flex flex-col h-[80vh]"
                    @submit="onSubmit">
                    <FullHeight :adjust-height="10">
                        <template #body>
                            <UTabs variant="link" :items="tabs" class="w-full">
                                <template v-for="tab in tabs" v-slot:[tab.slot]>
                                    <AppGroupProps
                                        :app="app"
                                        :group="tab.slot"></AppGroupProps>
                                </template>
                            </UTabs>
                        </template>
                        <template #footer>
                            <div>
                                <UButton type="submit" class="mt-5">
                                    {{
                                        props.mode === 'create'
                                            ? 'Create and Run'
                                            : 'Update'
                                    }}
                                </UButton>
                                <UButton
                                    @click.prevent="createOnly"
                                    v-if="props.mode === 'create'"
                                    variant="outline"
                                    class="mt-5 ml-3">
                                    Create
                                </UButton>
                            </div>
                        </template>
                    </FullHeight>
                </UForm>
            </div>
        </template>
    </UDrawer>
</template>

<script setup>
import { ref } from 'vue'
import FullHeight from '../FullHeight.vue'
import AppGroupProps from '../AppGroupProps.vue'

import { allGroups } from '../../../../parameters.js'

const props = defineProps({
    open: Boolean,
    initVal: Object,
    mode: {
        type: String,
        default: 'create'
    }
})

const emit = defineEmits(['submit', 'close', 'cancel', 'createOnly'])

const app = ref(props.initVal)

const tabs = ref(
    allGroups().map(g => {
        return {
            label: g.label,
            slot: g.name,
            icon: g.icon
        }
    })
)

function validate(state) {
    const errors = []
    if (!state.name) {
        errors.push({ name: 'name', message: 'Required' })
    }
    if (!state.script) {
        errors.push({ name: 'script', message: 'Required' })
    }
    return errors
}

const createOnly = async () => {
    if (!app.value.name) {
        app.value.name = '[Name not specified]'
    }
    if (!app.value.script) {
        app.value.script = '[Script not specified]'
    }
    emit('createOnly', app.value)
}

const onSubmit = async () => {
    emit('submit', app.value)
}
</script>
