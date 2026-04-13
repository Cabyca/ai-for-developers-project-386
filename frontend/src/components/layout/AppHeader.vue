<script setup>
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const isActive = (path) => {
  return route.path === path
}
</script>

<template>
  <header class="bg-white border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span class="text-xl font-bold text-gray-900">Calendar</span>
        </RouterLink>
        
        <!-- Navigation -->
        <nav class="flex items-center space-x-4">
          <RouterLink
            to="/book"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="isActive('/book') || isActive('/book/calendar') || isActive('/book/confirm')
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
          >
            Записаться
          </RouterLink>
          <RouterLink
            to="/admin"
            class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          >
            Админка
          </RouterLink>
        </nav>
      </div>
    </div>
  </header>
</template>
