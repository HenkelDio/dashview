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
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          color="primary"
          unelevated
          label="Salvar"
          :disable="!name"
          @click="addDepartment()"
        />
        <q-btn flat label="Fechar" @click="emit('close')" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { Notify } from 'quasar';
import { createDepartment } from 'src/services/DepartmentService';
import { IDepartment } from 'src/types';
import { ref } from 'vue';

const show = ref(true);
const name = ref('');

async function addDepartment() {
  const payload: IDepartment = {
    name: name.value,
    label: name.value,
  };
  const { error } = await createDepartment(payload);

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
</script>
