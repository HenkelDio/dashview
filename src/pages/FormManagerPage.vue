<template>
  <q-page class="q-pa-md q-pt-xl">
    <div class="flex justify-between align-center">
      <div class="text-h5 page-title q-mb-xl">Formulários</div>
      <q-btn
        no-caps
        label="Criar novo formulário"
        color="primary"
        class="inter-bold"
        size="1rem"
        style="height: 40px"
        unelevated
        @click="$router.push('/create-form')"
      />
    </div>

    <FormCreatedCard
      title="Formulário de avaliação de desempenho"
      description="Formulário para avaliação de desempenho dos colaboradores"
      link="/form/performance-evaluation"
    />
  </q-page>
</template>

<script lang="ts" setup>
import FormCreatedCard from 'src/components/FormCreatedCard.vue';
</script>
