<template>
  <q-card bordered flat class="q-mt-xl">
    <q-card-section>
      <div class="text-subtitle1" style="text-align: start">
        Suas informações de contato
      </div>

      <q-input
        v-model="name"
        ref="nameRef"
        label="Seu nome completo (opcional)"
        class="q-mt-md"
        dense
        :disable="props.disabled"
        outlined
      />
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

interface IProps {
  disabled: boolean;
}

const props = defineProps<IProps>();

const emit = defineEmits(['employeeName']);

const name = ref('');

const nameRef = ref();

watch(name, (newVal) => {
  emit('employeeName', newVal);
});
</script>
