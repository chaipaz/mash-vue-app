// main.ts
import { createApp } from 'vue'
import App from './App.vue'


import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles/main.sass'

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
  },
  components,
  directives,
})

createApp(App).use(vuetify).mount('#app')
