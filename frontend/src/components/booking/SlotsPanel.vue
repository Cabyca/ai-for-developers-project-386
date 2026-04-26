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
  <div class="flex flex-col h-full">
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
        class="flex-1 px-4 py-3.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-[16px] hover:bg-slate-50 hover:border-slate-300 hover:text-indigo-600 transition-all duration-300 ease-in-out"
      >
        Назад
      </button>
      
      <button
        @click="handleContinue"
        :disabled="!hasSelection"
        class="flex-1 px-4 py-3.5 bg-indigo-600 text-white rounded-[16px] font-semibold hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-indigo-500/25"
      >
        Продолжить
      </button>
    </div>
  </div>
</template>
