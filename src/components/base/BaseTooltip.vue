<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    content?: string;
}>();

const isVisible = ref<boolean>(false);
const tooltipTriggerRef = ref<HTMLElement | null>(null);
const tooltipContentRef = ref<HTMLElement | null>(null);

const onShow = async () => {
    isVisible.value = true;
};

const onHide = () => {
    isVisible.value = false;
};
</script>

<template>
    <div class="tooltip" @mouseenter="onShow" @mouseleave="onHide">
        <div ref="tooltipTriggerRef" class="tooltip__trigger">
            <slot></slot>
        </div>

        <Transition name="fade">
            <div v-if="isVisible" ref="tooltipContentRef" class="tooltip__area">
                <div  class="tooltip__content">
                    <slot name="content">
                        <p class="tooltip__text">{{ props.content }}</p>
                    </slot>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style>
.tooltip {
    @apply relative;
    @apply w-max;
}

.tooltip__area {
    @apply absolute z-10;
    @apply top-0 -translate-y-full;
    @apply left-1/2 -translate-x-1/2;
}

.tooltip__content {
    @apply rounded-md;
    @apply bg-gray-900;
    @apply px-2 py-1;
    @apply text-sm text-white;
}

.tooltip__content::before {
    @apply content-[''];
    @apply absolute;
    @apply bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3;
    @apply w-2 h-2;
    @apply bg-gray-900;
    @apply transform rotate-45;
}

.tooltip__text {
    @apply whitespace-nowrap;
    @apply m-0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
