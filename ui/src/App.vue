<template>
    <UApp :toaster="{ position: 'bottom-left' }" :locale="nuxtUiLocale">
        <RouterView />
    </UApp>
</template>

<script setup>
import { nuxtUiLocale } from './i18n.js'
</script>
