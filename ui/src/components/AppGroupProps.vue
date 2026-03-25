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
import { useI18n } from 'vue-i18n'
import { uiPropsOfGroup, allProps, components } from '../../../parameters.js'

import { useFsStore } from '../stores/fs.js'

import StringList from './StringList.vue'
import EnvironmentProfiles from './EnvironmentProfiles.vue'
import FileSelector from './FileSelector.vue'

const { t, te } = useI18n()
const fsStore = useFsStore()

const props = defineProps({
    group: String,
    app: Object
})

const paramItems = computed(() =>
    uiPropsOfGroup(props.group).filter(i => i.uiProps.every(p => p.v !== null))
)
const helpKeyMap = {
    'Enable': 'parameters.components.enable',
    'Value': 'parameters.components.value',
    'Unit': 'parameters.components.unit',
    'Watch for all files': 'parameters.components.watchForAllFiles'
}

const labelKeyMap = {
    'Fork': 'parameters.components.fork',
    'Cluster': 'parameters.components.cluster',
    'Milliseconds': 'dateTimePeriod.milliseconds',
    'Seconds': 'dateTimePeriod.seconds',
    'Minutes': 'dateTimePeriod.minutes',
    'Hours': 'dateTimePeriod.hours'
}

const getTitle = item => {
    const key = `parameters.props.${item.prop}.label`
    return te(key) ? t(key) : allProps().find(i => i.name === item.prop).label
}
const getDesc = item => {
    const key = `parameters.props.${item.prop}.description`
    return te(key)
        ? t(key)
        : allProps().find(i => i.name === item.prop).description
}
const getExample = item =>
    'e.g. ' + allProps().find(i => i.name === item.prop).example

const getComponentName = p => components.find(i => i.name === p)?.component
const getAttrs = p => {
    const comp = components.find(i => i.name === p)
    if (!comp?.attrs) return comp?.attrs
    if (comp.attrs.items && Array.isArray(comp.attrs.items)) {
        return {
            ...comp.attrs,
            items: comp.attrs.items.map(item => {
                if (
                    typeof item === 'object' &&
                    item.label &&
                    labelKeyMap[item.label]
                ) {
                    return { ...item, label: t(labelKeyMap[item.label]) }
                }
                return item
            })
        }
    }
    return comp.attrs
}
const getHelpMsg = p => {
    const help = components.find(i => i.name === p)?.help
    if (!help) return help
    return helpKeyMap[help] ? t(helpKeyMap[help]) : help
}

const isDisabled = p => {
    const disableFn = components.find(i => i.name === p)?.disable
    if (!disableFn) {
        return false
    }
    return disableFn(props.app)
}
</script>
