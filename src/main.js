import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap/dist/js/bootstrap.js'

import { createApp } from 'vue'
import { Router } from './router/index.js'
import App from './App.vue'
// import { ValidationProvider, ValidationObserver } from '@/vee-validate.ts'

createApp(App)
    .use(Router)
    .mount('#app')
    // .component('ValidationProvider', ValidationProvider)
    // .component('ValidationObserver', ValidationObserver)

