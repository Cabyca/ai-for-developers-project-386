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

// Navigation
const selectEventType = (eventType) => {
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
      <!-- Base gradient -->
      <div class="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50"></div>
      
      <!-- Gradient orb 1 - Soft Blue -->
      <div 
        class="absolute w-[800px] h-[800px] rounded-full blur-[150px] opacity-40 animate-float-slow"
        style="background: radial-gradient(circle, #e0e7ff 0%, #c7d2fe 50%, transparent 70%); top: -20%; left: -10%;"
      ></div>
      
      <!-- Gradient orb 2 - Soft Pink -->
      <div 
        class="absolute w-[600px] h-[600px] rounded-full blur-[130px] opacity-35 animate-float-medium"
        style="background: radial-gradient(circle, #fae8ff 0%, #f5d0fe 50%, transparent 70%); top: 30%; right: -10%;"
      ></div>
      
      <!-- Gradient orb 3 - Soft Mint -->
      <div 
        class="absolute w-[700px] h-[700px] rounded-full blur-[140px] opacity-25 animate-float-fast"
        style="background: radial-gradient(circle, #f0fdf4 0%, #dcfce7 50%, transparent 70%); bottom: -10%; left: 30%;"
      ></div>
      
      <!-- Gradient orb 4 - Warm Peach -->
      <div 
        class="absolute w-[500px] h-[500px] rounded-full blur-[110px] opacity-30 animate-pulse-slow"
        style="background: radial-gradient(circle, #fff7ed 0%, #ffedd5 50%, transparent 70%); bottom: 20%; right: 20%;"
      ></div>
    </div>

    <!-- Content -->
    <div class="relative z-10">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <!-- Header -->
        <div class="max-w-2xl mx-auto text-center mb-16">
          <HostProfile class="mb-8 justify-center" />
          <h1 class="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight mb-4">Выберите тип события</h1>
          <p class="text-slate-500 text-lg">Нажмите на карточку, чтобы открыть календарь и выбрать удобный слот.</p>
        </div>
        
        <!-- Loading -->
        <div v-if="isLoading" class="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div v-for="n in 2" :key="n" class="h-48 bg-white/40 animate-pulse rounded-[32px]"></div>
        </div>
        
        <!-- Error -->
        <div v-else-if="error" class="max-w-md mx-auto text-center py-16 bg-white/70 backdrop-blur-xl rounded-[32px] border border-white/50 shadow-xl">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <p class="text-red-500 mb-4 font-medium">{{ error }}</p>
          <button
            @click="loadEventTypes"
            class="px-6 py-3 bg-gradient-to-r from-indigo-400 to-purple-400 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300"
          >
            Попробовать снова
          </button>
        </div>
        
        <!-- Event types grid -->
        <div v-else class="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
          <button
            v-for="eventType in eventTypes"
            :key="eventType.id"
            @click="selectEventType(eventType)"
            class="group text-left bg-white/70 backdrop-blur-xl rounded-[32px] border border-white/60 shadow-lg shadow-slate-200/50 p-8 hover:bg-white/90 hover:shadow-xl hover:shadow-indigo-200/30 hover:border-indigo-200/50 transition-all duration-300 ease-out hover:-translate-y-2 cursor-pointer"
          >
            <div class="flex items-start justify-between mb-5">
              <div class="w-14 h-14 rounded-[20px] bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center group-hover:from-indigo-200 group-hover:to-purple-200 transition-all duration-300">
                <svg class="w-7 h-7 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <span class="px-4 py-1.5 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-xs font-semibold rounded-full">
                {{ eventType.durationMinutes === 15 ? '15 мин' : '30 мин' }}
              </span>
            </div>
            <h3 class="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors duration-300">{{ eventType.title }}</h3>
            <p class="text-slate-500 text-sm leading-relaxed line-clamp-2">{{ eventType.description }}</p>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes float-slow {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.05); }
  66% { transform: translate(-20px, 20px) scale(0.95); }
}

@keyframes float-medium {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-25px, 25px) scale(1.08); }
  66% { transform: translate(25px, -15px) scale(0.92); }
}

@keyframes float-fast {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(20px, -20px) scale(1.1); }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.25; transform: scale(1); }
  50% { opacity: 0.35; transform: scale(1.05); }
}

.animate-float-slow {
  animation: float-slow 25s ease-in-out infinite;
}

.animate-float-medium {
  animation: float-medium 18s ease-in-out infinite;
}

.animate-float-fast {
  animation: float-fast 12s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 10s ease-in-out infinite;
}
</style>
