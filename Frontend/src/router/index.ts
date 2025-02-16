import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    // {
    //   path: '/course',
    //   name: 'Course',
    //   component: () => import('../views/CourseView.vue'),
    // },
    {
      path: '/course/:id',
      name: 'Course',
      component: () => import('../views/CourseView.vue'),
      props: true,
    }
  ],
});

export default router;
