import { ref, computed, watch } from 'vue'
import { 
  generateWorkingDays, 
  generateMonthGrid,
  isWithinBookingWindow,
  isSameDay,
  getPreviousMonth,
  getNextMonth,
  formatMonthHeader,
  getShortWeekdayName,
  dayjs
} from '@/utils/date.js'

export function useCalendar(selectedDateRef) {
  // Working days for the 14-day window
  const workingDays = ref(generateWorkingDays())
  
  // Currently displayed month (for calendar grid)
  const currentMonth = ref(dayjs().startOf('month').toDate())
  
  // Selected date (can be passed from parent or managed internally)
  const selectedDate = selectedDateRef || ref(null)
  
  // Computed values
  const monthHeader = computed(() => {
    return formatMonthHeader(currentMonth.value)
  })
  
  const weekdays = computed(() => {
    // Russian weekdays starting from Monday: Пн, Вт, Ср, Чт, Пт, Сб, Вс
    return Array.from({ length: 7 }, (_, i) => getShortWeekdayName(i))
  })
  
  const calendarDays = computed(() => {
    const days = generateMonthGrid(currentMonth.value)
    
    // Enhance days with additional info
    return days.map(dayInfo => {
      if (!dayInfo.date) return dayInfo
      
      return {
        ...dayInfo,
        isSelectable: isWithinBookingWindow(dayInfo.date) && !dayInfo.isWeekend,
        isSelected: isSameDay(dayInfo.date, selectedDate.value),
        isToday: isSameDay(dayInfo.date, new Date())
      }
    })
  })
  
  const canGoToPreviousMonth = computed(() => {
    const previousMonth = dayjs(currentMonth.value).subtract(1, 'month')
    const today = dayjs().startOf('month')
    return previousMonth.isSameOrAfter(today, 'month')
  })
  
  const canGoToNextMonth = computed(() => {
    const maxDate = dayjs().add(14, 'day').endOf('month')
    const nextMonth = dayjs(currentMonth.value).add(1, 'month')
    return nextMonth.isSameOrBefore(maxDate, 'month')
  })
  
  // Navigation methods
  const goToPreviousMonth = () => {
    if (canGoToPreviousMonth.value) {
      currentMonth.value = getPreviousMonth(currentMonth.value)
    }
  }
  
  const goToNextMonth = () => {
    if (canGoToNextMonth.value) {
      currentMonth.value = getNextMonth(currentMonth.value)
    }
  }
  
  // Selection method
  const selectDate = (date) => {
    if (isWithinBookingWindow(date) && !dayjs(date).day() === 0 && !dayjs(date).day() === 6) {
      selectedDate.value = date
      return true
    }
    return false
  }
  
  // Check if date is in working days list
  const isWorkingDay = (date) => {
    return workingDays.value.some(workingDay => isSameDay(workingDay, date))
  }
  
  return {
    // State
    workingDays: computed(() => workingDays.value),
    currentMonth: computed(() => currentMonth.value),
    selectedDate: computed(() => selectedDate.value),
    
    // Computed
    monthHeader,
    weekdays,
    calendarDays,
    canGoToPreviousMonth,
    canGoToNextMonth,
    
    // Methods
    goToPreviousMonth,
    goToNextMonth,
    selectDate,
    isWorkingDay
  }
}
