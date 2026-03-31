<template>
  <q-card style="padding: 20px; text-align: start" bordered flat>
    <div class="text-subtitle1">
      {{ props.title }}
      <span v-if="required" style="color: red; font-size: 0.8rem"
        >* Obrigatório</span
      >
    </div>

    <q-input
      v-model="answer"
      type="number"
      label="Resposta"
      class="q-mt-md"
      dense
      outlined
      min="0"
      max="10"
      :disable="props.disabled"
    />
  </q-card>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

interface IProps {
  title: string;
  disabled: boolean;
  required: boolean;
}

const emit = defineEmits(['updateAnswer']);
const props = defineProps<IProps>();

const answer = ref('');

watch(answer, (newVal) => {
  if (newVal === '') {
    emit('updateAnswer', { answer: '' });
    return;
  }

  const numericValue = Number(newVal);
  if (Number.isNaN(numericValue)) {
    emit('updateAnswer', { answer: '' });
    return;
  }

  const clampedValue = Math.min(10, Math.max(0, numericValue));
  const formattedValue = String(clampedValue);

  if (formattedValue !== newVal) {
    answer.value = formattedValue;
    return;
  }

  emit('updateAnswer', { answer: formattedValue });
});
</script>
