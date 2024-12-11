<script setup lang="ts">
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const props = defineProps<{
    content?: string;
}>()
</script>

<template>
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger as-child>
                <slot></slot>
            </TooltipTrigger>
            <TooltipContent>
                <slot name="content">{{ props.content }}</slot>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
</template>
