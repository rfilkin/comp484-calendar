import { createRouter, createWebHistory } from 'vue-router'
//import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Calendar',
    component: () => import( '../views/Calendar.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component:  () => import( '../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component:  () => import( '../views/Register.vue')
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: () => import('../views/Calendar.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router