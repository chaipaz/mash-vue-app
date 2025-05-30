<template>
  <v-dialog 
    :model-value="props.modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    max-width="600"
  >
    <v-card>
      <v-card-title>Game Instructions</v-card-title>
      <v-card-text>
        <p>MASH is a fun fortune-telling game! You'll choose several options for categories like:</p>
        <ul>
          
          <li>Where you'll live (Mansion, Apartment, Shack, House)</li>
          <li>Who you'll marry</li>
          <li>Your job, car, and more!</li>
        </ul>
        <p>The game will eliminate options until only one in each category remains!</p>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="$emit('update:modelValue', false)">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  // import { defineEmits, defineProps } from 'vue'

  const props = defineProps<{ modelValue: boolean }>()
  const emit = defineEmits(['update:modelValue'])
</script>
