import { useUserStore } from 'src/stores/userStore';
import { NavigationGuardNext, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    // beforeEnter: (_to, _from, next) => {
    //   const store = useUserStore();
    //   if (store.$state.isAuthenticated) {
    //     next();
    //   } else {
    //     next({ path: '/' });
    //   }
    // },
    children: [{ path: '', component: () => import('pages/HomePage.vue') }],
  },

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
      {
        path: '/report',
        component: () => import('pages/ReportPage.vue'),
      },
      {
        path: '/report-by-question',
        component: () => import('pages/ReportAllQuestionPage.vue'),
      },
    ],
  },

  {
    path: '/rh',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        beforeEnter: (_to, _from, next) => {
          handleAcessRoute(next, 'moduleRh');
        },
        component: () => import('pages/RhDashboardPage.vue'),
      },
      {
        path: '/answers-rh',
        props: (route) => ({
          sortBy: route.query.sortBy,
          npsId: route.query.npsId,
        }),
        beforeEnter: (_to, _from, next) => {
          handleAcessRoute(next, 'moduleRh');
        },
        component: () => import('pages/RhAnswersFormPage.vue'),
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
        path: '/rh-qr-code',
        props: (route) => ({
          sortBy: route.query.sortBy,
          npsId: route.query.npsId,
        }),
        component: () => import('pages/RhQRCodePage.vue'),
      },
      {
        path: '/report',
        component: () => import('pages/ReportPage.vue'),
      },
      {
        path: '/report-by-question',
        component: () => import('pages/ReportAllQuestionPage.vue'),
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
    props: (route) => ({ token: route.query.token, type: route.query.type }),
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
    path: '/prospecting',
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
      { path: '', component: () => import('pages/ProspectingHub.vue') },
    ],
  },

  {
    path: '/notification-hub',
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
      { path: '', component: () => import('pages/NotificationHub.vue') },
    ],
  },

  {
    path: '/surveys',
    beforeEnter: (_to, _from, next) => {
      const store = useUserStore();
      if (store.$state.isAuthenticated) {
        next();
      } else {
        next({ path: '/' });
      }
    },
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/SurveysPage.vue') }],
  },

  {
    path: '/nps-hub',
    beforeEnter: (_to, _from, next) => {
      const store = useUserStore();
      if (store.$state.isAuthenticated) {
        next();
      } else {
        next({ path: '/' });
      }
    },
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/NpsHub.vue') }],
  },

  {
    path: '/rh-hub',
    beforeEnter: (_to, _from, next) => {
      const store = useUserStore();
      if (store.$state.isAuthenticated) {
        next();
      } else {
        next({ path: '/' });
      }
    },
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/RhHub.vue') }],
  },

  {
    path: '/prospecting-answers',
    props: (route) => ({ type: route.query.type }),
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
      {
        path: '',
        component: () => import('pages/ProspectingAnswersFormPage.vue'),
      },
    ],
  },

  {
    path: '/notification-answers',
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
      {
        path: '',
        component: () => import('pages/NotificationAnswersFormPage.vue'),
      },
    ],
  },

  {
    path: '/qr-codes',
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
      {
        path: '',
        component: () => import('pages/QRCodesPage.vue'),
      },
    ],
  },

  {
    path: '/notification-dashboard',
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
      {
        path: '',
        component: () => import('pages/NotificationDashboardPage.vue'),
      },
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
  | 'viewAndEditDepartments'
  | 'moduleNps'
  | 'moduleRh';

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
