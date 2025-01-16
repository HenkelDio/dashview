<template>
  <q-card style="padding: 20px; text-align: start" bordered flat>
    <div class="text-subtitle1">
      {{ props.title }}
    </div>

    <div class="row justify-center">
      <q-option-group
        v-model="answer"
        type="radio"
        inline
        class="q-mt-md"
        :options="
          props.options.map((option) => ({ label: option, value: option }))
        "
        dense
        :disable="disabled"
      />
    </div>

    <q-input
      v-if="showObservation"
      v-model="observation"
      label="Observações"
      class="q-mt-md"
      dense
      input-class="q-pa-sm"
      :disable="disabled"
    />
  </q-card>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

interface IProps {
  title: string;
  options: string[];
  showObservation: boolean;
  disabled: boolean;
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
