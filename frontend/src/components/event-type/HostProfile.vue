<script setup>
defineProps({
  name: {
    type: String,
    default: 'Tota'
  },
  role: {
    type: String,
    default: 'Host'
  },
  avatarUrl: {
    type: String,
    default: null
  }
})
</script>

<template>
  <div class="flex items-center space-x-3">
    <!-- Avatar -->
    <div class="w-12 h-12 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center text-white font-semibold text-lg">
      <template v-if="avatarUrl">
        <img
          :src="avatarUrl"
          :alt="name"
          class="w-full h-full rounded-full object-cover"
        />
      </template>
      <template v-else>
        {{ name.charAt(0).toUpperCase() }}
      </template>
    </div>
    
    <!-- Info -->
    <div>
      <h4 class="font-semibold text-gray-900">{{ name }}</h4>
      <p class="text-sm text-gray-500">{{ role }}</p>
    </div>
  </div>
</template>
