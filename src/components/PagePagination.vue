<template>
    <div class="page-pagination">
        <span class="flex items-center gap-2 text-sm text-gray-800">
            View
            <select v-model="size">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
            </select>
            per page
        </span>

        <span class="text-sm text-gray-800 ml-auto">
            Showing {{ total > size ? `${(size * page) - size + 1}-${size * page}` : total }} out of {{ total }} results
        </span>

        <div class="page-pagination__actions">
            <button :disabled="isFirstPage" class="page-pagination__button mr-1" @click="onPrevPage">
                <IconArrowRight :size="12" class="rotate-180" />
            </button>

            <!-- First Page -->
            <button
                :class="{ 'page-pagination__button--active': page === 1 }"
                class="page-pagination__button page-pagination__button--number"
                @click="onSetPage(1)"
            >
                1
            </button>

            <div v-for="pageNumber in visiblePageNumbers" :key="pageNumber">
                <span v-if="typeof pageNumber === 'string'" >...</span>
                <button
                    v-else
                    :key="pageNumber"
                    :class="{ 'page-pagination__button--active': page === pageNumber }"
                    class="page-pagination__button page-pagination__button--number"
                    @click="onSetPage(pageNumber)"
                >
                    {{ pageNumber }}
                </button>
            </div>

            <!-- Last Page -->
            <button
                :class="{ 'page-pagination__button--active': page === pagesNumber }"
                class="page-pagination__button page-pagination__button--number"
                @click="onSetPage(pagesNumber)"
            >
                {{ pagesNumber }}
            </button>

            <button :disabled="isLastPage" class="page-pagination__button ml-1" @click="onNextPage">
                <IconArrowRight :size="12" />
            </button>
        </div>
    </div>
</template>


<script setup lang="ts">
import { computed } from 'vue';

import IconArrowRight from '@/components/icons/IconArrowRight.vue';

const props =  defineProps<{
    total: number;
}>()

const MAX_VISIBLE_PAGES = 6;

const page = defineModel<number>('page', { required: true });
const size = defineModel<number>('size', { required: true });

const pagesNumber = computed(() => Math.ceil(props.total / size.value));

const visiblePageNumbers = computed(() => {
    const totalPages = pagesNumber.value;
    const currentPage = page.value;
    const maxPages = MAX_VISIBLE_PAGES;

    // Show all pages if total pages fit within max visible pages
    if (totalPages <= maxPages) {
        return Array.from({ length: totalPages - 2 }, (_, i) => i + 2);
    }

    const pages = [];

    // Show pages before the current page
    if (currentPage > Math.floor(maxPages / 2) + 1) {
        pages.push('...');
    }

    // Show pages around the current page
    const startPage = Math.max(2, currentPage - Math.floor((maxPages - 4) / 2));
    const endPage = Math.min(totalPages - 1, startPage + maxPages - 4);

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    // Show pages after the current page
    if (currentPage < totalPages - Math.floor(maxPages / 2)) {
        pages.push('...');
    }

    return pages;
});

const isFirstPage = computed(() => page.value === 1);
const isLastPage = computed(() => page.value === pagesNumber.value);

const onSetPage = (newPage: number) => {
    if (newPage < 1 || newPage > pagesNumber.value) return;
    page.value = newPage;
};

const onNextPage = () => {
    onSetPage(page.value + 1);
};

const onPrevPage = () => {
    onSetPage(page.value - 1);
};
</script>

<style>
.page-pagination {
    @apply flex items-center gap-4;
}

.page-pagination__actions {
    @apply flex items-center;
}

.page-pagination__button {
    @apply p-1;
    @apply text-gray-600;
    @apply transition-colors duration-75;
    @apply hover:text-gray-900;
}

.page-pagination__button--number {
    @apply text-base;
}

.page-pagination__button--active {
    @apply font-medium text-gray-950;
}
</style>
