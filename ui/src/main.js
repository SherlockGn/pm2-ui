import { createApp } from 'vue'
import { createPinia } from 'pinia'
import nuxtUi from '@nuxt/ui/vue-plugin'

import { router } from './router.js'
import './style.css'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(nuxtUi)

app.mount('#app')
