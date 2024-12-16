<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { useRouteQuery } from '@vueuse/router'

import useMockWallets, { WalletsOrderOption } from '@/composables/useMockWallets';

import debounce from '@/utils/debounce';
import formatPlural from '@/utils/formatPlural';

import WalletCard from '@/components/WalletCard.vue';
import PagePagination from '@/components/PagePagination.vue';
import BaseInput from '@/components/base/BaseInput.vue';
import BaseSelect from '@/components/base/BaseSelect.vue';
import IconArrowRight from '@/components/icons/IconArrowRight.vue';
import IconSortDirection from '@/components/icons/IconSortDirection.vue';

import type { Wallet } from '@/models/wallet';

const wallets = ref<Wallet[]>([]);
const walletsTotal = ref(0);

const page = useRouteQuery('page', 1, { transform: Number });
const pageSize = useLocalStorage('wallets-list-size', 10, { serializer: { read: Number, write: String } });

const search = useRouteQuery('search', '');

const orderBy = useRouteQuery('orderBy', WalletsOrderOption.CreatedAt);
const orderByDesc = useRouteQuery('orderByDesc', 1, { transform: { get: Boolean, set: Number } });
const orderByOptions: { value: WalletsOrderOption, label: string }[] = [
    { value: WalletsOrderOption.CreatedAt, label: 'Created' },
    { value: WalletsOrderOption.Name, label: 'Name' },
    { value: WalletsOrderOption.Balance, label: 'Balance' },
]

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
        const { data, total } = await getWallets(
            pageSize.value,
            pageSize.value * (page.value - 1),
            {
                orderBy: orderBy.value,
                orderByDesc: orderByDesc.value,
                search: search.value,
            }
        );

        wallets.value = data;
        walletsTotal.value = total;
    } catch (error) {
        console.error(error);
    }
};
const debouncedFetchWallets = debounce(onFetchWallets, 0);

watch([page, orderBy, orderByDesc], debouncedFetchWallets);
watch([pageSize, search], () => {
    page.value = 1;
    debouncedFetchWallets();
});

onFetchWallets();
</script>

<template>
    <header class="border-b border-gray-200 py-4 px-6">
        <h1 class="text-lg font-medium">Accounts</h1>
    </header>

    <main class="p-6">
        <div class="flex items-center justify-between gap-3 mb-4">
            <div>
                <BaseInput v-model="search" placeholder="Search wallets..." />
            </div>

            <div class="ml-auto flex items-center gap-2">
                <div class="flex flex-col">
                    <label for="order-by" class="text-sm text-gray-600">Sort by</label>
                    <BaseSelect v-model="orderBy" id="order-by" :options="orderByOptions" option-value="value" option-label="label" />
                </div>

                <button
                    type="button"
                    class="text-gray-600 transition-colors duration-75 mt-5 hover:text-gray-800"
                    @click="orderByDesc = !orderByDesc"
                >
                    <IconSortDirection :size="24" :class="{ 'rotate-180': orderByDesc }" class="transition-transform duration-75" />
                </button>
            </div>
        </div>

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
