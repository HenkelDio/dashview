<template>
  <q-card style="padding: 20px; text-align: start" bordered flat>
    <div class="text-subtitle1">
      {{ props.title }}
    </div>

    <q-checkbox v-model="answer" label="Sim" class="q-mt-md" dense outlined />

    <q-input
      v-if="answer"
      v-model="patientName"
      label="Seu nome completo"
      class="q-mt-md"
      dense
      outlined
    />
    <q-input
      v-if="answer"
      v-model="patientPhone"
      label="Seu número de telefone"
      class="q-mt-md"
      dense
      outlined
    />
  </q-card>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

interface IProps {
  title: string;
}

const emit = defineEmits(['updateAnswer']);
const props = defineProps<IProps>();

const patientName = ref('');
const patientPhone = ref('');
const answer = ref(false);

watch(patientName, (newVal) => {
  emit('updateAnswer', {
    answer: answer.value,
    patientName: newVal,
    patientPhone: patientPhone.value,
  });
});

watch(patientPhone, (newVal) => {
  emit('updateAnswer', {
    answer: answer.value,
    patientName: patientName.value,
    patientPhone: newVal,
  });
});

watch(answer, (newVal) => {
  emit('updateAnswer', {
    answer: newVal,
    patientName: patientName.value,
    patientPhone: patientPhone.value,
  });
});
</script>
