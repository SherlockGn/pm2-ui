import { createApp } from 'vue'
import { createPinia } from 'pinia'
import nuxtUi from '@nuxt/ui/vue-plugin'
import { addCollection } from '@iconify/vue'
import lucide from '@iconify-json/lucide/icons.json'
import streamlineStickiesColor from '@iconify-json/streamline-stickies-color/icons.json'

import { router } from './router.js'
import './style.css'
import App from './App.vue'

import { MyComponentsPlugin } from './utils.js'

addCollection(lucide)
addCollection(streamlineStickiesColor)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(nuxtUi)
app.use(MyComponentsPlugin)

app.mount('#app')
