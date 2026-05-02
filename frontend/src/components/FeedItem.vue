<template>
  <div class="feed-item bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200">
    <!-- Item content grid -->
    <div class="flex gap-4 p-4">
      <!-- Image -->
      <div v-if="item.image" class="flex-shrink-0">
        <img
          :src="item.image"
          :alt="item.title"
          class="w-32 h-32 object-cover rounded-md"
          @error="imageError = true"
        />
      </div>
      <div v-else class="flex-shrink-0">
        <div class="w-32 h-32 bg-gray-200 rounded-md flex items-center justify-center">
          <svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
          </svg>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-grow flex flex-col justify-between min-w-0">
        <!-- Source badge -->
        <div class="flex items-center gap-2 mb-2">
          <a
            :href="item.sourceUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full hover:bg-blue-100 transition-colors"
          >
            {{ item.sourceName }}
          </a>
          <span class="text-xs text-gray-500">{{ formatDate(item.pubDate) }}</span>
        </div>

        <!-- Title -->
        <h3 class="text-lg font-bold text-gray-900 line-clamp-2 mb-2 hover:text-blue-600">
          <a :href="item.link" target="_blank" rel="noopener noreferrer">
            {{ item.title }}
          </a>
        </h3>

        <!-- Description -->
        <p class="text-sm text-gray-600 truncate-lines-3 mb-3">
          {{ item.description }}
        </p>

        <!-- Footer -->
        <div class="flex items-center justify-between text-xs text-gray-500">
          <span v-if="item.author" class="truncate">
            Por: <strong>{{ item.author }}</strong>
          </span>
          <a
            :href="item.link"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-600 hover:text-blue-800 font-semibold whitespace-nowrap ml-4"
          >
            Leer más →
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface FeedItem {
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

defineProps<{
  item: FeedItem;
}>();

const imageError = ref(false);

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `hace ${diffMins} min`;
  }
  if (diffHours < 24) {
    return `hace ${diffHours}h`;
  }
  if (diffDays < 30) {
    return `hace ${diffDays}d`;
  }

  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
