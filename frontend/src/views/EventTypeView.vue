<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import HostProfile from '../components/event-type/HostProfile.vue'
import EventTypeCard from '../components/event-type/EventTypeCard.vue'
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
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Header -->
    <div class="max-w-4xl mx-auto mb-8">
      <HostProfile class="mb-6" />
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Выберите тип события</h1>
      <p class="text-gray-500">Нажмите на карточку, чтобы открыть календарь и выбрать удобный слот.</p>
    </div>
    
    <!-- Loading -->
    <div v-if="isLoading" class="max-w-4xl mx-auto grid md:grid-cols-2 gap-4">
      <div v-for="n in 2" :key="n" class="h-32 bg-gray-200 animate-pulse rounded-xl"></div>
    </div>
    
    <!-- Error -->
    <div v-else-if="error" class="max-w-4xl mx-auto text-center py-12">
      <p class="text-red-500 mb-4">{{ error }}</p>
      <button
        @click="loadEventTypes"
        class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
      >
        Попробовать снова
      </button>
    </div>
    
    <!-- Event types -->
    <div v-else class="max-w-4xl mx-auto grid md:grid-cols-2 gap-4">
      <EventTypeCard
        v-for="eventType in eventTypes"
        :key="eventType.id"
        :event-type="eventType"
        @select="selectEventType"
      />
    </div>
  </div>
</template>
