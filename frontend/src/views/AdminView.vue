<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { listEventTypes, createEventType } from '../api/endpoints/eventTypes.js'
import { getBookings } from '../api/endpoints/bookings.js'
import { useBookingState } from '../composables/useBookingState.js'
import dayjs from 'dayjs'

const router = useRouter()
const { setEventType } = useBookingState()

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

    const bookingsArray = Array.isArray(data) ? data : []
    bookings.value = bookingsArray.sort((a, b) => new Date(b.startsAt) - new Date(a.startsAt))
  } catch (err) {
    console.error('Failed to load bookings:', err)
    if (err.response || err.code === 'NETWORK_ERROR' || err.code === 'ECONNABORTED') {
      bookingsError.value = 'Не удалось загрузить бронирования. Проверьте подключение к серверу.'
    } else {
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
    form.value = { title: '', description: '', durationMinutes: 15 }
    await loadEventTypes()
  } catch (err) {
    if (err.code === 'DUPLICATE_TITLE') {
      formError.value = 'Тип события с таким названием уже существует.'
    } else if (err.code === 'VALIDATION_ERROR') {
      formError.value = err.errors ? Object.values(err.errors).flat().join(', ') : 'Ошибка валидации'
    } else {
      formError.value = err.message || 'Не удалось создать тип события'
    }
  } finally {
    isSubmitting.value = false
  }
}

// Format helpers
const formatDateTime = (isoString) => dayjs(isoString).format('DD.MM.YYYY HH:mm')
const formatDuration = (minutes) => minutes === 15 ? '15 минут' : '30 минут'
const isUpcoming = (startsAt) => dayjs(startsAt).isAfter(dayjs())
const getEventTitle = (eventTypeId) => {
  if (!eventTypeId) return 'Тип не определен'
  const eventType = eventTypes.value.find(et => et.id === eventTypeId)
  return eventType?.title || 'Тип не определен'
}

// Navigation - переход к календарю с выбранным типом события
const navigateToBooking = (eventType) => {
  setEventType(eventType)
  router.push('/book/calendar')
}

onMounted(() => {
  loadEventTypes()
  loadBookings()
})
</script>

<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- Fluid Background -->
    <div class="fixed inset-0 z-0 pointer-events-none">
      <div class="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50"></div>
      
      <!-- Gradient orbs with soft pastel colors -->
      <div 
        class="absolute w-[700px] h-[700px] rounded-full blur-[120px] opacity-35 animate-float-slow"
        style="background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%); top: -10%; left: -5%;"
      ></div>
      
      <div 
        class="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-30 animate-float-medium"
        style="background: linear-gradient(135deg, #fae8ff 0%, #f5d0fe 100%); top: 20%; right: -5%;"
      ></div>
      
      <div 
        class="absolute w-[600px] h-[600px] rounded-full blur-[110px] opacity-20 animate-float-fast"
        style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); bottom: -5%; left: 20%;"
      ></div>
    </div>

    <!-- Content -->
    <div class="relative z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Header -->
        <div class="mb-12">
          <h1 class="text-4xl font-bold text-slate-800 tracking-tight mb-4">Админ-панель</h1>
          <p class="text-slate-500 text-lg">Управление типами событий и просмотр бронирований</p>
        </div>

        <!-- Two-column layout -->
        <div class="flex flex-col lg:flex-row items-start gap-12">
          <!-- Left column: Form -->
          <div class="w-full lg:w-80 shrink-0">
            <!-- Create Event Type Form -->
            <div class="bg-white/70 backdrop-blur-xl rounded-[32px] border border-white/60 shadow-xl shadow-slate-200/30 p-6 md:p-8">
              <h2 class="text-xl font-bold text-slate-800 tracking-tight mb-6">Создать тип события</h2>
              
              <form @submit.prevent="handleSubmit" class="space-y-5">
                <!-- Title -->
                <div>
                  <label for="title" class="block text-sm font-medium text-slate-700 mb-2">
                    Название <span class="text-indigo-400">*</span>
                  </label>
                  <input
                    id="title"
                    v-model="form.title"
                    type="text"
                    required
                    maxlength="100"
                    class="w-full px-4 py-3 border border-slate-200 rounded-[16px] focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-300 ease-in-out bg-white/60 backdrop-blur-sm"
                    placeholder="Например: Консультация 30 минут"
                  />
                </div>

                <!-- Description -->
                <div>
                  <label for="description" class="block text-sm font-medium text-slate-700 mb-2">
                    Описание <span class="text-indigo-400">*</span>
                  </label>
                  <textarea
                    id="description"
                    v-model="form.description"
                    required
                    maxlength="500"
                    rows="3"
                    class="w-full px-4 py-3 border border-slate-200 rounded-[16px] focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-300 ease-in-out bg-white/60 backdrop-blur-sm resize-none"
                    placeholder="Описание типа встречи..."
                  ></textarea>
                </div>

                <!-- Duration -->
                <div>
                  <label for="duration" class="block text-sm font-medium text-slate-700 mb-2">
                    Длительность <span class="text-indigo-400">*</span>
                  </label>
                  <div class="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      @click="form.durationMinutes = 15"
                      :class="form.durationMinutes === 15 
                        ? 'bg-gradient-to-r from-indigo-400 to-purple-400 text-white border-transparent shadow-lg shadow-indigo-400/30' 
                        : 'bg-white/60 text-slate-700 border-slate-200 hover:border-indigo-300'"
                      class="px-4 py-3 border rounded-[16px] font-medium transition-all duration-300 ease-in-out"
                    >
                      15 минут
                    </button>
                    <button
                      type="button"
                      @click="form.durationMinutes = 30"
                      :class="form.durationMinutes === 30 
                        ? 'bg-gradient-to-r from-indigo-400 to-purple-400 text-white border-transparent shadow-lg shadow-indigo-400/30' 
                        : 'bg-white/60 text-slate-700 border-slate-200 hover:border-indigo-300'"
                      class="px-4 py-3 border rounded-[16px] font-medium transition-all duration-300 ease-in-out"
                    >
                      30 минут
                    </button>
                  </div>
                </div>

                <!-- Error message -->
                <div v-if="formError" class="p-4 bg-red-50/80 border border-red-200 rounded-[16px]">
                  <p class="text-sm text-red-600">{{ formError }}</p>
                </div>

                <!-- Success message -->
                <div v-if="formSuccess" class="p-4 bg-green-50/80 border border-green-200 rounded-[16px]">
                  <p class="text-sm text-green-600">{{ formSuccess }}</p>
                </div>

                <!-- Submit button -->
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-400 to-purple-400 text-white font-semibold rounded-[16px] hover:shadow-xl hover:shadow-indigo-400/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-out"
                >
                  {{ isSubmitting ? 'Создание...' : 'Создать тип события' }}
                </button>
              </form>
            </div>
          </div>

          <!-- Right column: Combined -->
          <div class="flex-1 w-full space-y-8">
            <!-- Event Types Grid -->
            <div class="bg-white/70 backdrop-blur-xl rounded-[32px] border border-white/60 shadow-xl shadow-slate-200/30 p-6 md:p-8">
              <div class="flex items-center mb-6">
                <div class="w-10 h-10 rounded-[16px] bg-indigo-100 flex items-center justify-center mr-4">
                  <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <h2 class="text-xl font-bold text-slate-800 tracking-tight">Существующие типы событий</h2>
                  <p class="text-slate-500 text-sm mt-0.5">{{ eventTypes.length }} типов доступно для бронирования</p>
                </div>
              </div>
              
              <div v-if="isLoadingEventTypes" class="grid grid-cols-2 gap-6">
                <div v-for="n in 4" :key="n" class="min-h-[140px] bg-slate-100 animate-pulse rounded-[20px]"></div>
              </div>
              
              <div v-else-if="eventTypes.length === 0" class="text-center py-12 bg-slate-50/60 rounded-[16px]">
                <div class="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </div>
                <div class="text-slate-500 font-medium">Нет созданных типов событий</div>
                <div class="text-slate-400 text-sm mt-1">Создайте первый тип события выше</div>
              </div>
              
              <div v-else class="grid grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                <button
                  v-for="eventType in eventTypes"
                  :key="eventType.id"
                  @click="navigateToBooking(eventType)"
                  class="flex flex-col min-h-[140px] bg-white/70 backdrop-blur-md rounded-[20px] p-6 border border-slate-200/50 shadow-sm hover:border-indigo-200/60 hover:bg-slate-50/50 hover:shadow-xl hover:shadow-indigo-200/30 transition-all duration-300 ease-out hover:-translate-y-1 cursor-pointer text-left group"
                >
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center space-x-2">
                      <div class="w-8 h-8 rounded-[10px] bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors shrink-0">
                        <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <span class="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full shrink-0">
                        {{ formatDuration(eventType.durationMinutes) }}
                      </span>
                    </div>
                  </div>
                  <h3 class="text-lg font-bold text-slate-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">{{ eventType.title }}</h3>
                  <p class="text-sm text-slate-500 line-clamp-2">{{ eventType.description }}</p>
                </button>
              </div>
            </div>

            <!-- Bookings list -->
            <div class="bg-white/70 backdrop-blur-xl rounded-[32px] border border-white/60 shadow-xl shadow-slate-200/30 p-6 md:p-8">
              <div class="flex justify-between items-center mb-6">
                <div>
                  <h2 class="text-xl font-bold text-slate-800 tracking-tight">Все бронирования</h2>
                  <p class="text-slate-500 text-sm mt-1">Управление предстоящими и прошедшими записями</p>
                </div>
                <button
                  @click="loadBookings"
                  :disabled="isLoadingBookings"
                  class="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 rounded-[12px] transition-all duration-300 ease-in-out disabled:opacity-50 backdrop-blur-sm"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  {{ isLoadingBookings ? 'Обновление...' : 'Обновить' }}
                </button>
              </div>

              <div v-if="isLoadingBookings" class="space-y-3">
                <div v-for="n in 3" :key="n" class="h-20 bg-slate-100/60 animate-pulse rounded-[16px]"></div>
              </div>

              <div v-else-if="bookingsError" class="text-center py-12 bg-red-50/60 rounded-[16px] backdrop-blur-sm">
                <svg class="w-12 h-12 text-red-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <p class="text-red-500 mb-4 font-medium">{{ bookingsError }}</p>
                <button
                  @click="loadBookings"
                  class="px-6 py-3 bg-gradient-to-r from-indigo-400 to-purple-400 text-white rounded-[16px] font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Попробовать снова
                </button>
              </div>

              <div v-else-if="bookings.length === 0" class="text-center py-16 bg-slate-50/60 rounded-[16px] backdrop-blur-sm">
                <div class="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div class="text-slate-500 mb-2 font-medium">Бронирований пока нет.</div>
                <div class="text-slate-400 text-sm">Создайте первый тип события и запишитесь!</div>
              </div>

              <!-- Booking rows - horizontal layout -->
              <div v-else class="space-y-3">
                <div
                  v-for="booking in bookings"
                  :key="booking.id"
                  class="flex items-center justify-between p-4 bg-white/50 hover:bg-slate-50/50 rounded-[16px] border border-slate-100/50 hover:border-indigo-100/50 transition-all duration-300 cursor-pointer group"
                >
                  <!-- Time + Status -->
                  <div class="flex items-center space-x-4">
                    <div class="flex items-center text-lg font-bold text-slate-800">
                      <svg class="w-5 h-5 text-slate-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      {{ formatDateTime(booking.startsAt) }}
                    </div>
                    <span
                      v-if="isUpcoming(booking.startsAt)"
                      class="inline-flex items-center px-3 py-1.5 bg-white/60 backdrop-blur-md text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100 shadow-sm"
                    >
                      <span class="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2 animate-pulse"></span>
                      Предстоящее
                    </span>
                    <span
                      v-else
                      class="px-3 py-1.5 bg-white/60 backdrop-blur-md text-slate-500 text-xs font-medium rounded-full border border-slate-100"
                    >
                      Прошедшее
                    </span>
                  </div>

                  <!-- Guest Info -->
                  <div class="flex items-center space-x-6 flex-1 px-6">
                    <div class="flex items-center min-w-0">
                      <span class="text-slate-400 text-sm mr-2">Тип:</span>
                      <span class="font-medium text-slate-800 truncate">{{ getEventTitle(booking.eventTypeId) }}</span>
                    </div>
                    <div class="flex items-center min-w-0">
                      <span class="text-slate-400 text-sm mr-2">Гость:</span>
                      <span class="font-medium text-slate-800 truncate">{{ booking.guestName }}</span>
                    </div>
                    <div class="flex items-center min-w-0">
                      <span class="text-slate-400 text-sm mr-2">Email:</span>
                      <span class="text-slate-600 truncate">{{ booking.guestEmail }}</span>
                    </div>
                  </div>

                  <!-- Expand indicator -->
                  <div class="text-slate-300 group-hover:text-indigo-400 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
