<template>
  <q-page class="q-pa-md">
    <q-btn
      dense
      icon="chevron_left"
      flat
      class="q-mb-lg"
      @click="$router.back()"
      >Voltar</q-btn
    >
    <div class="text-h5 page-title">Net Promoter Score</div>
    <div class="q-mt-xl flex q-gutter-md">
      <div v-for="item in modules" :key="item.title">
        <ModuleCard
          :title="item.title"
          :description="item.description"
          :link="item.link"
          :icon="item.icon"
          :permission="item.permission"
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
    title: 'Dashbord',
    description: 'Visualize gráficos e a contagem de respostas NPS.',
    link: '/dashboard-nps',
    icon: 'analytics',
    permission: 'viewDashboard',
  },
  {
    title: 'Envio de NPS',
    description: 'Envie o formuário de NPS aos pacientes por e-mail.',
    link: '/nps',
    icon: 'schedule_send',
    permission: 'sendNps',
  },
  {
    title: 'Respostas',
    description: 'Visualize as respostas dos pacientes e outras informações.',
    link: '/answers',
    icon: 'chat',
    permission: 'viewAnswers',
  },
  {
    title: 'Relatórios',
    description: 'Gere relatórios por período e analise os dados.',
    link: '/report',
    icon: 'assignment_turned_in',
    permission: 'viewNpsReport',
  },
  {
    title: 'Departamentos',
    description: 'Crie e edita departamentos para as perguntas do NPS.',
    link: '/departments',
    icon: 'apartment',
    permission: 'viewAndEditDepartments',
  },
]);
</script>
