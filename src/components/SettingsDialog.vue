<template>
  <v-dialog 
    :model-value="props.modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    max-width="600"
  >
    <v-card>
      <v-card-title>Game Settings</v-card-title>
      <v-alert type="info" color="deep-purple lighten-2" dense>
        The first category is always <strong>MASH</strong> and cannot be changed.
      </v-alert>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6">
            <v-select
              v-model="numCategories"
              :items="[4,5, 6]"
              label="Number of Categories"
              dense
            />
          </v-col>

          <v-col cols="12" sm="6">
            <v-select
              v-model="numOptions"
              :items="[4,5,6]"
              label="Number of options per Category."
              dense
            />
          </v-col>
        </v-row>

        <div v-for="(category, index) in categorySettings" :key="index" class="mt-4">
          <v-row align="center">
            <v-col cols="6">
              <v-select
                v-model="category.selected"
                :items="presetCategories"
                label="Select Category"
                dense
                clearable
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="category.custom"
                label="Or Enter Custom Category"
                dense
                clearable
              />
            </v-col>
          </v-row>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="cancel">Cancel</v-btn>
        <v-btn color="primary" @click="saveSettings">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue'
  // @ts-ignore
  import presetCategories from '@/assets/presetCategories.json'

  const props = defineProps<{ 
    modelValue: boolean
    initialNumCategories: number
    initialNumOptions: number
    initialCategories: string[]     
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', val: boolean): void
    (e: 'save-settings', settings: {
      numCategories: number,
      numOptions: number,
      categories: string[]
    }): void
  }>()

  const internalVisible = ref(props.modelValue)
  const numCategories = ref(props.initialNumCategories)
  const numOptions = ref(props.initialNumOptions)

  // Structure for each category setting
  interface CategorySetting {
    selected: string | null
    custom: string
  }

  // Initialize category settings with initialCategories or empty
  const categorySettings = ref<CategorySetting[]>([])

  const resetCategorySettings = () => {
    categorySettings.value = []
    for (let i = 0; i < numCategories.value - 1; i++) {
      categorySettings.value.push({
        selected: props.initialCategories[i + 1] || null,
        custom: ''
      })
    }
  }

  // Initialize on mount and when number of categories changes
  resetCategorySettings()

  watch(numCategories, () => {
    resetCategorySettings()
  })

  watch(() => props.modelValue, (val) => {
    internalVisible.value = val
    if (val) {
      // Reset settings when modal opens
      numCategories.value = props.initialNumCategories
      numOptions.value = props.initialNumOptions
      resetCategorySettings()
    }
  })

  watch(internalVisible, val => {
    emit('update:modelValue', val)
  })

  const saveSettings = () => {
    const categories = categorySettings.value
      .map(cat => cat.custom.trim() || cat.selected || '')
      .filter(cat => cat !== '')

    if (categories.length < numCategories.value - 1) {
      alert('Please fill all category names or select them from dropdown')
      return
    }

    emit('save-settings', {
      numCategories: numCategories.value,
      numOptions: numOptions.value,
      categories,
    })

    internalVisible.value = false
  }

  const cancel = () => {
    internalVisible.value = false
  }
</script>

<style scoped>
  /* Add spacing between category inputs */
  .v-row {
    margin-bottom: 12px;
  }  
</style>
