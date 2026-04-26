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
    class="w-full flex items-center justify-between p-4 rounded-[16px] border-2 transition-all duration-300 ease-out"
    :class="{
      // Available slot - glassmorphism effect
      'bg-white/60 backdrop-blur-sm border-white/80 hover:border-indigo-300/60 hover:bg-white/80 hover:shadow-lg hover:shadow-indigo-200/30': slot.isAvailable && !isSelected,
      
      // Selected slot - glow effect with indigo
      'bg-gradient-to-r from-indigo-400 to-purple-400 border-transparent text-white shadow-xl shadow-indigo-400/40 scale-[1.02]': isSelected,
      
      // Unavailable slot
      'bg-slate-100/50 border-slate-200/50 cursor-not-allowed': !slot.isAvailable
    }"
  >
    <span
      class="font-semibold"
      :class="{
        'text-slate-800': slot.isAvailable && !isSelected,
        'text-white': isSelected,
        'text-slate-400': !slot.isAvailable
      }"
    >
      {{ timeRange }}
    </span>
    
    <span
      class="text-sm font-medium px-3 py-1 rounded-full transition-all duration-300"
      :class="{
        'bg-emerald-100/80 text-emerald-700': slot.isAvailable && !isSelected,
        'bg-white/20 text-white': isSelected,
        'bg-slate-200/50 text-slate-400': !slot.isAvailable
      }"
    >
      {{ slot.isAvailable ? 'Свободно' : 'Занято' }}
    </span>
  </button>
</template>

<style scoped>
/* Glow animation for selected state */
@keyframes glow-pulse {
  0%, 100% { 
    box-shadow: 0 10px 40px -10px rgba(99, 102, 241, 0.4);
  }
  50% { 
    box-shadow: 0 15px 50px -10px rgba(99, 102, 241, 0.6);
  }
}

button.bg-gradient-to-r {
  animation: glow-pulse 2s ease-in-out infinite;
}
</style>
