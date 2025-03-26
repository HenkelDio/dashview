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
      v-model="patientName"
      ref="patientNameRef"
      label="Seu nome completo (opcional)"
      class="q-mt-md"
      dense
      outlined
      :disable="disabled"
    />

    <!-- <q-input
      v-model="patientName"
      ref="patientNameRef"
      label="Seu nome completo"
      class="q-mt-md"
      dense
      outlined
      :disable="disabled"
      :rules="[
        (val) => !!val || 'Nome é obrigatório',
        (val) => val.length >= 3 || 'Nome inválido',
      ]"
    /> -->

    <q-input
      v-model="patientPhone"
      ref="patientPhoneRef"
      label="Seu número de telefone (opcional)"
      class="q-mt-sm"
      dense
      outlined
      :disable="disabled"
      mask="(##) #####-####"
    />

    <!-- <q-input
      v-model="patientPhone"
      ref="patientPhoneRef"
      label="Seu número de telefone (opcional)"
      class="q-mt-sm"
      dense
      outlined
      :disable="disabled"
      mask="(##) #####-####"
      :rules="[
        (val) => !!val || 'Telefone é obrigatório',
        (val) => val.length === 15 || 'Telefone inválido',
      ]"
    /> -->

    <!-- <q-input
      v-model="patientEmail"
      ref="patientEmailRef"
      label="Seu e-mail (opcional)"
      class="q-mt-sm"
      dense
      outlined
      :disable="disabled"
      :rules="[
        (val) => !!val || 'E-mail é obrigatório',
        (val) => /.+@.+\..+/.test(val) || 'E-mail inválido',
      ]"
    /> -->

    <q-input
      v-model="patientEmail"
      ref="patientEmailRef"
      label="Seu e-mail (opcional)"
      class="q-mt-sm"
      dense
      outlined
      :disable="disabled"
    />
  </q-card>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick } from 'vue';

interface IProps {
  title: string;
  disabled: boolean;
}

const emit = defineEmits([
  'setPatientName',
  'setPatientPhone',
  'patientEmail',
  'patientFeedbackReturn',
  'fieldError',
]);

const props = defineProps<IProps>();

const patientName = ref('');
const patientPhone = ref('');
const patientEmail = ref('');
const patientFeedbackReturn = ref(false);

const patientNameRef = ref();
const patientPhoneRef = ref();
const patientEmailRef = ref();

async function validateAndEmit(
  fieldRef: { value: { validate: () => Promise<boolean> } | null },
  fieldValue: string,
  eventName:
    | 'setPatientName'
    | 'setPatientPhone'
    | 'patientEmail'
    | 'patientFeedbackReturn'
) {
  await nextTick();
  if (fieldRef.value) {
    const valid = await fieldRef.value.validate();
    if (valid) {
      emit(eventName, fieldValue);
      emit('fieldError', false);
    } else {
      emit('fieldError', true);
    }
  }
}

watch(patientName, async (newVal) => {
  await validateAndEmit(patientNameRef, newVal, 'setPatientName');
});

watch(patientPhone, async (newVal) => {
  await validateAndEmit(patientPhoneRef, newVal, 'setPatientPhone');
});

watch(patientEmail, async (newVal) => {
  await validateAndEmit(patientEmailRef, newVal, 'patientEmail');
});

watch(patientFeedbackReturn, (newVal) => {
  emit('patientFeedbackReturn', newVal);
});
</script>
