<template>
  <q-layout view="lHh Lpr lFf" class="inter">
    <q-header class="bg-white">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="text-black"
        />

        <q-toolbar-title> </q-toolbar-title>

        <div>
          <q-btn flat>
            <q-avatar color="primary" text-color="white">{{
              name.charAt(0).toUpperCase()
            }}</q-avatar>
            <q-menu
              transition-show="jump-down"
              transition-hide="jump-up"
              style="width: 200px"
            >
              <q-list style="min-width: 100px">
                <q-item clickable>
                  <q-item-section>{{ name }}</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable>
                  <q-item-section>
                    <q-btn flat @click="logout()">Sair</q-btn>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <GreetingsDialog
      v-if="showGreetingsDialog"
      @close="showGreetingsDialog = false"
      :name="name"
    />

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <div class="text-h5 text-center q-my-md q-mb-lg">
        <q-img src="../assets/logo.png" width="60%" />
      </div>
      <div
        class="flex column justify-between"
        style="height: auto; overflow-y: auto"
      >
        <q-list>
          <div v-for="link in linksList" :key="link.title">
            <!-- Mostrar todas as abas para 'admin' ou abas sem 'security' -->
            <EssentialLink
              v-bind="link"
              v-if="hasPermission(link.permission)"
            />
          </div>
        </q-list>
        <div class="text-center text-caption inter-medium absolute-bottom">
          Versão 1.6.0
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <div style="background-color: #f4f6f8">
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink, {
  EssentialLinkProps,
} from 'components/EssentialLink.vue';
import { useUserStore } from 'src/stores/userStore';
import { useRouter } from 'vue-router';
import GreetingsDialog from 'src/components/Dialogs/GreetingsDialog.vue';

defineOptions({
  name: 'MainLayout',
});

const router = useRouter();

const userStore = useUserStore();
const name = ref(userStore.$state.user.name);

const linksList: EssentialLinkProps[] = [
  {
    title: 'NPS',
    caption: 'Gerenciamento de NPS',
    icon: 'fact_check',
    link: '/nps',
    permission: 'moduleNps',
    children: [
      {
        title: 'Dashboard',
        link: '/dashboard-nps',
        icon: 'analytics',
        permission: 'viewDashboard',
      },
      {
        title: 'Envio de NPS',
        link: '/nps',
        icon: 'schedule_send',
        permission: 'sendNps',
      },
      {
        title: 'Respostas',
        link: '/answers',
        icon: 'chat',
        permission: 'viewAnswers',
      },
      {
        title: 'QR Code',
        link: '/qr-code',
        icon: 'qr_code',
      },
      {
        title: 'Relatórios',
        link: '/report',
        icon: 'data_usage',
      },
    ],
  },
  {
    title: 'RH',
    caption: 'Peguntas RH',
    icon: 'folder_shared',
    link: '/rh',
    permission: 'moduleRh',
    children: [
      {
        title: 'Dashboard',
        link: '/rh',
        icon: 'analytics',
      },
      {
        title: 'Respostas',
        link: '/answers-rh',
        icon: 'chat',
      },
      {
        title: 'QR Code',
        link: '/rh-qr-code',
        icon: 'qr_code',
      },
    ],
  },
  {
    title: 'Usuários',
    caption: 'Editar usuários',
    icon: 'group',
    link: '/users',
    security: 'admin',
    permission: 'viewAndEditUsers',
  },
  {
    title: 'Departamentos',
    caption: 'Editar departamentos',
    icon: 'apartment',
    link: '/departments',
    security: 'admin',
    permission: 'viewAndEditDepartments',
  },
  {
    title: 'Preferências',
    caption: 'Edite seu perfil',
    icon: 'manage_accounts',
    link: '/preferences',
  },
];

const showGreetingsDialog = ref(
  userStore.$state.user.permissions
    ? userStore.$state.user.permissions.firstLogin
    : false
);

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function hasPermission(permission?: string): boolean {
  if (!permission) return true;
  const permissions = userStore.$state.user.permissions || {};
  return (permissions as Record<string, boolean>)[permission] === true;
}

function logout() {
  const state = useUserStore();
  state.clearUser();
  router.push({ path: '/' });
}
</script>
