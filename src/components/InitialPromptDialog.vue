<template>
  <v-dialog v-model="visible" persistent max-width="500">
    <v-card>
        <v-card-title class="text-h6">Welcome to MASH</v-card-title>
        <v-card-title class="text-h6">
          Please enter options for: {{ currentCategoryName }}
        </v-card-title>

        <v-card-text>
          <v-text-field
            v-for="(_, index) in currentOptions"
            :key="index"
            v-model="currentOptions[index]"
            :label="`Option ${index + 1}`"
            :rules="[requiredRule]"
            clearable
            dense
          />
        </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="submitCategory" :disabled="!allOptionsFilled">Next</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { ref, computed, watch } from 'vue'

  const props = defineProps<{
    modelValue: boolean
    categories: string[]
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', val: boolean): void
    (e: 'category-submitted', payload: { name: string; options: string[] }): void
  }>()

  const visible = ref(props.modelValue)
  const currentIndex = ref(0)
  const currentOptions = ref(['', '', '', ''])

  watch(() => props.modelValue, (val) => {
    visible.value = val
  })

  watch(visible, (val) => {
    emit('update:modelValue', val)
  })

  const currentCategoryName = computed(() => props.categories[currentIndex.value] || '')

  const submitCategory = () => {
    const name = props.categories[currentIndex.value]
    emit('category-submitted', { name, options: [...currentOptions.value] })

    currentIndex.value++

    if (currentIndex.value >= props.categories.length) {
      emit('update:modelValue', false) // Close dialog after last category
    } else {
      currentOptions.value = ['', '', '', '']
    }
  }

  const allOptionsFilled = computed(() => 
    currentOptions.value.every(opt => opt.trim() !== '')
  )

  const requiredRule = (v: string) => !!v || 'This field is required'
</script>
