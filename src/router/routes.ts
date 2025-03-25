import { useUserStore } from 'src/stores/userStore';
import { NavigationGuardNext, RouteRecordRaw } from 'vue-router';

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
      handleAcessRoute(next, 'viewAndEditUsers');
    },
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/UsersPage.vue') }],
  },
  {
    path: '/departments',
    beforeEnter: (_to, _from, next) => {
      handleAcessRoute(next, 'viewAndEditDepartments');
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
    path: '/dashboard-nps',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: (_to, _from, next) => {
      handleAcessRoute(next, 'viewDashboard');
    },
    children: [
      { path: '', component: () => import('pages/NpsDashboardPage.vue') },
    ],
  },
  {
    path: '/nps',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        beforeEnter: (_to, _from, next) => {
          handleAcessRoute(next, 'sendNps');
        },
        component: () => import('pages/NpsPage.vue'),
      },
      {
        path: '/answers',
        props: (route) => ({
          sortBy: route.query.sortBy,
          npsId: route.query.npsId,
        }),
        beforeEnter: (_to, _from, next) => {
          handleAcessRoute(next, 'viewAnswers');
        },
        component: () => import('pages/AnswersFormPage.vue'),
      },
      {
        path: '/general-view',
        props: (route) => ({
          sortBy: route.query.sortBy,
          npsId: route.query.npsId,
        }),
        component: () => import('pages/ViewGeneralAnswersPage.vue'),
      },
      {
        path: '/qr-code',
        props: (route) => ({
          sortBy: route.query.sortBy,
          npsId: route.query.npsId,
        }),
        component: () => import('pages/QRCodePage.vue'),
      },
    ],
  },

  {
    path: '/create-form',
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
      { path: '', component: () => import('pages/CreateFormPage.vue') },
    ],
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
    path: '/not-allowed',
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
      { path: '', component: () => import('pages/NotAllowedAccessPage.vue') },
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

type PermissionType =
  | 'firstLogin'
  | 'sendNps'
  | 'viewAnswers'
  | 'viewDashboard'
  | 'viewAndEditUsers'
  | 'viewAndEditDepartments';

function handleAcessRoute(
  next: NavigationGuardNext,
  permissionType: PermissionType
) {
  const store = useUserStore();

  if (!store.$state.isAuthenticated) {
    console.log('Não está autenticado');
    return next({ path: '/' }); // ⬅ Retorna imediatamente
  }

  if (store.$state.user.permissions[permissionType]) {
    return next(); // ⬅ Retorna imediatamente
  }

  return next({ path: '/not-allowed' }); // ⬅ Garante que só será chamado uma vez
}

export default routes;
