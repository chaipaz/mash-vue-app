<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title>M.A.S.H. Game</v-toolbar-title>
    <v-spacer></v-spacer>

    <!-- Instructions Button -->
    <v-btn icon @click="$emit('show-instructions')" title="Instructions">
      <v-icon>mdi-help-circle</v-icon>
    </v-btn>

    <!-- Settings Button -->
    <v-btn icon @click="$emit('show-settings')" title="Settings">
      <v-icon>mdi-cog</v-icon>
    </v-btn>
  </v-app-bar>
</template>
