import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/tourism/:category',
      name: 'TourismList',
      component: () => import('@/features/tourism/views/TourismListView.vue'),
      props: true,
    },
    {
      path: '/tourism/:category/:id',
      name: 'TourismDetail',
      component: () => import('@/features/tourism/views/SpotDetailView.vue'),
      props: true,
    },
    {
      path: '/community',
      name: 'CommunityList',
      component: () => import('@/features/community/views/CommunityListView.vue'),
    },
    {
      path: '/community/write',
      name: 'PostWrite',
      component: () => import('@/features/community/views/PostWriteView.vue'),
    },
    {
      path: '/community/:id/edit',
      name: 'PostEdit',
      component: () => import('@/features/community/views/PostWriteView.vue'),
      props: true,
    },
    {
      path: '/community/:id',
      name: 'PostDetail',
      component: () => import('@/features/community/views/PostDetailView.vue'),
      props: true,
    },
    {
      path: '/privacy',
      name: 'Privacy',
      component: () => import('@/views/StaticPageView.vue'),
      props: { title: 'Privacy Policy' },
    },
    {
      path: '/terms',
      name: 'Terms',
      component: () => import('@/views/StaticPageView.vue'),
      props: { title: 'Terms of Service' },
    },
    {
      path: '/contact',
      name: 'Contact',
      component: () => import('@/views/StaticPageView.vue'),
      props: { title: 'Contact Us' },
    },
  ],
})

export default router
