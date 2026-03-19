<template>
    <div>
        <!-- {{ paramItems }} -->
        <template v-for="item of paramItems">
            <div class="text-sm mt-10">
                <div>
                    <label class="block font-medium text-default">
                        {{ getTitle(item) }}
                    </label>
                </div>
                <p class="text-muted">
                    {{ getDesc(item) }}
                </p>
            </div>

            <template v-for="uiProp of item.uiProps">
                <UFormField :name="uiProp.k" class="mt-5">
                    <span
                        class="text-muted mr-5 inline-block min-w-[50px]"
                        v-if="getHelpMsg(uiProp.k)">
                        {{ getHelpMsg(uiProp.k) }}
                    </span>
                    <template v-if="getComponentName(uiProp.k)">
                        <template
                            v-if="getComponentName(uiProp.k) === 'selector'">
                            <USelect
                                :disabled="isDisabled(uiProp.k)"
                                v-model="props.app[uiProp.k]"
                                v-bind="getAttrs(uiProp.k)" />
                        </template>
                        <template
                            v-if="
                                getComponentName(uiProp.k) === 'fileSelector'
                            ">
                            <FileSelector
                                :placeholder="getExample(item)"
                                :sep="fsStore.sep"
                                :walk="fsStore.readdir"
                                v-bind="getAttrs(uiProp.k)"
                                v-model="props.app[uiProp.k]" />
                        </template>
                        <template
                            v-if="getComponentName(uiProp.k) === 'password'">
                            <UInput
                                :disabled="isDisabled(uiProp.k)"
                                v-model="props.app[uiProp.k]"
                                :placeholder="getExample(item)"
                                type="password"
                                class="w-100" />
                        </template>
                        <template
                            v-if="getComponentName(uiProp.k) === 'envProfile'">
                            <EnvironmentProfiles
                                v-model="props.app[uiProp.k]" />
                        </template>
                    </template>
                    <template v-else>
                        <template v-if="Array.isArray(uiProp.v)">
                            <StringList
                                v-model="props.app[uiProp.k]"></StringList>
                        </template>
                        <template v-if="typeof uiProp.v === 'string'">
                            <UInput
                                :disabled="isDisabled(uiProp.k)"
                                v-model="props.app[uiProp.k]"
                                :placeholder="getExample(item)"
                                class="w-100" />
                        </template>
                        <template v-if="typeof uiProp.v === 'boolean'">
                            <USwitch
                                :disabled="isDisabled(uiProp.k)"
                                class="inline-block"
                                v-model="props.app[uiProp.k]" />
                        </template>
                        <template v-if="typeof uiProp.v === 'number'">
                            <UInputNumber
                                :disabled="isDisabled(uiProp.k)"
                                v-model="props.app[uiProp.k]" />
                        </template>
                    </template>
                </UFormField>
            </template>
        </template>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { uiPropsOfGroup, allProps, components } from '../../../parameters.js'

import { useFsStore } from '../stores/fs.js'

import StringList from './StringList.vue'
import EnvironmentProfiles from './EnvironmentProfiles.vue'
import FileSelector from './FileSelector.vue'

const fsStore = useFsStore()

const props = defineProps({
    group: String,
    app: Object
})

const paramItems = computed(() =>
    uiPropsOfGroup(props.group).filter(i => i.uiProps.every(p => p.v !== null))
)
const getTitle = item => allProps().find(i => i.name === item.prop).label
const getDesc = item => allProps().find(i => i.name === item.prop).description
const getExample = item =>
    'e.g. ' + allProps().find(i => i.name === item.prop).example

const getComponentName = p => components.find(i => i.name === p)?.component
const getAttrs = p => components.find(i => i.name === p)?.attrs
const getHelpMsg = p => components.find(i => i.name === p)?.help

const isDisabled = p => {
    const disableFn = components.find(i => i.name === p)?.disable
    if (!disableFn) {
        return false
    }
    return disableFn(props.app)
}
</script>
