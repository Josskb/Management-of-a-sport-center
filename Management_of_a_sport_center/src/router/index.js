import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import AboutUs from '../views/AboutUs.vue';
import Contact from '../views/Contact.vue';
import Reservation from '../views/Reservation.vue';
import Account from '../views/Account.vue';
import SignIn from '../views/SignIn.vue';
import LogIn from '../views/LogIn.vue';
import Admin from '../views/Admin.vue';
import eventBus from '../eventBus';

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: AboutUs },
  { path: '/contact', component: Contact },
  { path: '/reservation', component: Reservation },
  { path: '/account', component: Account, meta: { requiresAuth: true } },
  { path: '/signin', component: SignIn },
  { path: '/login', component: LogIn },
  { path: '/admin', component: Admin, meta: { requiresAuth: true, requiresAdmin: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!eventBus.isLoggedIn) {
      next('/login');
    } else if (to.matched.some(record => record.meta.requiresAdmin) && !eventBus.isAdmin) {
      next('/account');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;