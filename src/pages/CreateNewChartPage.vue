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
        <div class="text-h6 inter-bold">Título de gráfico</div>
        <q-input v-model="title" outlined label="Novo gráfico" />
      </q-card-section>
    </q-card>

    <q-card flat class="q-mt-md">
      <q-card-section>
        <div class="text-h6 inter-bold">Tipo de gráfico</div>
        <div class="q-gutter-sm q-mb-sm">
          <q-radio
            v-model="type"
            checked-icon="task_alt"
            unchecked-icon="panorama_fish_eye"
            val="setor"
            label="Setores"
          >
          </q-radio>
          <q-radio
            v-model="type"
            checked-icon="task_alt"
            unchecked-icon="panorama_fish_eye"
            val="bar"
            label="Barra"
          />
        </div>
        <div
          style="background-color: #ededeb; width: 100px; border-radius: 8px"
          class="flex justify-center"
        >
          <q-icon
            :name="type === 'bar' ? 'equalizer' : 'pie_chart'"
            size="5rem"
            style="opacity: 0.8"
          />
        </div>
      </q-card-section>
    </q-card>

    <q-card flat class="q-mt-xl">
      <q-card-section>
        <div class="text-h6 inter-bold">Título de gráfico</div>
        <q-input v-model="title" outlined label="Novo gráfico" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const title = ref('');
const type = ref('');
</script>
