<template>
  <v-dialog v-model="modelValue" max-width="400">
    <v-card class="pa-4 text-center">
      <h2 class="text-h6 mb-4">Ready to see your magic number?</h2>
      <v-btn color="success" @click="confirm">Generate!</v-btn>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const modelValue = defineModel<boolean>()
const emit = defineEmits<{ (e: 'confirmed'): void }>()

const confirm = () => {
  emit('confirmed')
  modelValue.value = false
}
</script>
