<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container class="inter">
      <q-page class="flex flex-center bg-grey-2">
        <div class="flex justify-between" style="width: 1100px">
          <div>
            <div class="text-h6 inter">DASH VIEW</div>
            <div class="text-h3 text-grey-10">
              Vamos transformar dados <br />
              em <b>respostas</b>
            </div>
          </div>
          <div>
            <q-card class="q-pa-md" style="width: 400px">
              <q-card-section class="text-center">
                <div class="text-grey-9 text-h5 text-weight-bold">Entrar</div>
                <div class="text-grey-8">
                  Faça login para entrar na sua conta
                </div>
              </q-card-section>
              <q-card-section>
                <q-input
                  outlined
                  v-model="email"
                  placeholder="E-mail"
                ></q-input>
                <q-input
                  outlined
                  class="q-mt-md"
                  v-model="password"
                  type="password"
                  placeholder="Senha"
                ></q-input>
              </q-card-section>
              <q-card-section>
                <q-btn
                  color="primary"
                  size="md"
                  label="Entrar"
                  no-caps
                  class="full-width inter-bold"
                  style="height: 50px; font-size: 1.1rem"
                  @click="$router.push({ path: '/dashboard' })"
                ></q-btn>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const email = ref('');
const password = ref('');
</script>
