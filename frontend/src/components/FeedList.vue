<template>
  <div class="w-full">
    <!-- Loading state -->
    <div v-if="loading && items.length === 0" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg" role="alert">
      <p class="font-bold">Error</p>
      <p>{{ error }}</p>
      <button
        @click="retry"
        class="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
      >
        Reintentar
      </button>
    </div>

    <!-- Empty state -->
    <div v-else-if="items.length === 0 && !loading" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2v-5.5a2 2 0 012-2h2.5a2 2 0 012 2v5.5a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">No hay artículos</h3>
      <p class="mt-1 text-sm text-gray-500">No se encontraron artículos en los feeds.</p>
    </div>

    <!-- Items list -->
    <div v-else class="space-y-4">
      <div
        v-for="item in items"
        :key="item.id"
        class="slide-enter-active"
      >
        <FeedItem :item="item" />
      </div>

      <!-- Loading more indicator -->
      <div v-if="loadingMore" class="flex justify-center py-6">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Infinite scroll trigger -->
      <div
        v-if="!loading && items.length < total && !loadingMore"
        ref="loadMoreTrigger"
        class="h-10 flex items-center justify-center text-gray-500 text-sm"
      >
        Cargando más...
      </div>

      <!-- End of list -->
      <div v-if="items.length >= total && items.length > 0" class="text-center py-6 text-gray-500">
        <p>No hay más artículos</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import FeedItem from '@/components/FeedItem.vue';
import feedsApi, { type PaginatedFeedsResponse } from '@/api/client';

interface Item {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  author: string;
  image?: string;
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  addedAt: string;
}

const items = ref<Item[]>([]);
const loading = ref(true);
const loadingMore = ref(false);
const error = ref<string | null>(null);
const offset = ref(0);
const limit = ref(20);
const total = ref(0);
const loadMoreTrigger = ref<HTMLElement | null>(null);
const intersectionObserver = ref<IntersectionObserver | null>(null);

const LIMIT = 20;

async function loadFeeds() {
  try {
    loading.value = true;
    error.value = null;
    const response = await feedsApi.getFeeds(offset.value, limit.value);
    
    if (offset.value === 0) {
      items.value = response.items as Item[];
    } else {
      items.value.push(...(response.items as Item[]));
    }
    
    total.value = response.total;
    offset.value += limit.value;

    // Si ya hemos cargado todos los items, desconectar el observer
    if (items.value.length >= total.value) {
      if (intersectionObserver.value) {
        intersectionObserver.value.disconnect();
        intersectionObserver.value = null;
      }
    }
  } catch (err) {
    error.value = 'Error al cargar los feeds. Por favor, intenta de nuevo.';
    console.error('Error loading feeds:', err);
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
}

function retry() {
  offset.value = 0;
  items.value = [];
  loadFeeds();
}

function setupIntersectionObserver() {
  if (!loadMoreTrigger.value) return;

  // Si ya hemos cargado todos los items, no configurar el observer
  if (items.value.length >= total.value) {
    return;
  }

  const options = {
    root: null,
    rootMargin: '100px',
    threshold: 0,
  };

  intersectionObserver.value = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !loadingMore.value && !loading.value && items.value.length < total.value) {
        loadingMore.value = true;
        loadFeeds();
      }
    });
  }, options);

  intersectionObserver.value.observe(loadMoreTrigger.value);
}

onMounted(() => {
  loadFeeds();
  
  // Setup intersection observer after first load
  setTimeout(() => {
    setupIntersectionObserver();
  }, 100);
});

onBeforeUnmount(() => {
  if (intersectionObserver.value) {
    intersectionObserver.value.disconnect();
  }
});
</script>

<style scoped></style>
