<script setup>
defineProps({
  minutes: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
    {{ minutes }} мин
  </span>
</template>
