import Vue from 'vue';
import VueRouter from 'vue-router';
import AuthPage from '@/views/AuthPage.vue';
import ChatPage from '@/views/ChatPage.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: AuthPage,
  },
  {
    path: '/chat',
    name: 'Chat',
    component: ChatPage,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const authToken = localStorage.getItem('authToken');

  if (to.meta.requiresAuth && !authToken) {
    next('/');
  } else {
    next(); 
  }
});

export default router;