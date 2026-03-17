import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import nuxtUi from '@nuxt/ui/vite'

// https://vite.dev/config/
export default defineConfig({
    build: {
        outDir: '../dist'
    },
    plugins: [vue(), nuxtUi()]
})
