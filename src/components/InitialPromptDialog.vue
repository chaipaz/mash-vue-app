<template>
  <v-dialog v-model="modelValue" persistent max-width="500">
    <v-card>
      <v-card-title class="text-h6">Welcome to MASH</v-card-title>
      <v-card-title class="text-h6">
        {{ isLastStep ? 'Draw your Magic Number...' : `Please enter options for: ${currentCategoryName}` }}
      </v-card-title>

      <v-card-text>
        <div v-if="!isLastStep">
          <v-text-field
            v-for="(_, index) in currentOptions"
            :key="index"
            v-model="currentOptions[index]"
            :label="`Option ${index + 1}`"
            :rules="[requiredRule]"
            clearable
            dense
          />
        </div>

        <div v-else class="text-center">
          <p>Click the button to generate your magic number and reveal your future...</p>
            <v-btn
                color="yellow darken-3"
                class="mt-4"
                icon
                size="x-large"
                @click="handleGenerate"
              >
                <v-icon size="40">mdi-star</v-icon>
              </v-btn>
        </div>
      </v-card-text>

      <v-card-actions v-if="!isLastStep">
        <v-spacer />
        <v-btn
          color="primary"
          @click="submitCategory"
          :disabled="!allOptionsFilled"
        >
          Next
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

const modelValue = defineModel<boolean>()

const props = defineProps<{
  categories: string[]
}>()

const emit = defineEmits<{
  (e: 'submit-and-generate'): void
  (e: 'category-submitted', payload: { name: string; options: string[] }): void
}>()

const currentIndex = ref(0)
const currentOptions = ref(['', '', '', ''])

const currentCategoryName = computed(() => props.categories[currentIndex.value] || '')

const isLastStep = computed(() => currentIndex.value >= props.categories.length)

const allOptionsFilled = computed(() =>
  currentOptions.value.every(opt => opt.trim() !== '')
)

const requiredRule = (v: string) => !!v || 'This field is required'

const submitCategory = () => {
  const name = props.categories[currentIndex.value]
  emit('category-submitted', { name, options: [...currentOptions.value] })

  currentIndex.value++

  if (!isLastStep.value) {
    currentOptions.value = ['', '', '', '']
  }
}

const handleGenerate = () => {
  emit('submit-and-generate')
  modelValue.value = false
}
</script>

<style scoped>
  .v-btn--icon {
    transition: transform 0.2s ease-in-out;
  }
  .v-btn--icon:hover {
    transform: scale(1.1);
    box-shadow: 0 0 12px gold;
  }
</style>
