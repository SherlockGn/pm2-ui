<template>
    <div ref="containerRef" class="w-full flex flex-col overflow-hidden">
        <div class="flex flex-col h-full overflow-hidden">
            <div class="flex-1 overflow-auto min-h-0">
                <slot name="body"></slot>
            </div>
            <footer>
                <slot name="footer"></slot>
            </footer>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
    adjustHeight: {
        type: Number,
        default: 30
    }
})

const containerRef = ref(null)

const updateHeight = () => {
    if (!containerRef.value) return
    const rect = containerRef.value.getBoundingClientRect()
    const topOffset = rect.top
    const availableHeight = window.innerHeight - topOffset - props.adjustHeight
    containerRef.value.style.height = `${availableHeight}px`
}

onMounted(() => {
    updateHeight()
    window.addEventListener('resize', updateHeight)
})

onUnmounted(() => {
    window.removeEventListener('resize', updateHeight)
})
</script>
