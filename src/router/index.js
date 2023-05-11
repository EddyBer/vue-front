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
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../vues/Signup.vue')
  }
]

export const Router = createRouter({
  history: createWebHistory(),
  routes
})

// export default Router