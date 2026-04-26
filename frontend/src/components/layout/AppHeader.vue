<script setup>
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const isActive = (path) => {
  return route.path === path
}
</script>

<template>
  <header class="sticky top-0 z-50 bg-white/60 backdrop-blur-xl border-b border-white/40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center space-x-2 group">
          <div class="w-9 h-9 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-400/30 group-hover:shadow-xl group-hover:shadow-indigo-400/40 transition-all duration-300">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span class="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Calendar</span>
        </RouterLink>
        
        <!-- Navigation -->
        <nav class="flex items-center space-x-2">
          <RouterLink
            to="/"
            class="px-4 py-2 rounded-[12px] text-sm font-medium transition-all duration-200"
            :class="isActive('/')
              ? 'bg-white/80 text-slate-900 shadow-md shadow-slate-200/50'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'"
          >
            Главная
          </RouterLink>
          <RouterLink
            to="/book"
            class="px-4 py-2 rounded-[12px] text-sm font-medium transition-all duration-200"
            :class="isActive('/book') || route.path.startsWith('/book/')
              ? 'bg-gradient-to-r from-indigo-400 to-purple-400 text-white shadow-lg shadow-indigo-400/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'"
          >
            Записаться
          </RouterLink>
          <RouterLink
            to="/admin"
            class="px-4 py-2 rounded-[12px] text-sm font-medium transition-all duration-200"
            :class="isActive('/admin')
              ? 'bg-white/80 text-slate-900 shadow-md shadow-slate-200/50'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'"
          >
            Админка
          </RouterLink>
        </nav>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Smooth backdrop blur transition */
header {
  transition: background-color 0.3s ease, border-color 0.3s ease;
}
</style>
