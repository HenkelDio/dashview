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
              emit-value
              :options="[
                { label: 'Ativos', value: 'ACTIVE' },
                { label: 'Inativos', value: 'INACTIVE' },
              ]"
            />
            <q-input
              v-model="searchParam"
              outlined
              dense
              placeholder="Buscar pelo nome"
            />
          </div>
          <q-btn
            no-caps
            label="Adicionar usuário"
            color="primary"
            class="inter-bold"
            size="1rem"
            unelevated
            @click="showDialog('create', {} as User)"
          />
        </div>
      </q-card-section>

      <q-card-section>
        <q-table
          flat
          :rows="filteredRows"
          :columns="columns"
          row-key="name"
          table-header-class="inter-bold text-dark"
          rows-per-page-label="Resultados por página"
          :loading="loading"
          no-data-label="Sem dados disponíveis"
        >
          <template v-slot:body-cell-name="props">
            <div class="flex items-center q-py-sm">
              <q-avatar
                size="32px"
                class="q-mr-sm text-white"
                :color="props.row.status === 'ACTIVE' ? 'primary' : 'dark'"
                >{{ props.row.name.charAt(0) }}</q-avatar
              >
              {{ props.row.name }}
            </div>
            <q-separator />
          </template>

          <template v-slot:body-cell-actions="props">
            <div>
              <q-btn
                flat
                round
                dense
                :icon="
                  props.row.status === 'ACTIVE'
                    ? 'edit'
                    : 'published_with_changes'
                "
                color="primary"
                @click="
                  showDialog(
                    props.row.status === 'ACTIVE' ? 'edit' : 'reactivate',
                    props.row
                  )
                "
              />
              <q-btn
                flat
                round
                dense
                icon="delete"
                color="negative"
                v-if="props.row.status === 'ACTIVE'"
                @click="showDeleteUserDialog = true"
              />
            </div>

            <GenericDialog
              v-if="showDeleteUserDialog"
              @close="() => (showDeleteUserDialog = false)"
              @confirm="disableOneUser(props.row)"
              title="Desativar usuário?"
              description="O usuário não terá mais acesso a plataforma"
              confirm-label-button="Desativar"
              color-label-button="red"
              :loading="loadingButtonDeleteUser"
            />

            <GenericDialog
              v-if="showReactivateDialog"
              @close="() => (showReactivateDialog = false)"
              @confirm="reactivateOneUser(props.row)"
              title="Reativar usuário?"
              description="O usuário terá acesso novamente a plataforma"
              confirm-label-button="Reativar"
              color-label-button="primary"
              :loading="loadingButtonReactivateUser"
            />
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <UserDialog
      v-if="showDialogUser"
      @close="
        () => {
          (showDialogUser = false), listAllUsers();
        }
      "
      :isEdit="isEditDialog"
      :userDocumentEditing="userDocumentEditing"
    />
  </q-page>
</template>

<script lang="ts" setup>
import { Notify } from 'quasar';
import GenericDialog from 'src/components/Dialogs/GenericDialog.vue';
import UserDialog from 'src/components/Dialogs/UserDialog.vue';
import {
  disableUser,
  listUsers,
  reactivateUser,
} from 'src/services/UserService';
import { IUserTable, User } from 'src/types';
import { onMounted, ref, watch } from 'vue';

const usersFilter = ref('ACTIVE');
const errorOnLoadUsers = ref(false);
const loading = ref(false);
const rows = ref([] as IUserTable[]);
const showDialogUser = ref(false);
const isEditDialog = ref(false);
const showDeleteUserDialog = ref(false);
const loadingButtonDeleteUser = ref(false);
const showReactivateDialog = ref(false);
const loadingButtonReactivateUser = ref(false);
const searchParam = ref('');
const filteredRows = ref([] as IUserTable[]);
const userDocumentEditing = ref('');

interface Column {
  name: string;
  required?: boolean;
  label: string;
  align?: 'left' | 'center' | 'right';
  field: string;
  sortable?: boolean;
}
const columns = ref<Column[]>([
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
  { name: 'actions', align: 'center', field: 'actions', label: '' },
]);

function showDialog(type: string, row: User) {
  userDocumentEditing.value = '';
  isEditDialog.value = false;

  if (type === 'reactivate') {
    showReactivateDialog.value = true;
    return;
  }

  if (type === 'edit') {
    isEditDialog.value = true;
    userDocumentEditing.value = row.document;
  }

  showDialogUser.value = true;
}

interface ApiResponse {
  data: User[] | null;
  error: unknown | null;
}

async function listAllUsers() {
  loading.value = true;
  const { data, error }: ApiResponse = await listUsers(usersFilter.value);
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
        status: user.status,
      };
    });

    rows.value = currentRows;
    filteredRows.value = currentRows;
  }
}

function getRole(role: string) {
  if (role === 'admin') {
    return 'ADMINISTRADOR';
  }

  if (role === 'user') {
    return 'USUÁRIO';
  }

  return '';
}

async function disableOneUser(row: User) {
  loadingButtonDeleteUser.value = true;
  const { error } = await disableUser(row.document);
  loadingButtonDeleteUser.value = false;

  if (error) {
    Notify.create({
      message: 'Erro ao desabilitar usuário',
      group: true,
      color: 'red',
    });
    return;
  }

  Notify.create({
    message: 'Usuário desabilitado com usuário!',
    group: true,
    color: 'green',
  });

  showDeleteUserDialog.value = false;
  listAllUsers();
}

async function reactivateOneUser(row: User) {
  loadingButtonReactivateUser.value = true;
  const { error } = await reactivateUser(row.document);
  loadingButtonReactivateUser.value = false;

  if (error) {
    Notify.create({
      caption: 'Erro ao reativar usuário',
      group: true,
      color: 'red',
    });
    return;
  }

  Notify.create({
    caption: 'Usuário reativado com usuário!',
    group: true,
    color: 'green',
  });

  showReactivateDialog.value = false;
  listAllUsers();
}

watch(usersFilter, () => {
  listAllUsers();
});

watch(searchParam, (value: string) => {
  filteredRows.value = rows.value.filter((item) =>
    item.name.toLowerCase().includes(value.toLowerCase())
  );
});

onMounted(() => {
  listAllUsers();
});
</script>
