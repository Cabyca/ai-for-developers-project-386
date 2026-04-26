<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  to: {
    type: String,
    required: true
  }
})
</script>

<template>
  <RouterLink
    :to="to"
    class="inline-flex items-center bg-orange-500 text-white rounded-full px-8 py-4 font-semibold text-lg transition-all duration-200 ease-in-out hover:bg-orange-600 hover:scale-105 hover:shadow-lg active:scale-95 shadow-md shadow-orange-500/20"
  >
    <span><slot /></span>
    <svg
      class="w-5 h-5 ml-2"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M17 8l4 4m0 0l-4 4m4-4H3"
      />
    </svg>
  </RouterLink>
</template>
