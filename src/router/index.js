import { createRouter, createWebHistory } from 'vue-router'
import Login from '../vues/Login.vue'
import { useAuthStore } from '@/stores/auth';

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
  },
  {
    path:'/projects',
    name:'Projects',
    component: () => import('../vues/Projects.vue')
  },
  {
    path:'/profile',
    name:'My profile',
    component: () => import('../vues/Profile.vue')
  },
  {
    path:'/logout',
    name:'Déconnexion',
    component: Login
  }
]

export const Router = createRouter({
  history: createWebHistory(),
  routes
})

Router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if(to.fullPath == '/logout') {
    authStore.logout();
    next({
      path: '/',
      params: { nextUrl: to.fullPath }
    })
  } else if (to.fullPath != '/' && to.fullPath != '/signup') {
    if(!authStore.accessToken) {
      next({
        path: '/',
        params: { nextUrl: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next()
  }
})

