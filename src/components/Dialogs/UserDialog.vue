<template>
  <q-dialog v-model="show" persistent>
    <q-card style="width: 500px">
      <q-card-section>
        <div class="inter-medium" style="font-size: 1.5rem">
          {{ isEdit ? 'Editar' : 'Novo' }} usuário
        </div>
      </q-card-section>
      <q-card-section>
        <div class="flex column q-gutter-y-sm">
          <q-input
            label="Nome completo"
            v-model="user.name"
            outlined
            :rules="[(val) => !!val || 'Nome é obrigatório']"
            :disable="loading"
          />
          <q-input
            label="E-mail"
            v-model="user.email"
            outlined
            :rules="[
              (val) => !!val || 'E-mail é obrigatório',
              (val) => /.+@.+\..+/.test(val) || 'E-mail inválido',
            ]"
            :disable="loading"
          />
          <q-input
            label="CPF"
            v-model="user.document"
            outlined
            mask="###.###.###-##"
            :rules="[
              (val) => !!val || 'CPF é obrigatório',
              (val) => val.length === 14 || 'CPF inválido',
            ]"
            :disable="loading"
          />
          <q-select
            label="Função"
            v-model="user.role"
            outlined
            label-slot
            emit-value
            :options="roleOptions"
            :rules="[(val) => !!val || 'Função é obrigatório']"
            :disable="loading"
          />
          <q-select
            label="Departamento"
            v-model="user.departments"
            outlined
            :options="departmentsOptions"
            multiple
            :rules="[(val) => !!val || 'Departamento é obrigatório']"
            :loading="loadingDepartments"
            :disable="loadingDepartments || loading"
            hint="O usuário pode ter mais de um departamento"
          />
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          flat
          label="Redefinir senha"
          @click="resetPassword()"
          v-if="isEdit"
          :loading="loadingResetPassord"
        />
        <q-btn
          color="primary"
          unelevated
          label="Salvar"
          @click="isEdit ? updateOneUser() : createUser()"
          :loading="loading"
          :disable="!isFormValid"
        />
        <q-btn flat label="Fechar" @click="emit('close')" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { Notify } from 'quasar';
import { getAllDepartments } from 'src/services/DepartmentService';
import {
  createNewUser,
  getUserByDocument,
  resetUserPassword,
  updateUser,
} from 'src/services/UserService';
import { IDepartment, User } from 'src/types';
import { computed, onMounted, ref } from 'vue';

const show = ref(true);

const user = ref({} as User);
const departmentsOptions = ref([] as IDepartment[]);
const loading = ref(false);
const loadingDepartments = ref(false);
const loadingResetPassord = ref(false);

const roleOptions = ref([
  { value: 'admin', label: 'Administrador' },
  { value: 'user', label: 'Usuário' },
]);

interface IProps {
  isEdit: boolean;
  userDocumentEditing?: string | null;
}

const props = defineProps<IProps>();
const isEdit = ref(props.isEdit);
const userDocumentEditing = ref(props.userDocumentEditing);

interface IResponse {
  data: IDepartment[] | null;
  error: unknown | null;
}

async function getDepartments() {
  loadingDepartments.value = true;
  const { data, error }: IResponse = await getAllDepartments('ACTIVE');
  loadingDepartments.value = false;

  if (error) {
    Notify.create({
      caption: 'Erro ao carregar departamentos',
      group: true,
      color: 'red',
    });
    return;
  }

  if (data) {
    departmentsOptions.value = data;
  }
}

async function createUser() {
  loading.value = true;
  user.value.document = user.value.document.replace('-', '').replace('.', '');
  const { error } = await createNewUser(user.value);
  loading.value = false;

  if (error) {
    Notify.create({
      caption: 'Erro ao criar usuário',
      color: 'red',
      group: true,
    });
    return;
  }

  Notify.create({
    caption: 'Usuário criado com sucesso!',
    color: 'green',
    group: true,
  });

  emit('close');
}

const isFormValid = computed(() => {
  return (
    user.value.name !== '' &&
    user.value.email !== '' &&
    user.value.document !== '' &&
    user.value.role !== '' &&
    user.value.departments &&
    user.value.departments.length > 0
  );
});

async function updateOneUser() {
  loading.value = true;

  user.value.document = user.value.document.replace('-', '').replace('.', '');
  const { error } = await updateUser(user.value);

  loading.value = false;

  if (error) {
    Notify.create({
      caption: 'Erro ao atualizar usuário',
      color: 'red',
      group: true,
    });
    return;
  }

  Notify.create({
    caption: 'Usuário atualizado com sucesso!',
    color: 'green',
    group: true,
  });

  emit('close');
}

async function loadUser() {
  if (userDocumentEditing.value) {
    loading.value = true;
    const { data, error } = await getUserByDocument(userDocumentEditing.value);
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
  getDepartments();
  if (isEdit.value) {
    loadUser();
  }
});

const emit = defineEmits(['close']);
</script>
