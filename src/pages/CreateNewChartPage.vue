<template>
  <q-page class="q-pa-md q-pt-xl">
    <q-btn
      dense
      icon="chevron_left"
      flat
      class="q-mb-lg"
      @click="$router.back()"
      >Voltar</q-btn
    >
    <div class="text-h5 page-title">Criar novo gráfico</div>

    <q-card flat class="q-mt-xl">
      <q-card-section>
        <q-input v-model="title" outlined label="Título do gráfico" />
      </q-card-section>
    </q-card>

    <q-card flat class="q-mt-xl">
      <q-card-section>
        <q-input v-model="title" outlined label="Título do gráfico" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const title = ref('');
</script>
