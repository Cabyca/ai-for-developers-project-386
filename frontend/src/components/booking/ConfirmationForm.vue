<script setup>
import { ref, watch, computed } from 'vue'

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
  },
  // Validation state from parent
  nameError: {
    type: String,
    default: null
  },
  emailError: {
    type: String,
    default: null
  }
})

const emit = defineEmits([
  'update:guestName',
  'update:guestEmail',
  'update:comment',
  'blur:guestName',
  'blur:guestEmail',
  'submit'
])

// Local form state
const form = ref({
  name: props.guestName,
  email: props.guestEmail,
  comment: props.comment
})

// Track if user has interacted with fields
const hasInteracted = ref({
  name: false,
  email: false
})

// Sync with parent
watch(() => props.guestName, (val) => { form.value.name = val })
watch(() => props.guestEmail, (val) => { form.value.email = val })
watch(() => props.comment, (val) => { form.value.comment = val })

watch(() => form.value.name, (val) => emit('update:guestName', val))
watch(() => form.value.email, (val) => emit('update:guestEmail', val))
watch(() => form.value.comment, (val) => emit('update:comment', val))

// Computed validation state
const showNameError = computed(() => hasInteracted.value.name && props.nameError)
const showEmailError = computed(() => hasInteracted.value.email && props.emailError)

// Input classes based on validation state
const getInputClasses = (hasError) => {
  const baseClasses = 'w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors'
  if (hasError) {
    return `${baseClasses} border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50`
  }
  return `${baseClasses} border-gray-300 focus:ring-orange-500 focus:border-orange-500`
}

const handleBlur = (field) => {
  hasInteracted.value[field] = true
  if (field === 'name') emit('blur:guestName')
  if (field === 'email') emit('blur:guestEmail')
}

const handleSubmit = () => {
  // Mark all fields as interacted on submit attempt
  hasInteracted.value.name = true
  hasInteracted.value.email = true
  emit('submit')
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Имя <span class="text-red-500">*</span>
      </label>
      <input
        v-model="form.name"
        type="text"
        required
        maxlength="100"
        :class="getInputClasses(showNameError)"
        placeholder="Введите ваше имя"
        @blur="handleBlur('name')"
      />
      <p v-if="showNameError" class="mt-1 text-sm text-red-600">
        {{ nameError }}
      </p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Email <span class="text-red-500">*</span>
      </label>
      <input
        v-model="form.email"
        type="email"
        required
        maxlength="100"
        :class="getInputClasses(showEmailError)"
        placeholder="your@email.com"
        @blur="handleBlur('email')"
      />
      <p v-if="showEmailError" class="mt-1 text-sm text-red-600">
        {{ emailError }}
      </p>
      <p v-else class="mt-1 text-sm text-gray-500">
        Формат: user@example.com
      </p>
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
