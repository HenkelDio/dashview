<template>
  <q-page class="q-pa-md q-pt-xl">
    <div class="text-h5 page-title">Módulos</div>
    <div class="q-mt-xl flex q-gutter-md">

      <div v-for="item in modules" :key="item.title">
        <ModuleCard
          :title="item.title"
          :description="item.description"
          :link="item.link"
        />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import ModuleCard from 'src/components/ModuleCard.vue';
import { ref } from 'vue';

const modules = ref([
  {title: 'Departamentos', description: 'Crie e edite departamentos', link: '/departments'},
  {title: 'Perspectivas', description: 'Crie e edite perspectivas', link: '/perspectives'},
  {title: 'Processos', description: 'Crie e edite processos', link: '/processes'},
])

</script>
