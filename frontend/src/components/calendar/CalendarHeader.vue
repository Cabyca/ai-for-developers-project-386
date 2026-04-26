<script setup>
defineProps({
  currentMonth: {
    type: String,
    required: true
  },
  canGoPrevious: {
    type: Boolean,
    default: true
  },
  canGoNext: {
    type: Boolean,
    default: true
  }
})

defineEmits(['previous', 'next'])
</script>

<template>
  <div class="flex items-center justify-between mb-8">
    <h3 class="text-xl font-bold text-slate-900 capitalize tracking-tight">
      {{ currentMonth }}
    </h3>
    
    <div class="flex items-center space-x-2">
      <button
        @click="$emit('previous')"
        :disabled="!canGoPrevious"
        class="p-2.5 rounded-[12px] transition-all duration-300 ease-in-out"
        :class="canGoPrevious
          ? 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
          : 'text-slate-300 cursor-not-allowed'"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        @click="$emit('next')"
        :disabled="!canGoNext"
        class="p-2.5 rounded-[12px] transition-all duration-300 ease-in-out"
        :class="canGoNext
          ? 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
          : 'text-slate-300 cursor-not-allowed'"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>
