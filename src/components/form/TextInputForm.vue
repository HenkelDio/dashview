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
      label="Resposta"
      class="q-mt-md"
      dense
      outlined
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
  emit('updateAnswer', { answer: newVal });
});
</script>
