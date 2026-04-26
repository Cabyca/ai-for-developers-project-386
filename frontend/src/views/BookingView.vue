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
  <div v-if="state.eventType" class="min-h-screen relative overflow-hidden py-12">
    <!-- Fluid Background -->
    <div class="fixed inset-0 z-0 pointer-events-none">
      <!-- Base gradient -->
      <div class="absolute inset-0 bg-gradient-to-br from-slate-50/80 via-white/90 to-slate-50/80"></div>
      
      <!-- Gradient orb 1 - Soft Blue -->
      <div 
        class="absolute w-[700px] h-[700px] rounded-full blur-[150px] opacity-35 animate-float-slow"
        style="background: radial-gradient(circle, #e0e7ff 0%, #c7d2fe 50%, transparent 70%); top: -15%; left: -5%;"
      ></div>
      
      <!-- Gradient orb 2 - Soft Pink -->
      <div 
        class="absolute w-[500px] h-[500px] rounded-full blur-[130px] opacity-30 animate-float-medium"
        style="background: radial-gradient(circle, #fae8ff 0%, #f5d0fe 50%, transparent 70%); top: 20%; right: -5%;"
      ></div>
      
      <!-- Gradient orb 3 - Soft Mint -->
      <div 
        class="absolute w-[600px] h-[600px] rounded-full blur-[140px] opacity-20 animate-float-fast"
        style="background: radial-gradient(circle, #f0fdf4 0%, #dcfce7 50%, transparent 70%); bottom: -10%; left: 20%;"
      ></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Page title -->
      <div class="mb-10">
        <button 
          @click="goBack" 
          class="inline-flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-500 rounded-[12px] hover:text-indigo-600 hover:border-indigo-200 mb-4 transition-all duration-300"
        >
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Назад к типам событий
        </button>
        <h1 class="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">{{ state.eventType.title }}</h1>
        <p class="text-slate-500 mt-2">{{ state.eventType.description }}</p>
      </div>
      
      <!-- Three-panel layout -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left panel: Info -->
        <div class="lg:col-span-3">
          <div class="bg-white/70 backdrop-blur-xl rounded-[32px] border border-white/60 shadow-xl shadow-slate-200/30 p-6 sticky top-6">
            <InfoPanel
              :event-type="state.eventType"
              :selected-date="state.selectedDate"
              :selected-slot="state.selectedSlot"
            />
          </div>
        </div>
        
        <!-- Center panel: Calendar -->
        <div class="lg:col-span-5">
          <div class="bg-white/70 backdrop-blur-xl rounded-[32px] border border-white/60 shadow-xl shadow-slate-200/30 p-6 md:p-8">
            <CalendarPanel
              :event-type="state.eventType"
              v-model:selected-date="state.selectedDate"
              @update:selected-date="handleDateSelect"
            />
          </div>
        </div>
        
        <!-- Right panel: Slots -->
        <div class="lg:col-span-4">
          <div class="bg-white/70 backdrop-blur-xl rounded-[32px] border border-white/60 shadow-xl shadow-slate-200/30 p-6 h-full flex flex-col">
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
    </div>
  </div>
</template>

<style scoped>
@keyframes float-slow {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.05); }
  66% { transform: translate(-20px, 20px) scale(0.95); }
}

@keyframes float-medium {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-25px, 25px) scale(1.08); }
  66% { transform: translate(25px, -15px) scale(0.92); }
}

@keyframes float-fast {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(20px, -20px) scale(1.1); }
}

.animate-float-slow {
  animation: float-slow 25s ease-in-out infinite;
}

.animate-float-medium {
  animation: float-medium 18s ease-in-out infinite;
}

.animate-float-fast {
  animation: float-fast 12s ease-in-out infinite;
}
</style>
