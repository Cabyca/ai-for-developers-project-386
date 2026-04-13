<script setup>
import HeroSection from '../components/landing/HeroSection.vue'
import FeaturesCard from '../components/landing/FeaturesCard.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <HeroSection>
      <template #features>
        <FeaturesCard />
      </template>
    </HeroSection>
    
    <!-- Additional info section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-white rounded-2xl p-8 border border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Как это работает</h2>
        <div class="grid md:grid-cols-3 gap-6">
          <div class="flex items-start space-x-3">
            <div class="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-semibold">1</div>
            <div>
              <h3 class="font-semibold text-gray-900">Выберите тип</h3>
              <p class="text-gray-500 text-sm">15 или 30 минут — подходит для разных задач</p>
            </div>
          </div>
          <div class="flex items-start space-x-3">
            <div class="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-semibold">2</div>
            <div>
              <h3 class="font-semibold text-gray-900">Найдите время</h3>
              <p class="text-gray-500 text-sm">Будни 9:00–18:00, ближайшие 14 дней</p>
            </div>
          </div>
          <div class="flex items-start space-x-3">
            <div class="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-semibold">3</div>
            <div>
              <h3 class="font-semibold text-gray-900">Подтвердите</h3>
              <p class="text-gray-500 text-sm">Введите данные и получите подтверждение</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
