<script setup>
import { RouterLink } from 'vue-router'
import { useBookingState } from '../composables/useBookingState.js'

const { reset } = useBookingState()

const handleGoHome = () => {
  reset() // Clear booking state for next time
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center max-w-md w-full">
      <!-- Success icon -->
      <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <!-- Success text -->
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Готово!</h1>
      <p class="text-gray-500 mb-8">
        Ваша встреча успешно забронирована. Мы отправили подтверждение на ваш email.
      </p>
      
      <!-- CTA button -->
      <RouterLink
        to="/"
        @click="handleGoHome"
        class="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
      >
        На главную
      </RouterLink>
    </div>
  </div>
</template>
