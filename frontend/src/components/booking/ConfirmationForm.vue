<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  guestName: {
    type: String,
    default: ''
  },
  guestEmail: {
    type: String,
    default: ''
  },
  comment: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:guestName', 'update:guestEmail', 'update:comment', 'submit'])

// Local form state
const form = ref({
  name: props.guestName,
  email: props.guestEmail,
  comment: props.comment
})

// Sync with parent
watch(() => form.value.name, (val) => emit('update:guestName', val))
watch(() => form.value.email, (val) => emit('update:guestEmail', val))
watch(() => form.value.comment, (val) => emit('update:comment', val))

const handleSubmit = () => {
  emit('submit')
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Имя
      </label>
      <input
        v-model="form.name"
        type="text"
        required
        maxlength="100"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
        placeholder="Введите ваше имя"
      />
    </div>
    
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Email
      </label>
      <input
        v-model="form.email"
        type="email"
        required
        maxlength="100"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
        placeholder="your@email.com"
      />
    </div>
    
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Комментарий (опционально)
      </label>
      <textarea
        v-model="form.comment"
        rows="3"
        maxlength="500"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
        placeholder="Дополнительная информация..."
      ></textarea>
    </div>
  </form>
</template>
