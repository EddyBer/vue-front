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
  },
  {
    path:'/home',
    name:'Home',
    component: () => import('../vues/Home.vue')
  },
  {
    path:'/clients',
    name:'Clients',
    component: () => import('../vues/Clients.vue')
  },
  {
    path:'/invoices',
    name:'Invoices',
    component: () => import('../vues/Invoices.vue')
  }
]

export const Router = createRouter({
  history: createWebHistory(),
  routes
})
