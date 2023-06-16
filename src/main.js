import './assets/main.css'
import '@mdi/font/css/materialdesignicons.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'


const vuetify = createVuetify({
  components,
  directives,
  icons:{
    defaultSet:'mdi',
    aliases,
    sets:{
      mdi,
    }
  }
})

import { createApp } from 'vue'
import { Router } from './router/index.js'
import { createPinia } from 'pinia'
import App from './App.vue'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App)
    .use(Router)
    .use(pinia)
    .use(vuetify)
    .mount('#app')