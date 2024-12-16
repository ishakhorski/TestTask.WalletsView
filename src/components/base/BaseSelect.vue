<script setup lang="ts" generic="T">
const props = defineProps<{
    options: T[];
    optionLabel: keyof T;
    optionValue: keyof T;
}>();

const selected = defineModel<unknown>({ required: true });

const onSelect = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    selected.value = target.value;
}
</script>

<template>
    <select :value="selected" class="base-select" @change="onSelect">
        <option
            v-for="option in props.options"
            :key="`option-${option[props.optionValue]}`"
            :value="option[props.optionValue]"
            class="base-select__option"
        >
            {{ option[props.optionLabel] }}
        </option>
    </select>
</template>

<style>
.base-select {
    @apply rounded-[4px] border border-gray-200;
    @apply text-sm text-gray-800;
    @apply px-2 py-1;
}

.base-select__option {
    @apply px-2 py-1;
}
</style>
