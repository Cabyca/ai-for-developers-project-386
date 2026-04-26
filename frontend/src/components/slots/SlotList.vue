<script setup>
import SlotItem from './SlotItem.vue'
import SkeletonSlot from '../ui/SkeletonSlot.vue'

const props = defineProps({
  slots: {
    type: Array,
    default: () => []
  },
  selectedSlot: {
    type: Object,
    default: null
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['select'])

const isSlotSelected = (slot) => {
  if (!props.selectedSlot) return false
  return props.selectedSlot.startsAt === slot.startsAt
}

const handleSlotSelect = (slot) => {
  emit('select', slot)
}
</script>

<template>
  <div class="flex-1 overflow-hidden">
    <h3 class="text-lg font-bold text-slate-900 tracking-tight mb-4 flex items-center">
      <svg class="w-5 h-5 text-slate-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      Доступное время
    </h3>
    
    <!-- Loading state -->
    <div v-if="isLoading" class="space-y-3">
      <SkeletonSlot v-for="n in 6" :key="n" />
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="text-center py-8 bg-red-50 rounded-[16px]">
      <svg class="w-10 h-10 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <p class="text-red-500 mb-2 text-sm font-medium">{{ error }}</p>
      <button
        @click="$emit('refresh')"
        class="text-indigo-600 hover:text-indigo-700 text-sm font-semibold transition-colors"
      >
        Попробовать снова
      </button>
    </div>
    
    <!-- Empty state -->
    <div v-else-if="slots.length === 0" class="text-center py-12 bg-slate-50 rounded-[16px]">
      <div class="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <p class="text-slate-500 font-medium mb-1">Нет доступных слотов</p>
      <p class="text-slate-400 text-sm">Выберите другую дату</p>
    </div>
    
    <!-- Slots list -->
    <div v-else class="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
      <SlotItem
        v-for="slot in slots"
        :key="slot.startsAt"
        :slot="slot"
        :is-selected="isSlotSelected(slot)"
        @select="handleSlotSelect"
      />
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(241, 245, 249, 0.5);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(203, 213, 225, 0.6);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.7);
}
</style>
