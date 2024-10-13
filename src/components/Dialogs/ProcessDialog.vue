<template>
  <q-dialog v-model="show" persistent>
    <q-card style="width: 500px">
      <q-card-section>
        <div class="inter-medium" style="font-size: 1.5rem">
          {{props.id ? 'Editar processo' : 'Adicionar novo processo' }}
        </div>
      </q-card-section>
      <q-card-section>
        <div class="flex column q-gutter-y-md">
          <q-input label="Nome do processo" v-model="name" outlined />
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          color="primary"
          unelevated
          label="Salvar"
          :disable="!name"
          @click="props.id ? updateOneProcess() : addProcess()"
          :loading="loading"
        />
        <q-btn flat label="Fechar" @click="emit('close')" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { Notify } from 'quasar';
import { createProcess, findProcessById, updateProcess } from 'src/services/ModuleService';
import { IProcess } from 'src/types';
import { onMounted, ref } from 'vue';

interface IProps {
  id?: string
}

const props = defineProps<IProps>()

const show = ref(true);
const name = ref('');
const loading = ref(false);

async function addProcess() {
  loading.value = true;
  const { error } = await createProcess(name.value);
  loading.value = false;

  if (error) {
    Notify.create({
      caption: 'Erro ao criar processo',
      color: 'red',
      group: true,
    });
    return;
  }

  Notify.create({
    caption: 'Processo criada com sucesso!',
    color: 'green',
    group: true,
  });

  emit('close');
}

async function findById() {
  const { data, error }: {data: IProcess | null, error: unknown} = await findProcessById(props.id);

  if(error) {
    Notify.create({
      caption: 'Erro ao encontrar processo',
      color: 'red',
      group: true,
    });
    return;
  }

  if(data) {
    name.value = data.name;
  }
}

async function updateOneProcess() {
  const payload = {
    'id': props.id,
    'name': name.value
  }

  loading.value = true;
  const { error } = await updateProcess(payload);
  loading.value = false;

  if (error) {
    Notify.create({
      caption: 'Erro ao editar processo',
      color: 'red',
      group: true,
    });
    return;
  }

  Notify.create({
    caption: 'Processo editado com sucesso!',
    color: 'green',
    group: true,
  });

  emit('close');
}

const emit = defineEmits(['close']);

onMounted(() => {
  if(props.id) {
    findById();
  }
})
</script>
