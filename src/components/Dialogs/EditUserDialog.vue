<template>
  <q-dialog v-model="show" persistent>
    <q-card style="width: 500px;">
      <q-card-section>
        <div class="inter-medium" style="font-size: 1.5rem;">Editar usuário</div>
      </q-card-section>
      <q-card-section>
        <div class="flex column q-gutter-y-md">
          <q-input
            label="Nome completo"
            v-model="name"
            outlined
          />
          <q-input
            label="E-mail"
            v-model="email"
            outlined
          />
          <q-input
            label="Username"
            v-model="username"
            outlined
          />
          <q-select
            label="Função"
            v-model="role"
            outlined
            :options="roleOptions"
          />
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          color="primary"
          unelevated
          label="Salvar"
          @click="emit('close')"
        />
        <q-btn
          flat
          label="Fechar"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const show = ref(true);
const name = ref('');
const email = ref('');
const username = ref('');
const role = ref('');

const roleOptions = ref([
  {value: 'admin', label: 'Administrador'}
])

const emit = defineEmits(['close'])

</script>
