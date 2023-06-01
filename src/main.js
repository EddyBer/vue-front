import './assets/main.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
const vuetify = createVuetify({
  components,
  directives,
})

import { createApp } from 'vue'
import { Router } from './router/index.js'
import App from './App.vue'

createApp(App)
    .use(Router)
    .use(vuetify)
    .mount('#app')

