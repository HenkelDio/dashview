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
                  type="email"
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
                  @click="doLogin()"
                  :disable="!isFormValid"
                  :loading="loading"
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
import { Notify } from 'quasar';
import { login } from 'src/services/AuthService';
import { useUserStore } from 'src/stores/userStore';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const email = ref('');
const password = ref('');
const loading = ref(false);

const isFormValid = computed(() => {
  return password.value !== '' && email.value !== '';
});

async function doLogin() {
  loading.value = true;
  const { data, error } = await login(email.value, password.value);
  loading.value = false;

  if (error) {
    Notify.create({
      caption: 'Erro ao fazer login',
      group: true,
      color: 'red',
    });
    return;
  }

  const state = useUserStore();
  state.setUser(data);

  router.push({ path: '/dashboard' });
}
</script>
