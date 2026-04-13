import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { formatDateForApi, dayjs } from './src/utils/date.js'

// Mock data
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

function generateMockSlots(eventTypeId, date, durationMinutes) {
  const slots = []
  const baseDate = dayjs(date).startOf('day')
  
  for (let hour = 9; hour < 18; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const startTime = baseDate.add(hour, 'hour').add(minute, 'minute')
      const endTime = startTime.add(durationMinutes, 'minute')
      
      if (endTime.hour() >= 18 && endTime.minute() > 0) continue
      
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

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'api-mocks',
      configureServer(server) {
        server.middlewares.use('/api/event-types', (req, res, next) => {
          if (req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(mockEventTypes))
          } else {
            next()
          }
        })
        
        server.middlewares.use('/api/slots', (req, res, next) => {
          if (req.method === 'GET') {
            const url = new URL(req.url, `http://${req.headers.host}`)
            const eventTypeId = url.searchParams.get('eventTypeId')
            const date = url.searchParams.get('date')
            
            const eventType = mockEventTypes.find(et => et.id === eventTypeId)
            const durationMinutes = eventType?.durationMinutes || 15
            
            const slots = generateMockSlots(eventTypeId, date, durationMinutes)
            
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(slots))
          } else {
            next()
          }
        })
        
        server.middlewares.use('/api/bookings', (req, res, next) => {
          if (req.method === 'POST') {
            let body = ''
            req.on('data', chunk => body += chunk)
            req.on('end', () => {
              // Simulate occasional conflict (10% chance)
              if (Math.random() < 0.1) {
                res.statusCode = 409
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ 
                  error: 'Conflict',
                  message: 'Это время только что заняли, выберите другое'
                }))
                return
              }
              
              const data = JSON.parse(body)
              res.statusCode = 201
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({
                id: 'booking-' + Date.now(),
                eventTypeId: data.eventTypeId,
                startsAt: data.startsAt,
                guestName: data.guestName,
                guestEmail: data.guestEmail,
                comment: data.comment
              }))
            })
          } else {
            next()
          }
        })
      }
    }
  ],
  root: '.',
  build: {
    outDir: '../backend/public/dist',
    emptyOutDir: true,
    rollupOptions: {
      input: './index.html'
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
