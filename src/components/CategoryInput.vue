<template>
  <div>
    <h3 class="text-h6 mb-2">{{ title }}</h3>
    <v-text-field
      v-for="(option, i) in modelValue"
      :key="i"
      :label="`${title} Option ${i + 1}`"
      :model-value="option"
      :readonly="readonly"
      :class="{
        'eliminated': eliminated?.has(option),
        'winner-highlight': option === winner,
        'font-weight-bold': option === highlight,
        // 'font-weight-bold': isHighlighted(title, option),
      }"
      class="mb-2"
      hide-details
      @update:modelValue="(val) => updateOption(i, val)"
    />
  </div>
</template>

<script lang="ts" setup>

  const props = defineProps<{
    modelValue: string[]
    title: string
    readonly: boolean
    eliminated?: Set<string>
    winner?: string
    highlight?: string | null
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string[]): void
  }>()

  const updateOption = (index: number, value: string) => {
    const newOptions = [...props.modelValue]
    newOptions[index] = value
    emit('update:modelValue', newOptions)
  }
</script>

<style scoped>
.eliminated {
  text-decoration: line-through;
  transition: text-decoration 0.6s ease-in-out, color 0.6s ease-in-out;
  background: #FF9999;
  animation: handStrike 1.0s forwards;
}

@keyframes handStrike {
  from {
    text-decoration-color: transparent;
  }
  to {
    text-decoration-color: #f3bbb7;
  }
}

.winner-highlight {
  font-weight: bold;
  color: #4caf50 !important;
}

.font-weight-bold {
  font-weight: 900;           /* Use the heaviest weight */
  color: #1976d2;             /* A strong primary blue color */
  background-color: #e3f2fd;  /* Light blue background */
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 0 4px rgba(25, 118, 210, 0.5);
}
</style>
