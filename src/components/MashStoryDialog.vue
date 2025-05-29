<template>
  <v-card class="pa-4 mb-6" v-if="story">
    <v-card-title class="text-h5">🧙‍♂️ Your MASH Story</v-card-title>
    <v-card-text class="white-space-pre-line text-body-1">
      {{ props.story }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
const props = defineProps<{
  story: string | null
}>()
</script>

<style scoped>
.white-space-pre-line {
  white-space: pre-line;
}
</style>
