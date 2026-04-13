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
    class="inline-flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
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
