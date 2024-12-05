import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import AboutUs from '../views/AboutUs.vue';
import Contact from '../views/Contact.vue';
import Reservation from '../views/Reservation.vue';
import Account from '../views/Account.vue';
import SignIn from '../views/SignIn.vue';
import LogIn from '../views/LogIn.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: AboutUs },
  { path: '/contact', component: Contact },
  { path: '/reservation', component: Reservation },
  { path: '/account', component: Account },
  { path: '/signin', component: SignIn },
  { path: '/login', component: LogIn },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;