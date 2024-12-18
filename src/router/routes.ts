import { useUserStore } from 'src/stores/userStore';
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    // beforeEnter: (_to, _from, next) => {
    //   const store = useUserStore();
    //   if (store.$state.isAuthenticated) {
    //     next();
    //   } else {
    //     next({ path: '/' });
    //   }
    // },
    children: [
      { path: '', component: () => import('pages/DashboardPage.vue') },
    ],
  },
  {
    path: '/dashboard-admin',
    component: () => import('layouts/MainLayout.vue'),
    // beforeEnter: (_to, _from, next) => {
    //   const store = useUserStore();
    //   if (store.$state.isAuthenticated) {
    //     next();
    //   } else {
    //     next({ path: '/' });
    //   }
    // },
    children: [
      { path: '', component: () => import('pages/AdminDashboardPage.vue') },
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
    path: '/perspectives',
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
      { path: '', component: () => import('pages/PerspectivesPage.vue') },
    ],
  },
  {
    path: '/nps',
    beforeEnter: (_to, _from, next) => {
      const store = useUserStore();
      if (store.$state.isAuthenticated) {
        next();
      } else {
        next({ path: '/' });
      }
    },
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/NpsPage.vue') }],
  },

  {
    path: '/form',
    props: (route) => ({ token: route.query.token }),
    children: [{ path: '', component: () => import('pages/FormPage.vue') }],
  },

  {
    path: '/modules',
    beforeEnter: (_to, _from, next) => {
      const store = useUserStore();
      if (store.$state.isAuthenticated) {
        next();
      } else {
        next({ path: '/' });
      }
    },
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/ModulesPage.vue') }],
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
    path: '/preferences-details',
    props: (route) => ({ id: route.query.id }),
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
      { path: '', component: () => import('pages/PerspectiveDetailsPage.vue') },
    ],
  },
  {
    path: '/processes',
    props: (route) => ({ id: route.query.id }),
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
      { path: '', component: () => import('pages/ProcessesPage.vue') },
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
    props: (route) => ({ id: route.query.id }),
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
