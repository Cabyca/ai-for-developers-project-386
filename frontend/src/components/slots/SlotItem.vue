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
    class="w-full flex items-center justify-between px-5 py-3 rounded-full border-2 transition-all duration-300 ease-out"
    :class="{
      // Available slot - glassmorphism pill
      'bg-white/60 backdrop-blur-sm border-white/80 hover:border-indigo-400 hover:text-indigo-600 hover:bg-white/80 hover:shadow-lg hover:shadow-indigo-200/30': slot.isAvailable && !isSelected,
      
      // Selected slot - inner glow effect with indigo
      'bg-indigo-600 border-transparent text-white shadow-inner shadow-indigo-500/30 scale-[1.02]': isSelected,
      
      // Unavailable slot - pill style
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
        'bg-white/30 text-white shadow-inner shadow-white/20': isSelected,
        'bg-slate-200/50 text-slate-400': !slot.isAvailable
      }"
    >
      {{ slot.isAvailable ? 'Свободно' : 'Занято' }}
    </span>
  </button>
</template>

<style scoped>
/* Inner glow animation for selected state */
@keyframes glow-inner {
  0%, 100% { 
    box-shadow: inset 0 2px 8px rgba(255, 255, 255, 0.3), 0 4px 20px -4px rgba(99, 102, 241, 0.4);
  }
  50% { 
    box-shadow: inset 0 2px 12px rgba(255, 255, 255, 0.4), 0 6px 28px -4px rgba(99, 102, 241, 0.6);
  }
}

button.bg-gradient-to-r {
  animation: glow-inner 2s ease-in-out infinite;
}
</style>
