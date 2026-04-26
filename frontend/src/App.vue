<script setup>
import { RouterView } from 'vue-router'
import AppHeader from './components/layout/AppHeader.vue'
</script>

<template>
  <div class="min-h-screen relative">
    <!-- App Header (glassmorphism) - always on top -->
    <AppHeader />
    
    <!-- Main content - views will add their own fluid backgrounds -->
    <main class="relative">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<style>
/* Fade transition between pages */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(241, 241, 241, 0.5);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(193, 193, 193, 0.6);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(168, 168, 168, 0.8);
}

/* Focus ring styles */
*:focus-visible {
  outline: none;
  ring: 2px;
  ring-color: #6366f1;
}
</style>
