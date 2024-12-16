<script setup lang="ts">
import BaseTooltip from '@/components/base/BaseTooltip.vue';
import IconCopy from '@/components/icons/IconCopy.vue';

const props = defineProps<{
    content?: string;
}>();

const emit = defineEmits<{
    (event: 'copy'): void
}>();

const onCopy = () => {
    emit('copy');
};
</script>

<template>
    <BaseTooltip>
        <slot></slot>

        <template #content>
            <div class="flex items-center gap-2">
                <p>{{ props.content }}</p>

                <span class="w-[1px] h-3 bg-white"></span>

                <button class="rounded-full transition-colors duration-75 hover:brightness-90 active:brightness-75" @click.stop="onCopy">
                    <IconCopy :size="24" aria-hidden="true" />
                    <span class="sr-only">copy</span>
                </button>
            </div>
        </template>
    </BaseTooltip>
</template>
