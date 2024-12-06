<template>
  <q-card style="padding: 20px; text-align: start" bordered flat>
    <div class="text-subtitle1">
      Qual nota você daria para a clínica Los Angeles?
    </div>
    <q-input
      v-model="value"
      outlined
      dense
      class="q-mt-md"
      placeholder="Digite aqui"
    ></q-input>
  </q-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const value = ref('');
</script>
