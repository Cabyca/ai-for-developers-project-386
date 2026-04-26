<script setup>
import CalendarHeader from '../calendar/CalendarHeader.vue'
import CalendarGrid from '../calendar/CalendarGrid.vue'
import { useCalendar } from '@/composables/useCalendar.js'

const props = defineProps({
  eventType: {
    type: Object,
    required: true
  },
  selectedDate: {
    type: Date,
    default: null
  }
})

const emit = defineEmits(['update:selectedDate'])

const {
  monthHeader,
  weekdays,
  calendarDays,
  canGoToPreviousMonth,
  canGoToNextMonth,
  goToPreviousMonth,
  goToNextMonth,
  selectDate
} = useCalendar(() => props.selectedDate)

const handleDateSelect = (date) => {
  selectDate(date)
  emit('update:selectedDate', date)
}
</script>

<template>
  <div>
    <CalendarHeader
      :current-month="monthHeader"
      :can-go-previous="canGoToPreviousMonth"
      :can-go-next="canGoToNextMonth"
      @previous="goToPreviousMonth"
      @next="goToNextMonth"
    />
    
    <CalendarGrid
      :weekdays="weekdays"
      :days="calendarDays"
      @select="handleDateSelect"
    />
  </div>
</template>
