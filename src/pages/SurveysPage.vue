<template>
  <q-page class="q-pa-md q-pt-xl">
    <div class="text-h5 page-title">Pesquisas</div>
    <div class="q-mt-xl flex q-gutter-md">
      <div v-for="item in modules" :key="item.title">
        <ModuleCard
          :title="item.title"
          :description="item.description"
          :link="item.link"
          :icon="item.icon"
        />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import ModuleCard from 'src/components/ModuleCard.vue';
import { ref } from 'vue';

const modules = ref([
  {
    title: 'Net Promoter Score',
    description: 'Visualize e envie formulários de NPS aos pacientes.',
    link: '/nps-hub',
    icon: 'fact_check',
  },
  {
    title: 'Canal do colaborador',
    description: 'Gerencie experiências e respostas dos colaboradores.',
    link: '/rh-hub',
    icon: 'folder_shared',
  },
  {
    title: 'Clientes em prospecção',
    description: 'Visualize o que é importante na experiencia dos pacientes.',
    link: '/prospecting',
    icon: 'person_search',
  },
  {
    title: 'Experiência/Notificação',
    description:
      'Gerencie notificações e experiências do corpo clínico e colaboradores.',
    link: '/notification-hub',
    icon: 'badge',
  },
]);
</script>
