<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import HostProfile from '../components/event-type/HostProfile.vue'
import { listEventTypes } from '../api/endpoints/eventTypes.js'
import { useBookingState } from '../composables/useBookingState.js'

const router = useRouter()
const { setEventType } = useBookingState()

const eventTypes = ref([])
const isLoading = ref(true)
const error = ref(null)

const loadEventTypes = async () => {
  try {
    isLoading.value = true
    error.value = null
    const data = await listEventTypes()
    eventTypes.value = data
  } catch (err) {
    error.value = 'Не удалось загрузить типы событий'
  } finally {
    isLoading.value = false
  }
}

const selectEventType = (eventType) => {
  setEventType(eventType)
  router.push('/book/calendar')
}

onMounted(loadEventTypes)
</script>

<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- Fluid Background -->
    <div class="fixed inset-0 z-0 pointer-events-none">
      <!-- Base gradient -->
      <div class="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50"></div>
      
      <!-- Gradient orb 1 - Soft Blue -->
      <div 
        class="absolute w-[900px] h-[900px] rounded-full blur-[150px] opacity-40 animate-float-slow"
        style="background: radial-gradient(circle, #e0e7ff 0%, #c7d2fe 50%, transparent 70%); top: -30%; left: -20%;"
      ></div>
      
      <!-- Gradient orb 2 - Soft Pink -->
      <div 
        class="absolute w-[700px] h-[700px] rounded-full blur-[130px] opacity-35 animate-float-medium"
        style="background: radial-gradient(circle, #fae8ff 0%, #f5d0fe 50%, transparent 70%); top: 10%; right: -15%;"
      ></div>
      
      <!-- Gradient orb 3 - Soft Mint -->
      <div 
        class="absolute w-[800px] h-[800px] rounded-full blur-[140px] opacity-25 animate-float-fast"
        style="background: radial-gradient(circle, #f0fdf4 0%, #dcfce7 50%, transparent 70%); bottom: -20%; left: 10%;"
      ></div>
      
      <!-- Gradient orb 4 - Warm Peach with pulse -->
      <div 
        class="absolute w-[600px] h-[600px] rounded-full blur-[110px] opacity-30 animate-pulse"
        style="background: radial-gradient(circle, #fff7ed 0%, #ffedd5 50%, transparent 70%); bottom: 10%; right: 15%;"
      ></div>
      
      <!-- Subtle grid pattern -->
      <div class="absolute inset-0 opacity-[0.015]" style="background-image: linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px); background-size: 60px 60px;"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10">
      <!-- Hero Section -->
      <section class="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto text-center">
          <!-- Floating badge -->
          <div class="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-xl rounded-full text-sm font-medium text-slate-600 mb-8 shadow-sm border border-white/50 hover:bg-white/80 transition-all duration-300">
            <span class="w-2 h-2 bg-indigo-400 rounded-full mr-2 animate-pulse"></span>
            Бронирование встреч
          </div>
          
          <!-- Main heading -->
          <h1 class="text-6xl md:text-7xl lg:text-8xl font-bold text-slate-800 tracking-tight mb-6 leading-tight">
            Календарь<br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-purple-600">звонков</span>
          </h1>
          
          <!-- Subtitle -->
          <p class="text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            Забронируйте встречу за минуту. Выберите тип события и удобное время для созвона.
          </p>
          
          <!-- CTA Button -->
          <button
            @click="$router.push('/book')"
            class="group relative inline-flex items-center px-10 py-5 bg-gradient-to-r from-indigo-400 to-purple-400 text-white font-semibold text-lg rounded-full shadow-xl shadow-indigo-500/25 hover:shadow-2xl hover:shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all duration-300 ease-out"
          >
            <span class="relative z-10">Начать бронирование</span>
            <svg class="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
            <span class="absolute inset-0 rounded-full animate-ping opacity-30 bg-indigo-400"></span>
          </button>
        </div>
      </section>

      <!-- Event Types Section -->
      <section class="py-24 px-4 sm:px-6 lg:px-8">
        <div class="max-w-5xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight mb-4">Выберите тип встречи</h2>
            <p class="text-slate-500 text-lg">Каждый тип оптимизирован под разные задачи и форматы общения</p>
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
              class="group text-left bg-white/70 backdrop-blur-xl rounded-[32px] border border-white/60 shadow-lg shadow-slate-200/50 p-8 hover:bg-white/90 hover:shadow-xl hover:shadow-indigo-200/30 hover:border-indigo-200/50 transition-all duration-300 ease-out hover:-translate-y-2"
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
      </section>

      <!-- How it works section -->
      <section class="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div class="max-w-5xl mx-auto">
          <div class="bg-white/60 backdrop-blur-2xl rounded-[40px] border border-white/70 shadow-2xl shadow-slate-200/30 p-10 md:p-16">
            <h2 class="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight mb-12 text-center">Как это работает</h2>
            <div class="grid md:grid-cols-3 gap-10">
              <div class="flex flex-col items-center text-center group">
                <div class="w-20 h-20 rounded-[24px] bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-5 shadow-lg shadow-indigo-200/50 group-hover:shadow-2xl group-hover:shadow-indigo-300/50 group-hover:scale-110 transition-all duration-500">
                  <span class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">1</span>
                </div>
                <h3 class="font-bold text-slate-800 mb-2">Выберите тип</h3>
                <p class="text-slate-500 text-sm leading-relaxed">15 или 30 минут — подходит для разных задач</p>
              </div>
              <div class="flex flex-col items-center text-center group">
                <div class="w-20 h-20 rounded-[24px] bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-5 shadow-lg shadow-purple-200/50 group-hover:shadow-2xl group-hover:shadow-purple-300/50 group-hover:scale-110 transition-all duration-500">
                  <span class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">2</span>
                </div>
                <h3 class="font-bold text-slate-800 mb-2">Найдите время</h3>
                <p class="text-slate-500 text-sm leading-relaxed">Будни 9:00–18:00, ближайшие 14 дней</p>
              </div>
              <div class="flex flex-col items-center text-center group">
                <div class="w-20 h-20 rounded-[24px] bg-gradient-to-br from-pink-100 to-indigo-100 flex items-center justify-center mb-5 shadow-lg shadow-pink-200/50 group-hover:shadow-2xl group-hover:shadow-pink-300/50 group-hover:scale-110 transition-all duration-500">
                  <span class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-indigo-500">3</span>
                </div>
                <h3 class="font-bold text-slate-800 mb-2">Подтвердите</h3>
                <p class="text-slate-500 text-sm leading-relaxed">Введите данные и получите подтверждение</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-5xl mx-auto text-center">
          <p class="text-slate-400 text-sm">© 2024 Календарь звонков. Простое бронирование встреч.</p>
        </div>
      </footer>
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
  animation: float-slow 20s ease-in-out infinite;
}

.animate-float-medium {
  animation: float-medium 15s ease-in-out infinite;
}

.animate-float-fast {
  animation: float-fast 10s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 8s ease-in-out infinite;
}
</style>
