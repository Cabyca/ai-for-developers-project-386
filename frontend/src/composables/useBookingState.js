import { reactive, readonly, computed } from 'vue'

// Global reactive state (singleton)
const state = reactive({
  // Selected event type
  eventType: null,           // { id, title, description, durationMinutes }
  
  // Selected date and slot
  selectedDate: null,        // Date object
  selectedSlot: null,        // { startsAt, endsAt, isAvailable, eventTypeId }
  
  // Guest information for booking
  guestName: '',
  guestEmail: '',
  comment: '',
  
  // UI state
  isSubmitting: false,
  error: null
})

// Create booking state composable
export function useBookingState() {
  // Computed getters
  const hasEventType = computed(() => state.eventType !== null)
  const hasSelectedSlot = computed(() => state.selectedSlot !== null)
  const hasGuestData = computed(() => 
    state.guestName.trim() !== '' && state.guestEmail.trim() !== ''
  )
  
  const canSubmit = computed(() => 
    hasEventType.value && 
    hasSelectedSlot.value && 
    hasGuestData.value &&
    !state.isSubmitting
  )
  
  // Actions
  const setEventType = (eventType) => {
    state.eventType = eventType
    // Reset dependent selections when event type changes
    state.selectedDate = null
    state.selectedSlot = null
  }
  
  const setSelectedDate = (date) => {
    state.selectedDate = date
    // Reset slot when date changes
    state.selectedSlot = null
  }
  
  const setSelectedSlot = (slot) => {
    state.selectedSlot = slot
  }
  
  const setGuestData = (data) => {
    state.guestName = data.guestName || state.guestName
    state.guestEmail = data.guestEmail || state.guestEmail
    state.comment = data.comment || state.comment
  }
  
  const setSubmitting = (isSubmitting) => {
    state.isSubmitting = isSubmitting
  }
  
  const setError = (error) => {
    state.error = error
  }
  
  const clearError = () => {
    state.error = null
  }
  
  const reset = () => {
    state.eventType = null
    state.selectedDate = null
    state.selectedSlot = null
    state.guestName = ''
    state.guestEmail = ''
    state.comment = ''
    state.isSubmitting = false
    state.error = null
  }
  
  // Get booking data ready for API submission
  const getBookingPayload = () => {
    if (!canSubmit.value) return null
    
    return {
      eventTypeId: state.eventType.id,
      startsAt: state.selectedSlot.startsAt,
      guestName: state.guestName.trim(),
      guestEmail: state.guestEmail.trim(),
      comment: state.comment.trim() || undefined
    }
  }
  
  return {
    // State (readonly to prevent direct mutation)
    state: readonly(state),
    
    // Computed getters
    hasEventType,
    hasSelectedSlot,
    hasGuestData,
    canSubmit,
    
    // Actions
    setEventType,
    setSelectedDate,
    setSelectedSlot,
    setGuestData,
    setSubmitting,
    setError,
    clearError,
    reset,
    getBookingPayload
  }
}
