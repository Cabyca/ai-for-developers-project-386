<script setup>
const props = defineProps({
  day: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['select'])

const handleClick = () => {
  if (props.day.isSelectable && !props.day.isPadding) {
    emit('select', props.day.date)
  }
}
</script>

<template>
  <button
    @click="handleClick"
    :disabled="!day.isSelectable || day.isPadding"
    class="w-11 h-11 rounded-[14px] text-sm font-medium transition-all duration-300 ease-out flex items-center justify-center relative overflow-hidden"
    :class="{
      // Padding days (empty)
      'invisible': day.isPadding,
      
      // Weekend days (disabled)
      'text-slate-300 opacity-30 cursor-not-allowed': day.isWeekend && !day.isSelectable,
      
      // Regular day - glassmorphism
      'text-slate-600 hover:bg-white/80 hover:shadow-md hover:shadow-slate-200/30 border border-transparent hover:border-white/80': day.isSelectable && !day.isSelected && !day.isToday,
      
      // Today (not selected) - subtle highlight
      'bg-indigo-50/80 text-indigo-700 font-semibold border border-indigo-200/50': day.isToday && !day.isSelected,
      
      // Selected day - indigo glow effect
      'bg-gradient-to-br from-indigo-400 to-purple-400 text-white border-transparent font-semibold shadow-xl shadow-indigo-400/40 scale-110 z-10': day.isSelected,
      
      // Disabled (outside booking window)
      'text-slate-300 cursor-not-allowed': !day.isSelectable && !day.isWeekend && !day.isPadding
    }"
  >
    <span class="relative z-10">{{ day.date ? day.date.getDate() : '' }}</span>
    
    <!-- Shine effect for selected -->
    <div 
      v-if="day.isSelected"
      class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"
    ></div>
  </button>
</template>

<style scoped>
/* Glow animation for selected day */
@keyframes selected-glow {
  0%, 100% { 
    box-shadow: 0 8px 30px -8px rgba(99, 102, 241, 0.5);
  }
  50% { 
    box-shadow: 0 12px 40px -8px rgba(99, 102, 241, 0.7);
  }
}

button.bg-gradient-to-br {
  animation: selected-glow 2s ease-in-out infinite;
}

/* Hover lift effect */
button:hover:not(:disabled) {
  transform: translateY(-2px);
}

button.bg-gradient-to-br:hover {
  transform: scale(1.1) translateY(-2px);
}
</style>
