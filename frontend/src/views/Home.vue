<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Últimas Entradas</h1>
        <p class="text-gray-600">Lee los últimos artículos de tus sitios web favoritos</p>
      </div>

      <!-- Stats -->
      <div v-if="stats" class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p class="text-sm text-gray-600">Total de artículos</p>
          <p class="text-2xl font-bold text-blue-600">{{ stats.totalItems }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p class="text-sm text-gray-600">Última actualización</p>
          <p class="text-sm font-semibold text-gray-900">{{ formatDate(stats.lastUpdated) }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p class="text-sm text-gray-600">Alcance temporal</p>
          <p class="text-sm font-semibold text-gray-900">Últimos 30 días</p>
        </div>
      </div>

      <!-- Feed list -->
      <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <FeedList />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import FeedList from '@/components/FeedList.vue';
import feedsApi, { type CacheStats } from '@/api/client';

const stats = ref<CacheStats | null>(null);

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

async function loadStats() {
  try {
    stats.value = await feedsApi.getStats();
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

onMounted(() => {
  loadStats();
  // Refresh stats every 2 minutes
  setInterval(loadStats, 2 * 60 * 1000);
});
</script>

<style scoped></style>
