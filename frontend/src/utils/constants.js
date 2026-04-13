// Business rules constants for the booking calendar
export const BUSINESS_RULES = {
  // Window: 14 days from today only
  DAYS_AHEAD: 14,
  
  // Days: Weekdays only (Mon-Fri)
  WEEKEND_DAYS: [0, 6], // 0 = Sunday, 6 = Saturday
  
  // Hours: 09:00–18:00
  WORKING_HOURS_START: 9,
  WORKING_HOURS_END: 18,
  
  // Slot step: 15 or 30 minutes (from EventType.durationMinutes)
  SLOT_STEP_MINUTES: 15,
  
  // Available duration options
  DURATION_OPTIONS: [15, 30]
}

// UI constants
export const UI_CONSTANTS = {
  // Animation durations
  FADE_DURATION: 200, // ms
  
  // Calendar display
  MONTHS_PER_PAGE: 1,
  DAYS_IN_WEEK: 7,
  
  // Skeleton counts
  SKELETON_DAYS_COUNT: 10,
  SKELETON_SLOTS_COUNT: 6
}

// API endpoints
export const API_ENDPOINTS = {
  EVENT_TYPES: '/event-types',
  SLOTS: '/slots',
  BOOKINGS: '/bookings'
}
