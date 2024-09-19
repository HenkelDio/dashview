<template>
  <q-page class="q-pa-md q-pt-xl">
    <div class="text-h5 page-title">Usuários</div>

    <q-card flat class="q-mt-xl">
      <q-card-section>
        <div class="flex justify-between">
          <div class="flex q-gutter-x-md">
            <q-btn-toggle
              v-model="usersFilter"
              color="grey-4"
              toggle-color="grey-5"
              no-caps
              toggle-text-color="grey-10"
              unelevated
              text-color="grey-9"
              class="inter-bold"
              :options="[
                { label: 'Ativos', value: 'active' },
                { label: 'Inativos', value: 'disable' },
              ]"
            />
            <q-input v-model="searchUser" outlined dense placeholder="Buscar" />
          </div>
          <q-btn
            no-caps
            label="Adicionar usuário"
            color="primary"
            class="inter-bold"
            size="1rem"
            unelevated
          />
        </div>
      </q-card-section>

      <q-card-section>
        <q-table
          flat
          :rows="rows"
          :columns="columns"
          row-key="name"
          table-header-class="inter-bold text-dark"
          rows-per-page-label="Resultados por página"
        >
          <template v-slot:body-cell-name="props">
            <div class="flex items-center q-py-sm">
              <q-avatar size="32px" class="q-mr-sm text-white" color="primary"
                >W</q-avatar
              >
              {{ props.row.name }}
            </div>
            <q-separator />
          </template>

          <template v-slot:body-cell-actions="props">
            <div>
              <q-btn flat round dense icon="edit" color="primary" />
              <q-btn
                flat
                round
                dense
                icon="delete"
                color="negative"
                @click="() => console.log('props', props)"
              />
            </div>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const usersFilter = ref('active');
const searchUser = ref('');

const columns = ref([
  {
    name: 'name',
    required: true,
    field: 'name',
    label: 'NOME COMPLETO',
    sortable: false,
    align: 'left',
  },
  {
    name: 'email',
    field: 'email',
    label: 'EMAIL',
    sortable: false,
    align: 'left',
  },
  {
    name: 'username',
    label: 'USERNAME',
    field: 'username',
    sortable: true,
    align: 'left',
  },
  { name: 'role', label: 'FUNÇÃO', field: 'role', align: 'left' },
  { name: 'projects', label: 'PROJETOS', field: 'projects', align: 'left' },
  { name: 'actions', align: 'center', field: 'actions' },
]);

const rows = ref([
  {
    name: 'Willian José Henkel de Deus',
    email: 'willianhenkel@gmail.com',
    username: 'henkel',
    role: 'admin',
    projects: 'sei la, 333',
  },
  {
    name: 'Willian José Henkel de Deus',
    email: 'willianhenkel@gmail.com',
    username: 'henkel',
    role: 'admin',
    projects: 'sei la, 333',
  },
  {
    name: 'Willian José Henkel de Deus',
    email: 'willianhenkel@gmail.com',
    username: 'henkel',
    role: 'admin',
    projects: 'sei la, 333',
  },
]);
</script>
