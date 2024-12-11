<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { useRouteQuery } from '@vueuse/router'

import useMockWallets from '@/composables/useMockWallets';

import debounce from '@/utils/debounce';
import formatPlural from '@/utils/formatPlural';

import WalletCard from '@/components/WalletCard.vue';
import PagePagination from '@/components/PagePagination.vue';
import IconArrowRight from '@/components/icons/IconArrowRight.vue';

import type { Wallet } from '@/models/wallet';

const wallets = ref<Wallet[]>([]);
const walletsTotal = ref(0);

const page = useRouteQuery('page', 1, { transform: Number });
const pageSize = useLocalStorage('wallets-list-size', 10);

const expandedWallets = reactive<{ [key: string]: boolean }>({});
const isAllExpanded = ref(false);
const onToggleWalletExpand = (walletId: string) => {
    if (expandedWallets[walletId]) {
        delete expandedWallets[walletId];
    } else {
        expandedWallets[walletId] = true;
    }
};
const onToggleExpandAll = () => {
    if (isAllExpanded.value) {
        for (const wallet of wallets.value) {
            delete expandedWallets[wallet.id];
        }
    } else {
        for (const wallet of wallets.value) {
            expandedWallets[wallet.id] = true;
        }
    }

    isAllExpanded.value = !isAllExpanded.value;
};

const { getWallets } = useMockWallets();
const onFetchWallets = async () => {
    try {
        const { data, total } = await getWallets(pageSize.value, pageSize.value * (page.value - 1));
        wallets.value = data;
        walletsTotal.value = total;
    } catch (error) {
        console.error(error);
    }
};
const debouncedFetchWallets = debounce(onFetchWallets, 0);

watch([page, pageSize], debouncedFetchWallets);

onFetchWallets();
</script>

<template>
    <header class="border-b border-gray-200 py-4 px-6">
        <h1 class="text-lg font-medium">Accounts</h1>
    </header>

    <main class="p-6">
        <div class="flex items-center justify-between gap-3 mb-4">
            <button
                type="button"
                class="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                @click="onToggleExpandAll"
            >
                {{ isAllExpanded ? 'Collapse all' : 'Expand all' }}
                <IconArrowRight :size="12" :class="{ 'transform -rotate-90': isAllExpanded }" class="rotate-90 transition-transform duration-200" />
            </button>

            <span class="text-sm text-gray-600">
                {{ walletsTotal }} {{ formatPlural(walletsTotal, 'Wallet', 'Wallets') }}
            </span>
        </div>

        <div class="flex flex-col gap-2">
            <WalletCard
                v-for="wallet in wallets"
                :key="wallet.id"
                :wallet="wallet"
                :expanded="expandedWallets[wallet.id]"
                @update:expanded="onToggleWalletExpand"
            />
        </div>

        <PagePagination v-model:page="page" v-model:size="pageSize" :total="walletsTotal" class="mt-8" />
    </main>
</template>
