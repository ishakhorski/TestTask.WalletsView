<script setup lang="ts">
import { computed } from 'vue';

import WalletAssetsTable from '@/components/WalletAssetsTable.vue';
import WalletNetworksList from '@/components/WalletNetworksList.vue';
import BaseBadge from '@/components/base/BaseBadge.vue';
import BaseTooltip from '@/components/base/BaseTooltip.vue';

import formatMoney from '@/utils/formatMoney';
import formatDate from '@/utils/formatDate';
import formatPlural from '@/utils/formatPlural';
import copyToClipboard from '@/utils/copyToClipboard';

import type { Wallet } from '@/models/wallet';
import type { WalletAsset } from '@/models/walletAsset';

const props = withDefaults(
    defineProps<{
        wallet: Wallet
        expanded?: boolean
    }>(),
    {
        expanded: false
    }
)

const emit = defineEmits<{
    (event: 'update:expanded', walletId: string): void
}>()

const displayWalletName = computed(() => props.wallet.name)
const displayWalletAddress = computed(() => `${props.wallet.identifier.slice(0, 6)}...${props.wallet.identifier.slice(-6)}`)
const displayWalletAmount = computed(() => `${formatMoney(props.wallet.totalUsdValue)} USD`)
const displayWalletCreatedAt = computed(() => formatDate(props.wallet.createdAt))

const walletAssets = computed<WalletAsset[]>(() => props.wallet.assets)
const walletNetworks = computed(() => props.wallet.assets.map(asset => asset.asset.network))

const onToggleExpand = () => {
    emit('update:expanded', props.wallet.id)
}
</script>

<template>
    <div class="wallet-card">
        <div class="wallet-card__header" @click="onToggleExpand">
            <div class="flex items-center gap-3 pb-4">
                <WalletNetworksList :networks="walletNetworks" />
                <div class="flex flex-col">
                    <button class="w-max text-lg font-medium" @click.stop="onToggleExpand">
                        {{ displayWalletName }}
                    </button>
                    <BaseTooltip :content="wallet.identifier">
                        <button class="w-max text-base text-gray-600 hover:text-gray-800" @click.stop="copyToClipboard(props.wallet.identifier)">
                            # {{ displayWalletAddress }}
                        </button>
                    </BaseTooltip>
                </div>

                <BaseTooltip :content="`${formatMoney(props.wallet.totalUsdValue, 6)} USD`">
                    <p class="ml-auto text-lg font-medium">{{ displayWalletAmount }}</p>
                </BaseTooltip>
            </div>

            <div class="flex items-center gap-3 border-t border-blue-100 pt-4">
                <span class="text-base">Added: {{ displayWalletCreatedAt }}</span>

                <span class="w-[1px] h-5 bg-blue-100"></span>

                <BaseBadge class="bg-gray-100">
                    {{ walletAssets.length }} {{ formatPlural(walletAssets.length, 'asset', 'assets') }}
                </BaseBadge>
            </div>
        </div>

        <div v-if="props.expanded" class="wallet-card__content">
            <WalletAssetsTable :assets="walletAssets" />
        </div>
    </div>
</template>

<style>
.wallet-card {
    @apply border border-blue-100;
    @apply rounded-[4px];
    @apply bg-white;
}

.wallet-card__header {
    @apply p-4;
    @apply cursor-pointer;
}

.wallet-card__header h3 {
    @apply text-lg font-medium;
}

.wallet-card__content {
    @apply min-w-[600px] overflow-x-auto;
}
</style>
