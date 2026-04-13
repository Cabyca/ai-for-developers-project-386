<script setup>
import HostProfile from '../event-type/HostProfile.vue'
import PillTag from '../ui/PillTag.vue'
import { formatDateDisplay } from '@/utils/date.js'
import { formatTimeSlot } from '@/utils/date.js'
import { computed } from 'vue'

const props = defineProps({
  eventType: {
    type: Object,
    required: true
  },
  selectedDate: {
    type: Date,
    default: null
  },
  selectedSlot: {
    type: Object,
    default: null
  }
})

const formattedDate = computed(() => {
  if (!props.selectedDate) return 'Дата не выбрана'
  return formatDateDisplay(props.selectedDate)
})

const formattedTime = computed(() => {
  if (!props.selectedSlot) return 'Время не выбрано'
  return formatTimeSlot(props.selectedSlot.startsAt, props.selectedSlot.endsAt)
})
</script>

<template>
  <div class="bg-white rounded-2xl border border-gray-200 p-6">
    <!-- Host profile -->
    <HostProfile class="mb-6" />
    
    <!-- Event type summary -->
    <div class="mb-6">
      <div class="flex items-center space-x-2 mb-2">
        <h3 class="text-lg font-semibold text-gray-900">{{ eventType.title }}</h3>
        <PillTag :minutes="eventType.durationMinutes" />
      </div>
      <p class="text-gray-500 text-sm">{{ eventType.description }}</p>
    </div>
    
    <!-- Selected date -->
    <div class="bg-gray-50 rounded-lg p-4 mb-3">
      <p class="text-sm text-gray-500 mb-1">Выбранная дата</p>
      <p class="font-medium text-gray-900">{{ formattedDate }}</p>
    </div>
    
    <!-- Selected time -->
    <div class="bg-gray-50 rounded-lg p-4">
      <p class="text-sm text-gray-500 mb-1">Выбранное время</p>
      <p class="font-medium text-gray-900">{{ formattedTime }}</p>
    </div>
  </div>
</template>
