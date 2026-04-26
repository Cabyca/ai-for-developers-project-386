<script setup>
import PillTag from '../ui/PillTag.vue'

defineProps({
  eventType: {
    type: Object,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  }
})

defineEmits(['select'])
</script>

<template>
  <button
    @click="$emit('select', eventType)"
    class="w-full text-left p-6 bg-white rounded-xl border transition-all duration-300"
    :class="isSelected
      ? 'border-indigo-500 ring-2 ring-indigo-500 shadow-md'
      : 'border-gray-200 hover:border-indigo-300 hover:shadow-md'"
  >
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          {{ eventType.title }}
        </h3>
        <p class="text-gray-500 text-sm leading-relaxed">
          {{ eventType.description }}
        </p>
      </div>
      
      <PillTag :minutes="eventType.durationMinutes" />
    </div>
  </button>
</template>
