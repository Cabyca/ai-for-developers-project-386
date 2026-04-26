<script setup>
import { computed } from 'vue'
import CalendarDay from './CalendarDay.vue'
import SkeletonDay from '../ui/SkeletonDay.vue'

const props = defineProps({
  weekdays: {
    type: Array,
    required: true
  },
  days: {
    type: Array,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select'])

// Group days into weeks (rows of 7)
const weeks = computed(() => {
  const weeks = []
  for (let i = 0; i < props.days.length; i += 7) {
    weeks.push(props.days.slice(i, i + 7))
  }
  return weeks
})

const handleDaySelect = (date) => {
  emit('select', date)
}
</script>

<template>
  <div>
    <!-- Weekday headers -->
    <div class="grid grid-cols-7 gap-1 mb-3">
      <div
        v-for="day in weekdays"
        :key="day"
        class="text-center text-xs font-semibold text-slate-500 py-2 uppercase tracking-wider"
      >
        {{ day }}
      </div>
    </div>
    
    <!-- Loading state -->
    <div v-if="isLoading" class="grid grid-cols-7 gap-1">
      <SkeletonDay v-for="n in 28" :key="n" />
    </div>
    
    <!-- Calendar grid -->
    <div v-else class="space-y-1">
      <div
        v-for="(week, weekIndex) in weeks"
        :key="weekIndex"
        class="grid grid-cols-7 gap-1"
      >
        <CalendarDay
          v-for="(day, dayIndex) in week"
          :key="`${weekIndex}-${dayIndex}`"
          :day="day"
          @select="handleDaySelect"
        />
      </div>
    </div>
  </div>
</template>
