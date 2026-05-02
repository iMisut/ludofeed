<template>
  <nav class="sticky top-0 z-40 bg-white shadow-md border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo/Brand -->
        <RouterLink to="/" class="flex items-center space-x-2 font-bold text-xl text-blue-600 hover:text-blue-700">
          <span class="text-2xl">🎲</span>
          <span>Ludofeed</span>
        </RouterLink>

        <!-- Navigation Links -->
        <div class="hidden md:flex space-x-8">
          <RouterLink
            to="/"
            :class="[
              'transition-colors',
              route.name === 'Home'
                ? 'text-blue-600 font-semibold'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            Feeds
          </RouterLink>
          <RouterLink
            to="/sites"
            :class="[
              'transition-colors',
              route.name === 'Sites'
                ? 'text-blue-600 font-semibold'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            Sitios
          </RouterLink>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden flex items-center space-x-4">
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="text-gray-600 hover:text-gray-900 p-2"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200 py-4 space-y-2">
        <RouterLink
          to="/"
          @click="mobileMenuOpen = false"
          class="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          Feeds
        </RouterLink>
        <RouterLink
          to="/sites"
          @click="mobileMenuOpen = false"
          class="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          Sitios
        </RouterLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { RouterLink } from 'vue-router';

const route = useRoute();
const mobileMenuOpen = ref(false);
</script>

<style scoped></style>
