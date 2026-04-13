<script setup>
const features = [
  'Выбор типа события и удобного времени для встречи.',
  'Быстрое бронирование с подтверждением и дополнительными заметками.',
  'Управление типами встреч и просмотр предстоящих записей в админке.'
]
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
    <h3 class="text-xl font-semibold text-gray-900 mb-6">
      Возможности
    </h3>
    
    <ul class="space-y-4">
      <li
        v-for="(feature, index) in features"
        :key="index"
        class="flex items-start"
      >
        <span class="text-orange-500 mr-2 mt-1">•</span>
        <span class="text-gray-600 leading-relaxed">{{ feature }}</span>
      </li>
    </ul>
  </div>
</template>
