<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title>M.A.S.H. Game</v-toolbar-title>
    <v-spacer></v-spacer>

    <v-menu>
      <template #activator="{ props }">
        <v-btn icon v-bind="props">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item @click="$emit('show-instructions')">
          <v-list-item-title>Instructions</v-list-item-title>
        </v-list-item>
        <v-list-item @click="$emit('show-settings')">
          <v-list-item-title>Settings</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>