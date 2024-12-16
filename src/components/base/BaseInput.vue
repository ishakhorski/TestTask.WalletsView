<script setup lang="ts">
const value = defineModel();
</script>

<template>
    <input v-model="value" class="base-input" />
</template>

<style>
.base-input {
    @apply rounded-[4px] border border-gray-200;
    @apply text-sm text-gray-800;
    @apply px-2 py-1;
}
</style>
