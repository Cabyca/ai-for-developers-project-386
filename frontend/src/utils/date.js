import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import localeData from 'dayjs/plugin/localeData'
import 'dayjs/locale/ru'

// Extend dayjs with plugins
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.extend(localeData)
dayjs.locale('ru')

import { BUSINESS_RULES } from './constants.js'

/**
 * Generate working days (Mon-Fri) for the next 14 calendar days
 * Returns approximately 10 working days
 * @returns {Date[]} Array of Date objects
 */
export function generateWorkingDays() {
  const days = []
  let current = dayjs().startOf('day')
  const maxDate = current.add(BUSINESS_RULES.DAYS_AHEAD, 'day')
  
  while (current.isBefore(maxDate, 'day')) {
    const dayOfWeek = current.day()
    
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (!BUSINESS_RULES.WEEKEND_DAYS.includes(dayOfWeek)) {
      days.push(current.toDate())
    }
    
    current = current.add(1, 'day')
    
    // Safety break
    if (current.diff(dayjs().startOf('day'), 'day') > 30) break
  }
  
  return days
}

/**
 * Generate full month calendar grid including padding days
 * @param {Date} monthDate - Any date within the target month
 * @returns {Array<{date: Date | null, isPadding: boolean, isWeekend: boolean}>}
 */
export function generateMonthGrid(monthDate) {
  const startOfMonth = dayjs(monthDate).startOf('month')
  const endOfMonth = dayjs(monthDate).endOf('month')
  const startDayOfWeek = startOfMonth.day() // 0 = Sunday
  
  const days = []
  
  // Add padding days from previous month
  const daysFromPrevMonth = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1
  for (let i = daysFromPrevMonth; i > 0; i--) {
    days.push({
      date: null,
      isPadding: true,
      isWeekend: false
    })
  }
  
  // Add actual month days
  let current = startOfMonth.clone()
  while (current.isSameOrBefore(endOfMonth, 'day')) {
    const dayOfWeek = current.day()
    days.push({
      date: current.toDate(),
      isPadding: false,
      isWeekend: BUSINESS_RULES.WEEKEND_DAYS.includes(dayOfWeek)
    })
    current = current.add(1, 'day')
  }
  
  return days
}

/**
 * Format date for API (ISO 8601 Date format: YYYY-MM-DD)
 * @param {Date} date
 * @returns {string}
 */
export function formatDateForApi(date) {
  return dayjs(date).format('YYYY-MM-DD')
}

/**
 * Format date for display (e.g., "вторник, 31 марта")
 * @param {Date} date
 * @returns {string}
 */
export function formatDateDisplay(date) {
  return dayjs(date).format('dddd, D MMMM')
}

/**
 * Format date for calendar header (e.g., "март 2026 г.")
 * @param {Date} date
 * @returns {string}
 */
export function formatMonthHeader(date) {
  return dayjs(date).format('MMMM YYYY г.')
}

/**
 * Format time slot range (e.g., "09:00 - 09:15")
 * @param {string} startsAt - ISO datetime string
 * @param {string} endsAt - ISO datetime string
 * @returns {string}
 */
export function formatTimeSlot(startsAt, endsAt) {
  const start = dayjs(startsAt).format('HH:mm')
  const end = dayjs(endsAt).format('HH:mm')
  return `${start} - ${end}`
}

/**
 * Format short weekday name (e.g., "Пн", "Вт")
 * @param {number} dayIndex - 0 = Monday, 6 = Sunday
 * @returns {string}
 */
export function getShortWeekdayName(dayIndex) {
  const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
  return weekdays[dayIndex]
}

/**
 * Check if date is within the booking window (14 days from today)
 * @param {Date} date
 * @returns {boolean}
 */
export function isWithinBookingWindow(date) {
  const today = dayjs().startOf('day')
  const maxDate = today.add(BUSINESS_RULES.DAYS_AHEAD, 'day')
  const checkDate = dayjs(date).startOf('day')
  
  return checkDate.isSameOrAfter(today, 'day') && 
         checkDate.isBefore(maxDate, 'day') &&
         !BUSINESS_RULES.WEEKEND_DAYS.includes(checkDate.day())
}

/**
 * Check if two dates are the same day
 * @param {Date} date1
 * @param {Date} date2
 * @returns {boolean}
 */
export function isSameDay(date1, date2) {
  if (!date1 || !date2) return false
  return dayjs(date1).isSame(dayjs(date2), 'day')
}

/**
 * Navigate to previous month
 * @param {Date} currentMonth
 * @returns {Date}
 */
export function getPreviousMonth(currentMonth) {
  return dayjs(currentMonth).subtract(1, 'month').toDate()
}

/**
 * Navigate to next month
 * @param {Date} currentMonth
 * @returns {Date}
 */
export function getNextMonth(currentMonth) {
  return dayjs(currentMonth).add(1, 'month').toDate()
}

export { dayjs }
