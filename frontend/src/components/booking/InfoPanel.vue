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
  <div>
    <!-- Host profile -->
    <HostProfile class="mb-6" />
    
    <!-- Event type summary -->
    <div class="mb-6 pb-6 border-b border-slate-100">
      <div class="flex items-center space-x-2 mb-3">
        <h3 class="text-lg font-bold text-slate-900">{{ eventType.title }}</h3>
        <PillTag :minutes="eventType.durationMinutes" />
      </div>
      <p class="text-slate-500 text-sm leading-relaxed">{{ eventType.description }}</p>
    </div>
    
    <!-- Selected date -->
    <div class="bg-slate-50 rounded-[16px] p-4 mb-3 border border-slate-100">
      <div class="flex items-center text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        Дата
      </div>
      <p class="font-semibold text-slate-900">{{ formattedDate }}</p>
    </div>
    
    <!-- Selected time -->
    <div class="bg-slate-50 rounded-[16px] p-4 border border-slate-100">
      <div class="flex items-center text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        Время
      </div>
      <p class="font-semibold text-slate-900">{{ formattedTime }}</p>
    </div>
  </div>
</template>
