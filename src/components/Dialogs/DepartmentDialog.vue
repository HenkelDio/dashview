<template>
  <q-dialog v-model="show" persistent>
    <q-card style="width: 500px">
      <q-card-section>
        <div class="inter-medium" style="font-size: 1.5rem">
          Adicionar novo departamento
        </div>
      </q-card-section>
      <q-card-section>
        <div class="flex column q-gutter-y-md">
          <q-input label="Nome do departamento" v-model="name" outlined />
          <q-input
            label="E-mail do gestor"
            v-model="email"
            outlined
            hint="O e-mail será usado para receber respostas defratoras"
          />
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          color="primary"
          unelevated
          label="Salvar"
          :disable="!name"
          @click="isEdit ? changeDepartment() : addDepartment()"
          :loading="loading"
        />
        <q-btn flat label="Fechar" @click="emit('close')" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { Notify } from 'quasar';
import {
  createDepartment,
  updateDepartment,
} from 'src/services/DepartmentService';
import { IDepartmentCreate } from 'src/types';
import { computed, onMounted, ref } from 'vue';

const show = ref(true);
const name = ref('');
const email = ref('');
const loading = ref(false);

async function changeDepartment() {
  const payload: IDepartmentCreate = {
    name: name.value,
    label: name.value,
    emailManager: email.value,
    id: props.id,
  };

  loading.value = true;
  const { error } = await updateDepartment(payload);
  loading.value = false;

  if (error) {
    Notify.create({
      caption: 'Erro ao atualizar departamento',
      color: 'red',
      group: true,
    });
    return;
  }

  Notify.create({
    caption: 'Departamento atualizado com sucesso!',
    color: 'green',
    group: true,
  });

  emit('close');
}

async function addDepartment() {
  const payload: IDepartmentCreate = {
    name: name.value,
    label: name.value,
    emailManager: email.value,
  };
  loading.value = true;
  const { error } = await createDepartment(payload);
  loading.value = false;

  if (error) {
    Notify.create({
      caption: 'Erro ao criar departamento',
      color: 'red',
      group: true,
    });
    return;
  }

  Notify.create({
    caption: 'Departamento criado com sucesso!',
    color: 'green',
    group: true,
  });

  emit('close');
}

const emit = defineEmits(['close']);

interface IProps {
  nameDepartment?: string;
  emailDepartment?: string;
  id?: string;
}
const props = defineProps<IProps>();

const isEdit = computed(() => {
  return props.nameDepartment || props.emailDepartment;
});

onMounted(() => {
  if (isEdit.value) {
    name.value = props.nameDepartment ?? '';
    email.value = props.emailDepartment ?? '';
  }
});
</script>
