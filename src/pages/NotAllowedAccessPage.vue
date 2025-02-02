<template>
  <q-page class="q-pa-md q-pt-xl">
    <div class="column items-center">
      <div>
        <Vue3Lottie :animationData="notAllowed" :height="200" :width="200" />
      </div>
      <div class="text-h6 inter-bold">Usuário sem permissão de acesso</div>
      <q-btn
        flat
        no-caps
        color="secondary"
        class="q-mt-md"
        @click="$router.back()"
        >voltar para paǵina anterior</q-btn
      >
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { Vue3Lottie } from 'vue3-lottie';
import notAllowed from '../assets/not-allowed.json';
</script>
