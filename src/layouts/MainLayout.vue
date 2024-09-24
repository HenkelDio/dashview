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
          <q-avatar color="primary" text-color="white">W</q-avatar>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <div class="text-h5 text-center q-my-md q-mb-lg">
        <q-img
          src="../assets/logo.svg"
          width="30%"
        />
      </div>
      <div class="flex column justify-between" style="height: 80%">
        <q-list>
          <EssentialLink
            v-for="link in linksList"
            :key="link.title"
            v-bind="link"
          />
        </q-list>
        <div class="text-center text-caption inter-medium">Versão 1.0.0</div>
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

defineOptions({
  name: 'MainLayout',
});

const linksList: EssentialLinkProps[] = [
  {
    title: 'Dashboard',
    caption: 'Visualizar gráficos',
    icon: 'insert_chart',
    link: '/dashboard',
  },
  {
    title: 'Novo gráfico',
    caption: 'Criar novo gráfico',
    icon: 'add_chart',
    link: '/create',
  },
  {
    title: 'Usuários',
    caption: 'Editar usuários',
    icon: 'group',
    link: '/users',
  },
  {
    title: 'Preferências',
    caption: 'Edite seu perfil',
    icon: 'manage_accounts',
    link: '/preferences',
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
