import axios from 'axios'

// Create axios instance
const client = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

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

// Response interceptor for error handling
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error

    // Handle 409 Conflict (slot already booked or duplicate title)
    if (response?.status === 409) {
      const conflictError = new Error(response.data?.message || 'Это время только что заняли, выберите другое')
      conflictError.code = 'SLOT_CONFLICT'
      conflictError.status = 409
      conflictError.data = response.data
      throw conflictError
    }

    // Handle 422 Validation Error
    if (response?.status === 422) {
      const validationError = new Error('Ошибка валидации данных')
      validationError.code = 'VALIDATION_ERROR'
      validationError.errors = response.data?.errors || response.data?.message
      throw validationError
    }

    // Handle 400 Bad Request (duplicate title)
    if (response?.status === 400) {
      const duplicateError = new Error(response.data?.message || 'Тип события с таким названием уже существует')
      duplicateError.code = 'DUPLICATE_TITLE'
      duplicateError.status = 400
      duplicateError.data = response.data
      throw duplicateError
    }

    // Handle other errors (4xx, 5xx)
    if (response) {
      const apiError = new Error(response.data?.message || 'Ошибка сервера')
      apiError.code = response.status >= 500 ? 'SERVER_ERROR' : 'API_ERROR'
      apiError.status = response.status
      apiError.data = response.data
      throw apiError
    }

    // Network error (no response)
    const networkError = new Error('Сетевой сбой. Проверьте подключение к интернету или доступность сервера.')
    networkError.code = 'NETWORK_ERROR'
    throw networkError
  }
)

export default client
