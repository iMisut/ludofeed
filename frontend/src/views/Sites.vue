<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Sitios</h1>
        <p class="text-gray-600">Explora todos los sitios web de los que obtenemos contenido</p>
      </div>

      <!-- Sites list -->
      <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <SitesList />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SitesList from '@/components/SitesList.vue';
</script>

<style scoped></style>
