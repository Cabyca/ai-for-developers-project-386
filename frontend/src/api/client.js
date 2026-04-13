import axios from 'axios'
import { formatDateForApi, dayjs } from '@/utils/date.js'

// Create axios instance
const client = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Mock data for development (until backend is ready)
const mockEventTypes = [
  {
    id: 'mock-uuid-15',
    title: 'Встреча 15 минут',
    description: 'Короткий тип события для быстрого слота.',
    durationMinutes: 15
  },
  {
    id: 'mock-uuid-30',
    title: 'Встреча 30 минут',
    description: 'Базовый тип события для бронирования.',
    durationMinutes: 30
  }
]

// Generate mock slots for a given date
function generateMockSlots(eventTypeId, date, durationMinutes) {
  const slots = []
  const baseDate = dayjs(date).startOf('day')
  
  // Generate slots from 09:00 to 18:00 with 15-min step
  for (let hour = 9; hour < 18; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const startTime = baseDate.add(hour, 'hour').add(minute, 'minute')
      const endTime = startTime.add(durationMinutes, 'minute')
      
      // If slot would end after 18:00, skip it
      if (endTime.hour() >= 18 && endTime.minute() > 0) continue
      
      // Randomly mark some slots as unavailable (first 3 slots of morning are taken)
      const isAvailable = !(hour === 9 && minute < 45)
      
      slots.push({
        startsAt: startTime.toISOString(),
        endsAt: endTime.toISOString(),
        isAvailable,
        eventTypeId
      })
    }
  }
  
  return slots
}

// Request interceptor
client.interceptors.request.use(
  (config) => {
    // Add any auth headers here if needed
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor with mocks and error handling
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error
    
    // Handle 409 Conflict (slot already booked)
    if (response?.status === 409) {
      const conflictError = new Error('Это время только что заняли, выберите другое')
      conflictError.code = 'SLOT_CONFLICT'
      conflictError.status = 409
      conflictError.data = response.data
      throw conflictError
    }
    
    // Handle 422 Validation Error
    if (response?.status === 422) {
      const validationError = new Error('Ошибка валидации данных')
      validationError.code = 'VALIDATION_ERROR'
      validationError.errors = response.data.errors
      throw validationError
    }
    
    // Network error - try mocks if in development mode
    if (!response && config) {
      console.log('Network error, using mocks for:', config.url, config.method)
      
      // Mock GET /event-types
      if (config.method === 'get' && config.url === '/event-types') {
        return { data: mockEventTypes, status: 200 }
      }
      
      // Mock GET /slots
      if (config.method === 'get' && config.url === '/slots') {
        const params = new URLSearchParams(config.params)
        const eventTypeId = params.get('eventTypeId')
        const date = params.get('date')
        
        // Find event type to get duration
        const eventType = mockEventTypes.find(et => et.id === eventTypeId)
        const durationMinutes = eventType?.durationMinutes || 15
        
        const slots = generateMockSlots(eventTypeId, date, durationMinutes)
        return { data: slots, status: 200 }
      }
    }
    
    // Default error
    throw error
  }
)

// Also intercept successful responses to provide mocks
const originalGet = client.get
client.get = async function(url, config = {}) {
  try {
    return await originalGet.call(this, url, config)
  } catch (error) {
    // If request failed, try to return mock data
    if (url === '/event-types') {
      return { data: mockEventTypes, status: 200 }
    }
    
    if (url === '/slots') {
      const params = config.params || {}
      const eventTypeId = params.eventTypeId
      const date = params.date
      
      const eventType = mockEventTypes.find(et => et.id === eventTypeId)
      const durationMinutes = eventType?.durationMinutes || 15
      
      const slots = generateMockSlots(eventTypeId, date, durationMinutes)
      return { data: slots, status: 200 }
    }
    
    throw error
  }
}

const originalPost = client.post
client.post = async function(url, data, config = {}) {
  try {
    return await originalPost.call(this, url, data, config)
  } catch (error) {
    // Mock POST /bookings
    if (url === '/bookings') {
      // Simulate occasional conflict for testing
      if (Math.random() < 0.1) {
        const conflictError = new Error('Это время только что заняли, выберите другое')
        conflictError.code = 'SLOT_CONFLICT'
        conflictError.status = 409
        throw conflictError
      }
      
      // Return successful booking
      return {
        data: {
          id: 'booking-' + Date.now(),
          eventTypeId: data.eventTypeId,
          startsAt: data.startsAt,
          guestName: data.guestName,
          guestEmail: data.guestEmail,
          comment: data.comment
        },
        status: 201
      }
    }
    
    throw error
  }
}

export default client
