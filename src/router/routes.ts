import { useUserStore } from 'src/stores/userStore';
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: (_to, _from, next) => {
      const store = useUserStore();
      if (store.$state.isAuthenticated) {
        next();
      } else {
        next({ path: '/' });
      }
    },
    children: [
      { path: '', component: () => import('pages/DashboardPage.vue') },
    ],
  },
  {
    path: '/users',
    beforeEnter: (_to, _from, next) => {
      const store = useUserStore();
      if (store.$state.isAuthenticated) {
        next();
      } else {
        next({ path: '/' });
      }
    },
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/UsersPage.vue') }],
  },
  {
    path: '/departments',
    beforeEnter: (_to, _from, next) => {
      const store = useUserStore();
      if (store.$state.isAuthenticated) {
        next();
      } else {
        next({ path: '/' });
      }
    },
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/DepartmentsPage.vue') },
    ],
  },
  {
    path: '/preferences',
    beforeEnter: (_to, _from, next) => {
      const store = useUserStore();
      if (store.$state.isAuthenticated) {
        next();
      } else {
        next({ path: '/' });
      }
    },
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/PreferencesPage.vue') },
    ],
  },
  {
    path: '/list-charts',
    beforeEnter: (_to, _from, next) => {
      const store = useUserStore();
      if (store.$state.isAuthenticated) {
        next();
      } else {
        next({ path: '/' });
      }
    },
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/ListChartsPage.vue') },
    ],
  },

  {
    path: '/create-chart',
    beforeEnter: (_to, _from, next) => {
      const store = useUserStore();
      if (store.$state.isAuthenticated) {
        next();
      } else {
        next({ path: '/' });
      }
    },
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/CreateNewChartPage.vue') },
    ],
  },

  {
    path: '/',
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },

  {
    path: '/define-password',
    props: (route) => ({ token: route.query.token }),
    children: [
      { path: '', component: () => import('pages/DefinePasswordPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
