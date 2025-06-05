<template>
  <q-page class="q-pa-md q-pt-xl">
    <div class="text-h5 page-title">Preferências</div>

    <q-card flat class="q-mt-xl">
      <q-card-section>
        <div v-if="loading">
          <q-skeleton type="QToolbar" />
        </div>
        <div class="flex items-center q-gutter-md" v-if="!loading">
          <q-avatar color="primary" text-color="white">{{
            user.name && user.name.charAt(0)
          }}</q-avatar>
          <div>
            <div class="inter-bold text-h5 text-dark">
              {{ user.name }}
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <q-list separator style="overflow: auto">
          <q-item clickable v-ripple v-if="loading">
            <q-item-section>
              <div>
                <q-skeleton type="QToolbar" />
              </div>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple v-if="!loading">
            <q-item-section>
              <div class="inter-medium">Nome</div>
            </q-item-section>

            <q-item-section v-if="!editUserName">{{
              user.name
            }}</q-item-section>
            <q-item-section v-if="editUserName">
              <q-input dense v-model="newName" :placeholder="user.name" />
            </q-item-section>
            <q-item-section>
              <q-btn
                style="width: 200px"
                :label="editUserName ? 'Salvar' : 'Editar'"
                :flat="!editUserName"
                unelevated
                color="primary"
                class="inter-bold"
                @click="saveOrEditName()"
              />
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple v-if="loading">
            <q-item-section>
              <div>
                <q-skeleton type="QToolbar" />
              </div>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple v-if="!loading">
            <q-item-section>
              <div class="inter-medium">E-mail</div>
            </q-item-section>

            <q-item-section>{{ user.email }}</q-item-section>
            <q-item-section>
              <!-- <q-btn
                style="width: 200px"
                label="Editar"
                flat
                color="primary"
                class="inter-bold"
              /> -->
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple v-if="loading">
            <q-item-section>
              <div>
                <q-skeleton type="QToolbar" />
              </div>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple v-if="!loading">
            <q-item-section>
              <div class="inter-medium">Senha</div>
            </q-item-section>

            <q-item-section>**********</q-item-section>
            <q-item-section>
              <q-btn
                style="width: 200px"
                label="Redefinir senha"
                flat
                color="primary"
                class="inter-bold"
                @click="resetPassword()"
                :loading="loadingResetPassord"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { Notify } from 'quasar';
import {
  getUserByDocument,
  resetUserPassword,
  updateUserName,
} from 'src/services/UserService';
import { useUserStore } from 'src/stores/userStore';
import { User } from 'src/types';
import { onMounted, ref } from 'vue';

const userStore = useUserStore();
const user = ref({} as User);
const loading = ref(false);
const editUserName = ref(false);
const newName = ref('');
const loadingResetPassord = ref(false);

async function saveOrEditName() {
  if (editUserName.value) {
    const { error } = await updateUserName(user.value.document, newName.value);

    if (error) {
      Notify.create({
        message: 'Erro ao atualizar nome',
        group: true,
        color: 'red',
      });
      return;
    }

    Notify.create({
      message: 'Nome atualizado com sucesso!',
      group: true,
      color: 'green',
    });

    loadUser();
    editUserName.value = false;
    return;
  }

  editUserName.value = true;
}

async function loadUser() {
  loading.value = true;
  const { data, error } = await getUserByDocument(
    userStore.$state.user.document
  );
  loading.value = false;

  if (error) {
    Notify.create({
      message: 'Erro em carregar usuário',
      group: true,
      color: 'red',
    });
    return;
  }

  user.value = data;
}

async function resetPassword() {
  loadingResetPassord.value = true;
  user.value.document = user.value.document.replace('-', '').replace('.', '');
  const { error } = await resetUserPassword(user.value.document);
  loadingResetPassord.value = false;

  if (error) {
    Notify.create({
      message: 'Erro ao redefinir senha',
      group: true,
      color: 'red',
    });
    return;
  }

  Notify.create({
    message: 'E-mail de redefinição de senha enviado!',
    group: true,
    color: 'green',
  });
}

onMounted(() => {
  loadUser();
});
</script>
