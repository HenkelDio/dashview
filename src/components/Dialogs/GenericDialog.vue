<template>
  <q-dialog v-model="show" persistent>
    <q-card style="width: 500px">
      <q-card-section>
        <div class="inter-medium" style="font-size: 1.5rem">
          {{ props.title }}
        </div>
        <div class="inter-light text-subtitle1">
          {{ props.description }}
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          :color="props.colorLabelButton"
          unelevated
          :label="props.confirmLabelButton"
          @click="emit('confirm')"
          :loading="props.loading"
        />
        <q-btn flat label="Fechar" @click="emit('close')" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

interface IProps {
  title: string;
  description: string;
  confirmLabelButton: string;
  colorLabelButton: string;
  loading: boolean;
}

const props = defineProps<IProps>();

const show = ref(true);

const emit = defineEmits(['close', 'confirm']);
</script>
