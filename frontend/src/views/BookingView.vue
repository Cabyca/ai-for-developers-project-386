<script setup>
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import InfoPanel from '../components/booking/InfoPanel.vue'
import CalendarPanel from '../components/booking/CalendarPanel.vue'
import SlotsPanel from '../components/booking/SlotsPanel.vue'
import { useBookingState } from '../composables/useBookingState.js'

const router = useRouter()
const { 
  state, 
  setSelectedDate, 
  setSelectedSlot,
  hasEventType 
} = useBookingState()

// Redirect if no event type selected
watch(hasEventType, (has) => {
  if (!has) {
    router.push('/book')
  }
}, { immediate: true })

const handleDateSelect = (date) => {
  setSelectedDate(date)
}

const handleSlotSelect = (slot) => {
  setSelectedSlot(slot)
}

const goBack = () => {
  router.push('/book')
}

const goToConfirmation = () => {
  router.push('/book/confirm')
}
</script>

<template>
  <div v-if="state.eventType" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page title -->
    <h1 class="text-3xl font-bold text-gray-900 mb-8">{{ state.eventType.title }}</h1>
    
    <!-- Three-panel layout -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left panel: Info -->
      <div class="lg:col-span-3">
        <InfoPanel
          :event-type="state.eventType"
          :selected-date="state.selectedDate"
          :selected-slot="state.selectedSlot"
        />
      </div>
      
      <!-- Center panel: Calendar -->
      <div class="lg:col-span-5">
        <CalendarPanel
          :event-type="state.eventType"
          v-model:selected-date="state.selectedDate"
          @update:selected-date="handleDateSelect"
        />
      </div>
      
      <!-- Right panel: Slots -->
      <div class="lg:col-span-4">
        <SlotsPanel
          :event-type="state.eventType"
          :selected-date="state.selectedDate"
          v-model:selected-slot="state.selectedSlot"
          @update:selected-slot="handleSlotSelect"
          @back="goBack"
          @continue="goToConfirmation"
        />
      </div>
    </div>
  </div>
</template>
