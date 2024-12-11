import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'wallets-view',
      component: () => import('../views/WalletsView.vue'),
    },
  ],
})

export default router
