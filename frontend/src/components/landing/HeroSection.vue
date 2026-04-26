<script setup>
import CTAButton from './CTAButton.vue'
</script>

<template>
  <section class="relative overflow-hidden">
    <!-- Gradient background -->
    <div class="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50"></div>
    
    <!-- Content -->
    <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
      <div class="text-center">
        <!-- Badge -->
        <span class="inline-flex items-center px-4 py-2 bg-white rounded-full text-sm font-medium text-slate-600 mb-8 shadow-sm border border-slate-100">
          <span class="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
          БЫСТРАЯ ЗАПИСЬ НА ЗВОНОК
        </span>
        
        <!-- Main heading -->
        <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight mb-6 leading-[1.1]">
          Календарь звонков
        </h1>
        
        <!-- Subtitle -->
        <p class="text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
          Забронируйте встречу за минуту: выберите тип события и удобное время.
        </p>
        
        <!-- CTA Button -->
        <CTAButton to="/book">
          Записаться
        </CTAButton>
      </div>
      
      <!-- Features card slot -->
      <div class="mt-16">
        <slot name="features">
          <!-- FeaturesCard will be inserted here -->
        </slot>
      </div>
    </div>
  </section>
</template>
