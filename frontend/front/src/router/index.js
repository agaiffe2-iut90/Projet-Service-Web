import Vue from 'vue'
import VueRouter from 'vue-router'
import AuthPage from '@/views/AuthPage.vue'
import HomePage from '@/views/HomePage.vue'


Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/auth',
      name: 'Auth',
      component: AuthPage,
    },
    {
      path: '/home',
      name: 'Home',
      component: HomePage,
      meta: {
        requiresAuth: true,
      }
    },
      {
        path: '/',
        redirect: '/auth',
      }
  ]
});


export default router;
