<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <q-card style="width: 900px; max-width: 95vw">
      <q-card-section class="row items-center justify-between">
        <div class="text-h6">Detalhes da entrevista</div>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-card-section>

      <q-card-section v-if="answer">
        <q-list bordered separator>
          <q-item>
            <q-item-section>
              <q-item-label>Paciente</q-item-label>
              <q-item-label caption lines="2">
                {{ answer.patient }}
              </q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label>CIRURGIA</q-item-label>
              <q-item-label caption lines="2">
                {{ answer.medicalRecord }}
              </q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label>Data da entrevista</q-item-label>
              <q-item-label caption lines="2">
                {{ answer.date }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item v-for="item in answer.answers" :key="`${answer.id}-${item.index}`">
            <q-item-section>
              <q-item-label>{{ item.title }}</q-item-label>
              <q-item-label caption lines="100">
                {{ formatAnswerValue(item.answer) }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import moment from 'moment';
import type { InterviewAnswerDialogData } from 'src/types/internalPatientInterview';

defineProps<{
  modelValue: boolean;
  answer: InterviewAnswerDialogData | null;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
}>();

function formatAnswerValue(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const parsedDate = moment(value, 'YYYY-MM-DD', true);

    if (parsedDate.isValid()) {
      return parsedDate.format('DD/MM/YYYY');
    }

    return value;
  }

  return value || 'Não informado';
}
</script>
