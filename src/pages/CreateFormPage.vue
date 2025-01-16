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

    <div class="text-h5 page-title q-mb-xl">Criar novo formulário</div>

    <q-card flat class="q-mb-lg">
      <q-card-section>
        <q-input v-model="title" outlined dense label="Título do formulário" />
      </q-card-section>
    </q-card>

    <q-card flat>
      <q-card-section>
        <q-input v-model="title" outlined dense label="Questão 1" />
      </q-card-section>
    </q-card>

    <q-dialog v-model="show">
      <q-card flat style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">Criar pergunta</div>
          <q-option-group
            v-model="mock"
            type="radio"
            inline
            class="q-mt-md"
            :options="optionsType"
            dense
          />
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="title"
            outlined
            dense
            label="Título da pergunta"
            class="q-mb-md"
          />
          <div v-for="item in 10" :key="item" class="q-mb-sm">
            <q-input v-model="title" outlined dense :label="'Opção' + item" />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Fechar" color="primary" flat @click="show = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const title = ref('');
const mock = ref();
const optionsType = ref([
  { label: 'Texto', value: 'text' },
  { label: 'Múltipla escolha', value: 'multiple_choice' },
]);
const show = ref(true);
</script>
