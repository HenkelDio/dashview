<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container class="inter">
      <q-page class="flex flex-center bg-grey-2">
        <div class="flex justify-between" style="width: 1100px">
          <div class="displayOnMobile">
            <div>
              <q-img src="../assets/logo.png" width="30%" />
            </div>
            <div class="text-h3 text-grey-10">
              Clínica Los Angeles <br />
              | <b>Gerenciador de NPS</b>
            </div>
          </div>
          <div class="widthOnMobile">
            <q-card class="q-pa-md widthOnMobile" style="width: 400px">
              <q-card-section class="text-center">
                <div class="text-grey-9 text-h5 text-weight-bold">
                  Definir senha
                </div>
                <div class="text-grey-8">
                  Crie sua senha para acessar sua conta
                </div>
              </q-card-section>
              <q-card-section>
                <div class="q-gutter-y-sm flex column">
                  <q-input
                    label="Senha"
                    v-model="password"
                    outlined
                    :type="isVisiblePassword"
                    @blur="checkPasswordValidity"
                    :error="passwordError"
                    :error-message="passwordErrorMessage"
                  >
                  </q-input>
                  <q-input
                    label="Repita a senha"
                    v-model="passwordConfirmation"
                    outlined
                    :type="isVisiblePassword"
                    @update:model-value="checkPasswordValidity"
                    :error="passwordError"
                    :error-message="passwordErrorMessage"
                  >
                  </q-input>
                  <q-checkbox
                    v-model="checkboxPassword"
                    label="Visualizar senhas"
                  />
                </div>
              </q-card-section>
              <q-card-section>
                <q-btn
                  color="primary"
                  size="md"
                  label="Definir senha"
                  no-caps
                  class="full-width inter-bold"
                  style="height: 50px; font-size: 1.1rem"
                  :disable="!isFormValid"
                  @click="setPassword()"
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
import { definePassword } from 'src/services/AuthService';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const token = ref(route.query.token);

const password = ref('');
const passwordConfirmation = ref('');
const checkboxPassword = ref(false);
const loading = ref(false);

const passwordError = ref(false);
const passwordErrorMessage = ref('');

const isFormValid = computed(() => {
  return (
    password.value !== '' &&
    passwordConfirmation.value !== '' &&
    password.value === passwordConfirmation.value
  );
});

const checkPasswordValidity = () => {
  if (password.value === '' || passwordConfirmation.value === '') {
    passwordError.value = true;
    passwordErrorMessage.value = 'Ambos os campos devem estar preenchidos';
  } else if (password.value !== passwordConfirmation.value) {
    passwordError.value = true;
    passwordErrorMessage.value = 'As senhas não coincidem';
  } else {
    passwordError.value = false;
    passwordErrorMessage.value = '';
  }
};

const isVisiblePassword = computed(() => {
  return checkboxPassword.value === true ? 'text' : 'password';
});

const setPassword = async () => {
  loading.value = true;

  const { error } = await definePassword(
    password.value,
    token.value?.toString()
  );

  loading.value = false;

  if (error) {
    Notify.create({
      caption: 'Erro ao definir senha',
      group: false,
      color: 'red',
    });
    return;
  }

  Notify.create({
    caption: 'Senha definida com sucesso!',
    group: false,
    color: 'green',
  });
  router.push({ path: '/' });
};
</script>

<style lang="scss">
@media (max-width: 750px) {
  .displayOnMobile {
    display: none;
  }

  .widthOnMobile {
    width: 100% !important;
  }
}
</style>
