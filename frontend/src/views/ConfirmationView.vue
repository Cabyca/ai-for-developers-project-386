<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import InfoPanel from '../components/booking/InfoPanel.vue'
import ConfirmationForm from '../components/booking/ConfirmationForm.vue'
import { useBookingState } from '../composables/useBookingState.js'
import { createBooking } from '../api/endpoints/bookings.js'

const router = useRouter()
const {
  state,
  setGuestData,
  touchField,
  touchAllFields,
  setSubmitting,
  setError,
  reset,
  hasEventType,
  hasSelectedSlot,
  isFormValid,
  canSubmit,
  getFieldError,
  getBookingPayload
} = useBookingState()

// Local error for this view
const submitError = ref(null)

// Redirect if prerequisites not met
watch([hasEventType, hasSelectedSlot], ([hasType, hasSlot]) => {
  if (!hasType) {
    router.push('/book')
  } else if (!hasSlot) {
    router.push('/book/calendar')
  }
}, { immediate: true })

const handleGuestDataUpdate = (data) => {
  setGuestData(data)
  submitError.value = null
}

const handleBack = () => {
  router.push('/book/calendar')
}

const handleSubmit = async () => {
  // Touch all fields to show validation errors
  touchAllFields()

  if (!canSubmit.value) return

  const payload = getBookingPayload()
  if (!payload) return

  setSubmitting(true)
  submitError.value = null

  try {
    await createBooking(payload)
    // Success - go to success page
    router.push('/book/success')
  } catch (error) {
    if (error.code === 'SLOT_CONFLICT') {
      // Show specific message and redirect to calendar
      alert('Это время только что заняли, выберите другое')
      router.push('/book/calendar')
    } else {
      submitError.value = error.message || 'Не удалось создать бронирование'
    }
  } finally {
    setSubmitting(false)
  }
}

// Get hint message for inactive button
const getSubmitButtonHint = () => {
  if (!hasEventType.value) return 'Выберите тип встречи'
  if (!hasSelectedSlot.value) return 'Выберите дату и время'
  if (!isFormValid.value) {
    const nameError = getFieldError('guestName')
    const emailError = getFieldError('guestEmail')
    if (nameError) return nameError
    if (emailError) return emailError
    return 'Заполните все обязательные поля'
  }
  return null
}
</script>

<template>
  <div v-if="state.eventType && state.selectedSlot" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Подтверждение бронирования</h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl">
      <!-- Left: Info summary -->
      <div>
        <InfoPanel
          :event-type="state.eventType"
          :selected-date="state.selectedDate"
          :selected-slot="state.selectedSlot"
        />
      </div>
      
      <!-- Right: Form -->
      <div class="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Ваши данные</h2>
        
        <ConfirmationForm
          :guest-name="state.guestName"
          :guest-email="state.guestEmail"
          :comment="state.comment"
          :name-error="getFieldError('guestName')"
          :email-error="getFieldError('guestEmail')"
          @update:guest-name="setGuestData({ guestName: $event })"
          @update:guest-email="setGuestData({ guestEmail: $event })"
          @update:comment="setGuestData({ comment: $event })"
          @blur:guest-name="touchField('guestName')"
          @blur:guest-email="touchField('guestEmail')"
          @submit="handleSubmit"
        />
        
        <!-- Error message -->
        <div v-if="submitError" class="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {{ submitError }}
        </div>
        
        <!-- Action buttons -->
        <div class="mt-6 flex space-x-3">
          <button
            @click="handleBack"
            class="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Назад
          </button>

          <button
            @click="handleSubmit"
            :disabled="!canSubmit || state.isSubmitting"
            class="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
          >
            {{ state.isSubmitting ? 'Создание...' : 'Подтвердить' }}
          </button>
        </div>

        <!-- Hint for inactive button -->
        <p v-if="!canSubmit && !state.isSubmitting" class="mt-2 text-sm text-gray-500 text-center">
          {{ getSubmitButtonHint() }}
        </p>
      </div>
    </div>
  </div>
</template>
