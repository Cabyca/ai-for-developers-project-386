<script setup>
import { computed } from 'vue'
import { formatTimeSlot } from '@/utils/date.js'

const props = defineProps({
  slot: {
    type: Object,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select'])

const timeRange = computed(() => {
  return formatTimeSlot(props.slot.startsAt, props.slot.endsAt)
})

const handleClick = () => {
  if (props.slot.isAvailable) {
    emit('select', props.slot)
  }
}
</script>

<template>
  <button
    @click="handleClick"
    :disabled="!slot.isAvailable"
    class="w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200"
    :class="{
      // Available slot
      'bg-white border-gray-200 hover:border-orange-300': slot.isAvailable && !isSelected,
      
      // Selected slot
      'bg-orange-50 border-orange-500 ring-1 ring-orange-500': isSelected,
      
      // Unavailable slot
      'bg-gray-50 border-gray-100 cursor-not-allowed': !slot.isAvailable
    }"
  >
    <span
      class="font-medium"
      :class="{
        'text-gray-900': slot.isAvailable,
        'text-gray-400': !slot.isAvailable
      }"
    >
      {{ timeRange }}
    </span>
    
    <span
      class="text-sm"
      :class="{
        'text-green-600': slot.isAvailable && !isSelected,
        'text-orange-600': isSelected,
        'text-gray-400': !slot.isAvailable
      }"
    >
      {{ slot.isAvailable ? 'Свободно' : 'Занято' }}
    </span>
  </button>
</template>
