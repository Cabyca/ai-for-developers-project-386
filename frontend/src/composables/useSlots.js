import { ref, computed, watch } from 'vue'
import { getSlots } from '@/api/endpoints/slots.js'
import { formatDateForApi } from '@/utils/date.js'

export function useSlots(eventTypeId, selectedDate) {
  // Reactive state
  const slots = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  
  // Simple cache: Map<`${eventTypeId}_${date}`, Slot[]>
  const cache = new Map()
  
  // Computed
  const availableSlots = computed(() => 
    slots.value.filter(slot => slot.isAvailable)
  )
  
  const unavailableSlots = computed(() =>
    slots.value.filter(slot => !slot.isAvailable)
  )
  
  // Load slots from API or cache
  const loadSlots = async () => {
    // Validate prerequisites
    if (!eventTypeId.value || !selectedDate.value) {
      slots.value = []
      return
    }
    
    const dateStr = formatDateForApi(selectedDate.value)
    const cacheKey = `${eventTypeId.value}_${dateStr}`
    
    // Check cache first
    if (cache.has(cacheKey)) {
      slots.value = cache.get(cacheKey)
      return
    }
    
    // Fetch from API
    isLoading.value = true
    error.value = null
    
    try {
      const data = await getSlots(eventTypeId.value, dateStr)
      slots.value = data
      cache.set(cacheKey, data)
    } catch (err) {
      error.value = err.message || 'Не удалось загрузить слоты'
      slots.value = []
    } finally {
      isLoading.value = false
    }
  }
  
  // Force refresh (bypass cache)
  const refreshSlots = async () => {
    const dateStr = formatDateForApi(selectedDate.value)
    const cacheKey = `${eventTypeId.value}_${dateStr}`
    cache.delete(cacheKey)
    await loadSlots()
  }
  
  // Clear cache for specific date (e.g., after booking)
  const invalidateCache = (date) => {
    if (!date) {
      cache.clear()
    } else {
      const dateStr = formatDateForApi(date)
      // Remove all cache entries for this date
      for (const key of cache.keys()) {
        if (key.endsWith(`_${dateStr}`)) {
          cache.delete(key)
        }
      }
    }
  }
  
  // Auto-load when eventType or date changes
  watch([eventTypeId, selectedDate], loadSlots, { immediate: true })
  
  return {
    // State
    slots: computed(() => slots.value),
    availableSlots,
    unavailableSlots,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    
    // Methods
    loadSlots,
    refreshSlots,
    invalidateCache
  }
}
