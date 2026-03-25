import { computed } from 'vue'
import { createI18n } from 'vue-i18n'
import en from './locales/en.js'
import zh from './locales/zh.js'
import ja from './locales/ja.js'

import {
    en as nuxtUiEn,
    zh_cn as nuxtUiZh,
    ja as nuxtUiJa
} from '@nuxt/ui/locale'

const savedLocale = localStorage.getItem('locale') || 'en'

export const i18n = createI18n({
    legacy: false,
    locale: savedLocale,
    fallbackLocale: 'en',
    messages: { en, zh, ja }
})

const nuxtUiLocaleMap = {
    en: nuxtUiEn,
    zh: nuxtUiZh,
    ja: nuxtUiJa
}

export const nuxtUiLocale = computed(
    () => nuxtUiLocaleMap[i18n.global.locale.value] || nuxtUiEn
)

export const availableLocales = [
    { value: 'en', label: 'English' },
    { value: 'zh', label: '中文' },
    { value: 'ja', label: '日本語' }
]

export const setLocale = locale => {
    i18n.global.locale.value = locale
    localStorage.setItem('locale', locale)
}
