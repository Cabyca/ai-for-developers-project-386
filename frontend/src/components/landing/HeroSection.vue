<script setup>
import CTAButton from './CTAButton.vue'
</script>

<template>
  <section class="relative overflow-hidden">
    <!-- Gradient background -->
    <div class="absolute inset-0 bg-gradient-to-r from-blue-100 via-blue-50 to-orange-50"></div>
    
    <!-- Content -->
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Left column: Text content -->
        <div>
          <span class="inline-block px-4 py-1.5 bg-white rounded-full text-sm font-medium text-gray-600 mb-6">
            БЫСТРАЯ ЗАПИСЬ НА ЗВОНОК
          </span>
          
          <h1 class="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Calendar
          </h1>
          
          <p class="text-xl text-gray-600 mb-8 leading-relaxed">
            Забронируйте встречу за минуту: выберите тип события и удобное время.
          </p>
          
          <CTAButton to="/book">
            Записаться
          </CTAButton>
        </div>
        
        <!-- Right column: Features card -->
        <div class="lg:pl-8">
          <slot name="features">
            <!-- FeaturesCard will be inserted here -->
          </slot>
        </div>
      </div>
    </div>
  </section>
</template>
