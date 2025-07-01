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
    <div class="text-h5 page-title">Clientes em prospecção</div>
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
    title: 'Respostas',
    description: 'Gerencie as expêriências e respostas dos pacientes.',
    link: '/prospecting-answers',
    icon: 'chat',
  },
]);
</script>
