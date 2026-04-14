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

  // Field interaction tracking (for validation display)
  touched: {
    guestName: false,
    guestEmail: false
  },

  // UI state
  isSubmitting: false,
  error: null
})

// Simple email validation: must contain @ and at least one dot after @
function isValidEmail(email) {
  if (!email || email.trim() === '') return false
  const trimmed = email.trim()
  const atIndex = trimmed.indexOf('@')
  if (atIndex === -1 || atIndex === 0) return false
  const domain = trimmed.substring(atIndex + 1)
  return domain.indexOf('.') !== -1 && domain.length > 2
}

// Create booking state composable
export function useBookingState() {
  // Computed getters
  const hasEventType = computed(() => state.eventType !== null)
  const hasSelectedSlot = computed(() => state.selectedSlot !== null)

  // Form validation: name must not be empty, email must be valid
  const isFormValid = computed(() => {
    const nameValid = state.guestName.trim() !== ''
    const emailValid = isValidEmail(state.guestEmail)
    return nameValid && emailValid
  })

  // Legacy support
  const hasGuestData = isFormValid

  const canSubmit = computed(() =>
    hasEventType.value &&
    hasSelectedSlot.value &&
    isFormValid.value &&
    !state.isSubmitting
  )

  // Get validation error message for a specific field
  const getFieldError = (fieldName) => {
    if (!state.touched[fieldName]) return null

    if (fieldName === 'guestName') {
      return state.guestName.trim() === '' ? 'Введите ваше имя' : null
    }
    if (fieldName === 'guestEmail') {
      if (state.guestEmail.trim() === '') return 'Введите email'
      if (!isValidEmail(state.guestEmail)) return 'Введите корректный email (например, user@example.com)'
      return null
    }
    return null
  }

  // Check if field should show error state
  const isFieldInvalid = (fieldName) => {
    return state.touched[fieldName] && getFieldError(fieldName) !== null
  }
  
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
    if (data.guestName !== undefined) {
      state.guestName = data.guestName
    }
    if (data.guestEmail !== undefined) {
      state.guestEmail = data.guestEmail
    }
    if (data.comment !== undefined) {
      state.comment = data.comment
    }
  }

  // Mark field as touched (for validation display)
  const touchField = (fieldName) => {
    if (state.touched[fieldName] !== undefined) {
      state.touched[fieldName] = true
    }
  }

  // Mark all form fields as touched (e.g., on submit attempt)
  const touchAllFields = () => {
    state.touched.guestName = true
    state.touched.guestEmail = true
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
    state.touched.guestName = false
    state.touched.guestEmail = false
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
    isFormValid,
    canSubmit,

    // Validation helpers
    getFieldError,
    isFieldInvalid,

    // Actions
    setEventType,
    setSelectedDate,
    setSelectedSlot,
    setGuestData,
    touchField,
    touchAllFields,
    setSubmitting,
    setError,
    clearError,
    reset,
    getBookingPayload
  }
}
