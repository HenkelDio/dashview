<template>
  <q-card style="padding: 20px; text-align: start" bordered flat>
    <div class="text-subtitle1">
      {{ props.title }}
    </div>
    <q-select
      v-model="answer"
      style="width: 200px"
      outlined
      rounded
      dense
      class="q-mt-md"
      label="Selecione"
      :options="props.options"
    ></q-select>

    <q-input
      v-model="observation"
      label="Observações"
      class="q-mt-md"
      dense
      input-class="q-pa-sm"
    />
  </q-card>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

interface IProps {
  title: string;
  options: string[];
}

const emit = defineEmits(['updateAnswer']);
const props = defineProps<IProps>();

const answer = ref('');
const observation = ref('');

watch(answer, (newVal) => {
  emit('updateAnswer', { answer: newVal, observation: observation.value });
});

watch(observation, (newVal) => {
  emit('updateAnswer', { answer: answer.value, observation: newVal });
});
</script>
