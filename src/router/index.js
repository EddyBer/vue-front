import { createRouter, createWebHistory } from 'vue-router'
import Login from '../vues/Login.vue'
const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('../vues/Signup.vue')
  }
]

export const Router = createRouter({
  history: createWebHistory(),
  routes
})
