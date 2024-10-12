<template>
  <q-dialog v-model="show" persistent>
    <q-card style="width: 500px">
      <q-card-section>
        <div class="inter-medium" style="font-size: 1.5rem">
          Adicionar nova perspectiva
        </div>
      </q-card-section>
      <q-card-section>
        <div class="flex column q-gutter-y-md">
          <q-input label="Nome da perspectiva" v-model="name" outlined />
          <q-input label="Primeira descrição" v-model="descriptions[0]" outlined />
          <q-input label="Segunda descrição" v-model="descriptions[1]" outlined />
          <q-input label="Terceira descrição" v-model="descriptions[2]" outlined />
          <q-input label="Quarta descrição" v-model="descriptions[3]" outlined />
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          color="primary"
          unelevated
          label="Salvar"
          :disable="!name"
          @click="addPerspective()"
          :loading="loading"
        />
        <q-btn flat label="Fechar" @click="emit('close')" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { Notify } from 'quasar';
import { createPerspective } from 'src/services/ModuleService';
import { IPerspectiveCreate } from 'src/types';
import { ref } from 'vue';

const show = ref(true);
const name = ref('');
const descriptions = ref([])
const loading = ref(false);

async function addPerspective() {
  const payload: IPerspectiveCreate = {
    name: name.value,
    descriptions: descriptions.value,
  };

  loading.value = true;
  const { error } = await createPerspective(payload);
  loading.value = false;

  if (error) {
    Notify.create({
      caption: 'Erro ao criar perspectiva',
      color: 'red',
      group: true,
    });
    return;
  }

  Notify.create({
    caption: 'Perspectiva criada com sucesso!',
    color: 'green',
    group: true,
  });

  emit('close');
}

const emit = defineEmits(['close']);
</script>
