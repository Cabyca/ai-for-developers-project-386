<script setup>
import SlotList from '../slots/SlotList.vue'
import { useSlots } from '@/composables/useSlots.js'
import { computed, toRef } from 'vue'

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

const emit = defineEmits(['update:selectedSlot', 'back', 'continue'])

// Convert props to refs for composable
const eventTypeId = computed(() => props.eventType?.id)
const selectedDateRef = toRef(props, 'selectedDate')

const { 
  slots, 
  availableSlots,
  isLoading, 
  error 
} = useSlots(eventTypeId, selectedDateRef)

const hasSelection = computed(() => props.selectedSlot !== null)

const handleSlotSelect = (slot) => {
  emit('update:selectedSlot', slot)
}

const handleContinue = () => {
  if (hasSelection.value) {
    emit('continue')
  }
}
</script>

<template>
  <div class="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col h-full">
    <SlotList
      :slots="slots"
      :selected-slot="selectedSlot"
      :is-loading="isLoading"
      :error="error"
      @select="handleSlotSelect"
    />
    
    <!-- Action buttons -->
    <div class="mt-auto pt-6 flex space-x-3">
      <button
        @click="$emit('back')"
        class="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
      >
        Назад
      </button>
      
      <button
        @click="handleContinue"
        :disabled="!hasSelection"
        class="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed transition-colors"
      >
        Продолжить
      </button>
    </div>
  </div>
</template>
