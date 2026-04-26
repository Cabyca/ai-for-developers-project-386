<script setup>
const features = [
  'Выбор типа события и удобного времени для встречи.',
  'Быстрое бронирование с подтверждением и дополнительными заметками.',
  'Управление типами встреч и просмотр предстоящих записей в админке.'
]
</script>

<template>
  <div class="bg-white rounded-[24px] border border-slate-200/50 shadow-sm p-8 md:p-10">
    <h3 class="text-2xl font-bold text-slate-900 tracking-tight mb-8">
      Возможности
    </h3>
    
    <div class="grid md:grid-cols-3 gap-8">
      <div
        v-for="(feature, index) in features"
        :key="index"
        class="flex flex-col"
      >
        <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
          <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <p class="text-slate-500 text-sm leading-relaxed">{{ feature }}</p>
      </div>
    </div>
  </div>
</template>
