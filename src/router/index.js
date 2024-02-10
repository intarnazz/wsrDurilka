import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/page/PageHome.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
  ]
})

export default router
