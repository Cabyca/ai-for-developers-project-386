<script setup>
import { ref, onMounted } from 'vue'
import { listEventTypes, createEventType } from '../api/endpoints/eventTypes.js'
import { getBookings } from '../api/endpoints/bookings.js'
import dayjs from 'dayjs'

// Event types management
const eventTypes = ref([])
const isLoadingEventTypes = ref(false)

// Form state
const form = ref({
  title: '',
  description: '',
  durationMinutes: 15
})
const isSubmitting = ref(false)
const formError = ref(null)
const formSuccess = ref(null)

// Bookings list
const bookings = ref([])
const isLoadingBookings = ref(false)
const bookingsError = ref(null)

// Load event types
const loadEventTypes = async () => {
  try {
    isLoadingEventTypes.value = true
    const data = await listEventTypes()
    eventTypes.value = data
  } catch (err) {
    console.error('Failed to load event types:', err)
  } finally {
    isLoadingEventTypes.value = false
  }
}

// Load bookings
const loadBookings = async () => {
  try {
    isLoadingBookings.value = true
    bookingsError.value = null
    const data = await getBookings()

    // Убедимся, что данные - это массив
    const bookingsArray = Array.isArray(data) ? data : []

    // Sort by date, newest first
    bookings.value = bookingsArray.sort((a, b) => new Date(b.startsAt) - new Date(a.startsAt))
  } catch (err) {
    // Только при реальной ошибке (4xx/5xx или сетевой сбой) показываем ошибку
    // Пустой массив [] от API - это успех, не ошибка
    console.error('Failed to load bookings:', err)

    // Проверяем, есть ли response (значит ошибка от сервера)
    // или это сетевой сбой (нет response)
    if (err.response || err.code === 'NETWORK_ERROR' || err.code === 'ECONNABORTED') {
      bookingsError.value = 'Не удалось загрузить бронирования. Проверьте подключение к серверу.'
    } else {
      // Если ошибка не связана с API/сетью, просто пустой список
      bookings.value = []
    }
  } finally {
    isLoadingBookings.value = false
  }
}

// Submit form
const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    formError.value = null
    formSuccess.value = null

    await createEventType({
      title: form.value.title,
      description: form.value.description,
      durationMinutes: parseInt(form.value.durationMinutes)
    })

    formSuccess.value = 'Тип события успешно создан!'
    
    // Reset form
    form.value = {
      title: '',
      description: '',
      durationMinutes: 15
    }

    // Refresh list to show new event type
    await loadEventTypes()
  } catch (err) {
    if (err.code === 'DUPLICATE_TITLE') {
      formError.value = 'Тип события с таким названием уже существует. Используйте другое название.'
    } else if (err.code === 'VALIDATION_ERROR') {
      formError.value = err.errors 
        ? Object.values(err.errors).flat().join(', ')
        : 'Ошибка валидации данных'
    } else if (err.code === 'SERVER_ERROR') {
      formError.value = 'Ошибка сервера. Попробуйте позже.'
    } else {
      formError.value = err.message || 'Не удалось создать тип события'
    }
  } finally {
    isSubmitting.value = false
  }
}

// Format datetime
const formatDateTime = (isoString) => {
  return dayjs(isoString).format('DD.MM.YYYY HH:mm')
}

// Format duration
const formatDuration = (minutes) => {
  return minutes === 15 ? '15 минут' : '30 минут'
}

// Check if booking is in the future
const isUpcoming = (startsAt) => {
  return dayjs(startsAt).isAfter(dayjs())
}

// Get event title by ID from loaded eventTypes
const getEventTitle = (eventTypeId) => {
  if (!eventTypeId) return 'Тип не определен'
  const eventType = eventTypes.value.find(et => et.id === eventTypeId)
  return eventType?.title || 'Тип не определен'
}

onMounted(() => {
  loadEventTypes()
  loadBookings()
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Админ-панель</h1>

    <div class="grid lg:grid-cols-2 gap-8">
      <!-- Event Types Section -->
      <div class="space-y-6">
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Создать тип события</h2>
          
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Title -->
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
                Название <span class="text-red-500">*</span>
              </label>
              <input
                id="title"
                v-model="form.title"
                type="text"
                required
                maxlength="100"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Например: Консультация 30 минут"
              />
            </div>

            <!-- Description -->
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
                Описание <span class="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                v-model="form.description"
                required
                maxlength="500"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Описание типа встречи..."
              ></textarea>
            </div>

            <!-- Duration -->
            <div>
              <label for="duration" class="block text-sm font-medium text-gray-700 mb-1">
                Длительность <span class="text-red-500">*</span>
              </label>
              <select
                id="duration"
                v-model="form.durationMinutes"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option :value="15">15 минут</option>
                <option :value="30">30 минут</option>
              </select>
            </div>

            <!-- Error message -->
            <div v-if="formError" class="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-red-600">{{ formError }}</p>
            </div>

            <!-- Success message -->
            <div v-if="formSuccess" class="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p class="text-sm text-green-600">{{ formSuccess }}</p>
            </div>

            <!-- Submit button -->
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full py-2 px-4 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ isSubmitting ? 'Создание...' : 'Создать тип события' }}
            </button>
          </form>
        </div>

        <!-- Existing Event Types -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Существующие типы событий</h2>
          
          <div v-if="isLoadingEventTypes" class="space-y-3">
            <div v-for="n in 2" :key="n" class="h-20 bg-gray-200 animate-pulse rounded-lg"></div>
          </div>
          
          <div v-else-if="eventTypes.length === 0" class="text-gray-500 text-center py-4">
            Нет созданных типов событий
          </div>
          
          <div v-else class="space-y-3">
            <div
              v-for="eventType in eventTypes"
              :key="eventType.id"
              class="p-4 border border-gray-200 rounded-lg"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-medium text-gray-900">{{ eventType.title }}</h3>
                  <p class="text-sm text-gray-500 mt-1">{{ eventType.description }}</p>
                </div>
                <span class="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                  {{ formatDuration(eventType.durationMinutes) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bookings Section -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Все бронирования</h2>
          <button
            @click="loadBookings"
            :disabled="isLoadingBookings"
            class="text-sm text-orange-600 hover:text-orange-700 font-medium disabled:opacity-50"
          >
            {{ isLoadingBookings ? 'Обновление...' : 'Обновить' }}
          </button>
        </div>

        <div v-if="isLoadingBookings" class="space-y-4">
          <div v-for="n in 3" :key="n" class="h-24 bg-gray-200 animate-pulse rounded-lg"></div>
        </div>

        <div v-else-if="bookingsError" class="text-center py-8">
          <p class="text-red-500 mb-3">{{ bookingsError }}</p>
          <button
            @click="loadBookings"
            class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Попробовать снова
          </button>
        </div>

        <div v-else-if="bookings.length === 0" class="text-center py-8">
          <div class="text-gray-500 mb-2">Бронирований пока нет.</div>
          <div class="text-gray-400 text-sm">Создайте первый тип события и запишитесь!</div>
        </div>

        <div v-else class="space-y-4 max-h-[600px] overflow-y-auto">
          <div
            v-for="booking in bookings"
            :key="booking.id"
            class="p-4 border rounded-lg"
            :class="isUpcoming(booking.startsAt) ? 'border-orange-200 bg-orange-50' : 'border-gray-200'"
          >
            <div class="flex justify-between items-start mb-2">
              <div>
                <span
                  v-if="isUpcoming(booking.startsAt)"
                  class="px-2 py-0.5 bg-orange-500 text-white text-xs font-medium rounded"
                >
                  Предстоящее
                </span>
                <span
                  v-else
                  class="px-2 py-0.5 bg-gray-300 text-gray-700 text-xs font-medium rounded"
                >
                  Прошедшее
                </span>
              </div>
              <span class="text-sm font-medium text-gray-900">
                {{ formatDateTime(booking.startsAt) }}
              </span>
            </div>

            <div class="space-y-1">
              <p class="text-sm">
                <span class="text-gray-500">Тип:</span>
                <span class="font-medium text-gray-900">
                  {{ getEventTitle(booking.eventTypeId) }}
                </span>
              </p>
              <p class="text-sm">
                <span class="text-gray-500">Гость:</span>
                <span class="font-medium text-gray-900">{{ booking.guestName }}</span>
              </p>
              <p class="text-sm">
                <span class="text-gray-500">Email:</span>
                <span class="text-gray-700">{{ booking.guestEmail }}</span>
              </p>
              <p v-if="booking.comment" class="text-sm text-gray-600 mt-2">
                <span class="text-gray-500">Комментарий:</span> {{ booking.comment }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
