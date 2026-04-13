<script setup>
import { computed } from 'vue'
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
  <div>
    <h3 class="text-lg font-semibold text-gray-900 mb-4">
      Статус слотов
    </h3>
    
    <!-- Loading state -->
    <div v-if="isLoading" class="space-y-2">
      <SkeletonSlot v-for="n in 6" :key="n" />
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-500 mb-2">{{ error }}</p>
      <button
        @click="$emit('refresh')"
        class="text-orange-500 hover:text-orange-600 text-sm font-medium"
      >
        Попробовать снова
      </button>
    </div>
    
    <!-- Empty state -->
    <div v-else-if="slots.length === 0" class="text-center py-8 text-gray-500">
      Нет доступных слотов на эту дату
    </div>
    
    <!-- Slots list -->
    <div v-else class="space-y-2 max-h-[400px] overflow-y-auto pr-2">
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
