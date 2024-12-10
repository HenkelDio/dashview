<template>
  <q-card style="padding: 20px; text-align: start" bordered flat>
    <div class="text-subtitle1">
      {{ props.title }}
    </div>

    <q-input v-model="answer" label="Resposta" class="q-mt-md" dense outlined />
  </q-card>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

interface IProps {
  title: string;
}

const emit = defineEmits(['updateAnswer']);
const props = defineProps<IProps>();

const answer = ref('');

watch(answer, (newVal) => {
  emit('updateAnswer', { answer: newVal });
});
</script>
