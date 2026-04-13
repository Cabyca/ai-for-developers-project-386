<script setup>
const props = defineProps({
  day: {
    type: Object,
    required: true
    // { date: Date|null, isPadding: boolean, isWeekend: boolean,
    //   isSelectable: boolean, isSelected: boolean, isToday: boolean }
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
    class="w-10 h-10 rounded-lg text-sm font-medium transition-all duration-150 flex items-center justify-center"
    :class="{
      // Padding days (empty)
      'invisible': day.isPadding,
      
      // Weekend days (disabled)
      'text-gray-300 cursor-not-allowed': day.isWeekend && !day.isSelectable,
      
      // Regular day
      'text-gray-700 hover:bg-gray-100': day.isSelectable && !day.isSelected && !day.isToday,
      
      // Today (not selected)
      'bg-gray-100 text-gray-900 font-semibold': day.isToday && !day.isSelected,
      
      // Selected day
      'bg-white text-gray-900 ring-2 ring-orange-500 font-semibold': day.isSelected,
      
      // Disabled (outside booking window)
      'text-gray-300 cursor-not-allowed': !day.isSelectable && !day.isWeekend && !day.isPadding
    }"
  >
    {{ day.date ? day.date.getDate() : '' }}
  </button>
</template>
