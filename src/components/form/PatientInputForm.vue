<template>
  <q-card style="padding: 20px; text-align: start" bordered flat>
    <div class="text-subtitle1">
      {{ props.title }}
    </div>

    <q-checkbox
      v-model="patientFeedbackReturn"
      label="Sim"
      class="q-mt-md"
      dense
      outlined
      :disable="disabled"
    />

    <q-input
      v-if="patientFeedbackReturn"
      v-model="patientName"
      label="Seu nome completo"
      class="q-mt-md"
      dense
      outlined
      :disable="disabled"
    />
    <q-input
      v-if="patientFeedbackReturn"
      v-model="patientPhone"
      label="Seu número de telefone"
      class="q-mt-md"
      dense
      outlined
      :disable="disabled"
    />
  </q-card>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

interface IProps {
  title: string;
  disabled: boolean;
}

const emit = defineEmits([
  'setPatientName',
  'setPatientPhone',
  'patientFeedbackReturn',
]);
const props = defineProps<IProps>();

const patientName = ref('');
const patientPhone = ref('');
const patientFeedbackReturn = ref(false);

watch(patientName, (newVal) => {
  emit('setPatientName', newVal);
});

watch(patientPhone, (newVal) => {
  emit('setPatientPhone', newVal);
});

watch(patientFeedbackReturn, (newVal) => {
  emit('patientFeedbackReturn', newVal);
});
</script>
