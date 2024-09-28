<template>
  <q-page class="q-pa-md q-pt-xl">
    <div class="text-h5 page-title">Usuários</div>

    <q-card flat class="q-mt-xl">
      <q-card-section>
        <div class="flex justify-between q-gutter-y-md">
          <div class="flex q-gutter-md">
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
          :loading="loading"
        >
          <template v-slot:body-cell-name="props">
            <div class="flex items-center q-py-sm">
              <q-avatar
                size="32px"
                class="q-mr-sm text-white"
                color="primary"
                >{{ props.row.name.charAt(0) }}</q-avatar
              >
              {{ props.row.name }}
            </div>
            <q-separator />
          </template>

          <template v-slot:body-cell-actions="">
            <div>
              <q-btn
                flat
                round
                dense
                icon="edit"
                color="primary"
                @click="showEditUser = true"
              />
              <q-btn
                flat
                round
                dense
                icon="delete"
                color="negative"
                @click="showEditUser = true"
              />
            </div>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <EditUserDialog v-if="showEditUser" @close="() => (showEditUser = false)" />
  </q-page>
</template>

<script lang="ts" setup>
import EditUserDialog from 'src/components/Dialogs/EditUserDialog.vue';
import { listUsers } from 'src/services/UserService';
import { IUserTable, User } from 'src/types';
import { onMounted, ref } from 'vue';

const usersFilter = ref('active');
const searchUser = ref('');
const errorOnLoadUsers = ref(false);
const loading = ref(false);
const showEditUser = ref(false);

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
    name: 'document',
    label: 'DOCUMENTO',
    field: 'document',
    sortable: true,
    align: 'left',
  },
  { name: 'role', label: 'FUNÇÃO', field: 'role', align: 'left' },
  {
    name: 'departments',
    label: 'DEPARTAMENTOS',
    field: 'departments',
    align: 'left',
  },
  { name: 'actions', align: 'center', field: 'actions' },
]);

const rows = ref([] as IUserTable[]);

interface ApiResponse {
  data: User[] | null;
  error: unknown | null;
}

async function listAllUsers() {
  loading.value = true;
  const { data, error }: ApiResponse = await listUsers();
  loading.value = false;

  if (error) {
    errorOnLoadUsers.value = true;
    return;
  }

  if (data) {
    const currentRows: IUserTable[] = data.map((user) => {
      const departments =
        user.departments?.map((item) => item.label).join(', ') || '';

      return {
        name: user.name,
        email: user.email,
        document: user.document,
        role: getRole(user.role),
        departments: departments,
      };
    });

    rows.value = currentRows;
  }
}

function getRole(role: string) {
  if (role === 'admin') {
    return 'ADMINISTRADOR';
  }

  return '';
}

onMounted(() => {
  listAllUsers();
});
</script>
