import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Course-ify' }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/course/:id',
      name: 'Course',
      component: () => import('../views/CourseView.vue'),
      props: true,
    },
    {
      path: '/backendTest',
      name: 'backendTest',
      component: () => import('../views/BackendTestView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/UsersView.vue'),
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/UsersView.vue'),
    }
  ],
});

export default router;
