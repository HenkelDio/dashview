<template>
  <div>
    <q-card :class="currentStyles" flat>
      <q-card-section>
        <div class="row justify-between">
          <div class="text-caption">{{ currentType }}</div>
          <div class="text-caption">{{ props.timestamp }}</div>
        </div>

        <div class="inter-bold">Pergunta: {{ question }}</div>
        <div class="inter-medium q-mt-md">
          <div v-if="props.patient">Paciente: {{ patient }}</div>
          <div v-if="props.dateOfAdmission">
            Data de internação: {{ props.dateOfAdmission }}
          </div>
        </div>

        <!-- <q-chip
          v-if="answeredBy.timestamp"
          color="primary"
          square
          text-color="white"
          icon="check_circle"
          class="q-mt-md"
          >respondido em {{ answeredBy.timestamp }} por
          {{ answeredBy.username }}</q-chip
        >

        <q-chip
          v-if="feedbackReturn"
          color="white"
          square
          icon="check_circle"
          class="q-mt-md cursor-pointer"
          outline
          >Marcar como respondido</q-chip
        > -->
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface IProps {
  type: string;
  question: string;
  dateOfAdmission: string | number;
  patient?: string;
  timestamp: string | number;
}

const props = defineProps<IProps>();

const currentType = computed(() => {
  if (props.type === 'DETRACTOR') {
    return 'DETRATOR';
  }

  if (props.type === 'NEUTRAL') {
    return 'NEUTRO';
  }
  return 'PROMOTOR';
});

const currentStyles = computed(() => {
  if (props.type === 'DETRACTOR') {
    return 'bg-red-6 text-white';
  }

  if (props.type === 'NEUTRAL') {
    return 'bg-orange-9 text-white';
  }
  return 'bg-green-6 text-white';
});
</script>
