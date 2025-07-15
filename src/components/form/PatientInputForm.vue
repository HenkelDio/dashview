<template>
  <q-card
    style="padding: 20px; text-align: start"
    bordered
    flat
    class="q-mt-xl"
  >
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
      @update:model-value="resetField"
    />

    <q-select
      v-if="patientFeedbackReturn"
      ref="feedbackTypeRef"
      class="q-mt-md"
      outlined
      v-model="feedbackType"
      label="Como você gostaria do retorno? (Obrigatório)"
      :options="[
        { value: 'whatsapp', label: 'Whatsapp' },
        { value: 'email', label: 'E-mail' },
      ]"
    />
  </q-card>

  <q-card bordered flat class="q-mt-xl">
    <q-card-section>
      <div class="text-subtitle1" style="text-align: start">
        Suas informações de contato
      </div>

      <q-input
        v-model="patientName"
        ref="patientNameRef"
        :label="
          patientFeedbackReturn
            ? 'Seu nome completo (obrigatório)'
            : 'Seu nome completo (opcional)'
        "
        class="q-mt-md"
        dense
        outlined
        :disable="disabled"
        :rules="
          patientFeedbackReturn
            ? [
                (val) => !!val || 'Nome é obrigatório',
                (val) => val.length >= 3 || 'Nome inválido',
              ]
            : []
        "
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
        :label="
          patientFeedbackReturn
            ? 'Seu número de telefone (obrigatório)'
            : 'Seu número de telefone (opcional)'
        "
        class="q-mt-sm"
        dense
        outlined
        :disable="disabled"
        mask="(##) #####-####"
        :rules="
          patientFeedbackReturn
            ? [
                (val) => !!val || 'Telefone é obrigatório',
                (val) => val.length === 15 || 'Telefone inválido',
              ]
            : []
        "
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
        :label="
          patientFeedbackReturn
            ? 'Seu e-mail (obrigatório)'
            : 'Seu e-mail (opcional)'
        "
        class="q-mt-sm"
        dense
        outlined
        :disable="disabled"
        :rules="
          patientFeedbackReturn
            ? [
                (val) => !!val || 'E-mail é obrigatório',
                (val) => /.+@.+\..+/.test(val) || 'E-mail inválido',
              ]
            : []
        "
      />
    </q-card-section>
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
  'feedbackType',
]);

const props = defineProps<IProps>();

const patientName = ref('');
const patientPhone = ref('');
const patientEmail = ref('');
const patientFeedbackReturn = ref(false);
const feedbackType = ref('');

const patientNameRef = ref();
const patientPhoneRef = ref();
const patientEmailRef = ref();
const feedbackTypeRef = ref();

function resetField() {
  patientNameRef.value?.resetValidation();
  patientPhoneRef.value?.resetValidation();
  patientEmailRef.value?.resetValidation();
  feedbackTypeRef.value?.resetValidation();
}

async function validateAndEmit(
  fieldRef: { value: { validate: () => Promise<boolean> } | null },
  fieldValue: string,
  eventName:
    | 'setPatientName'
    | 'setPatientPhone'
    | 'patientEmail'
    | 'patientFeedbackReturn'
    | 'feedbackType'
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

watch(feedbackType, (newVal) => {
  emit('feedbackType', newVal);
});
</script>
