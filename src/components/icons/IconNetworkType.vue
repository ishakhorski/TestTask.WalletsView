<script setup lang="ts">
import { computed } from 'vue';

import { NETWORK_CONFIG } from '@/models/networkConfig';
import type { NetworkConfig } from '@/models/networkConfig';
import type { NetworkType } from '@/models/networkType';


const props = withDefaults(
    defineProps<{
        type: NetworkType,
        size?: number
    }>(),
    {
        size: 24
    }
);

const networkConfig = computed<NetworkConfig>(() => NETWORK_CONFIG[props.type] || {
    name: 'Unknown',
    icon: ''
});
const iconUrl = computed<string>(() => networkConfig.value.icon);
</script>

<template>
    <img :src="iconUrl" alt="" :width="props.size" :height="props.size" />
</template>
