<template>
  <div class="w-full">
    <!-- Filters and Search -->
    <div class="mb-6 flex flex-col sm:flex-row gap-4">
      <!-- Search input -->
      <div class="flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por nombre o categoría..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Sort dropdown -->
      <select
        v-model="sortBy"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="name">Ordenar por nombre</option>
        <option value="name-desc">Nombre (Z-A)</option>
        <option value="category">Ordenar por categoría</option>
      </select>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
      <p class="font-bold">Error</p>
      <p>{{ error }}</p>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <table class="w-full border-collapse bg-white rounded-lg shadow-sm overflow-hidden">
        <thead class="bg-gray-100 border-b border-gray-300">
          <tr>
            <th class="px-4 py-3 text-left font-semibold text-gray-700">Sitio</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-700">URL</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-700">Categoría</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-700">Descripción</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-700">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="site in filteredSites"
            :key="site.id"
            class="border-b border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <!-- Site name with image -->
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <div
                  v-if="site.image"
                  class="flex-shrink-0 w-10 h-10 rounded-md overflow-hidden bg-gray-200"
                >
                  <img :src="site.image" :alt="site.name" class="w-full h-full object-cover" />
                </div>
                <div v-else class="flex-shrink-0 w-10 h-10 rounded-md bg-gray-200"></div>
                <span class="font-medium text-gray-900">{{ site.name }}</span>
              </div>
            </td>

            <!-- URL -->
            <td class="px-4 py-3">
              <a
                :href="site.url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-600 hover:text-blue-800 truncate text-sm"
                :title="site.url"
              >
                {{ site.url }}
              </a>
            </td>

            <!-- Category -->
            <td class="px-4 py-3">
              <span v-if="site.category" class="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                {{ site.category }}
              </span>
              <span v-else class="text-gray-400 text-sm">-</span>
            </td>

            <!-- Description -->
            <td class="px-4 py-3 max-w-xs">
              <p class="text-gray-600 text-sm truncate" :title="site.description">
                {{ site.description || '-' }}
              </p>
            </td>

            <!-- Actions -->
            <td class="px-4 py-3">
              <a
                :href="site.url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
              >
                Visitar →
              </a>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- No results -->
      <div v-if="filteredSites.length === 0 && !loading" class="text-center py-8 text-gray-500">
        <p>No se encontraron sitios que coincidan con tu búsqueda.</p>
      </div>

      <!-- Results count -->
      <div v-if="filteredSites.length > 0" class="mt-4 text-sm text-gray-600">
        Mostrando {{ filteredSites.length }} de {{ sites.length }} sitios
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import feedsApi, { type Site } from '@/api/client';

const sites = ref<Site[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const searchQuery = ref('');
const sortBy = ref('name');

const filteredSites = computed(() => {
  let filtered = sites.value;

  // Search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      site =>
        site.name.toLowerCase().includes(query) ||
        site.category?.toLowerCase().includes(query) ||
        site.url.toLowerCase().includes(query)
    );
  }

  // Sort
  const sorted = [...filtered];
  if (sortBy.value === 'name') {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy.value === 'name-desc') {
    sorted.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortBy.value === 'category') {
    sorted.sort((a, b) => (a.category || '').localeCompare(b.category || ''));
  }

  return sorted;
});

async function loadSites() {
  try {
    loading.value = true;
    error.value = null;
    const response = await feedsApi.getSites();
    sites.value = response.items;
  } catch (err) {
    error.value = 'Error al cargar los sitios. Por favor, intenta de nuevo.';
    console.error('Error loading sites:', err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadSites();
});
</script>

<style scoped></style>
