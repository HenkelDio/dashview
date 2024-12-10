<template>
  <q-card style="padding: 20px; text-align: start" bordered flat>
    <div class="text-subtitle1">
      {{ props.title }}
    </div>

    <!-- Campo de Entrada com q-date -->
    <q-input
      id="period"
      outlined
      dense
      v-model="dateDisplay"
      mask="##/##/####"
      label="Selecione uma data"
      @focus="showDatePicker = true"
    >
      <template v-slot:append>
        <q-icon
          name="event"
          class="cursor-pointer"
          @click="showDatePicker = !showDatePicker"
        />
      </template>

      <!-- Popup do q-date -->
      <q-popup-proxy
        v-if="showDatePicker"
        ref="qDateProxy"
        transition-show="scale"
        transition-hide="scale"
      >
        <q-date
          v-model="answer"
          mask="DD/MM/YYYY"
          format="DD/MM/YYYY"
          :options="dateOptions"
          @input="onDateSelect"
        >
          <div class="row items-center justify-end">
            <q-btn v-close-popup label="FECHAR" color="primary" flat />
          </div>
        </q-date>
      </q-popup-proxy>
    </q-input>
  </q-card>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

interface IProps {
  title: string;
}

const emit = defineEmits(['updateAnswer']);
const props = defineProps<IProps>();

const answer = ref(''); // Armazena a data selecionada no formato YYYY-MM-DD
const dateDisplay = ref(''); // Armazena o valor exibido no input (DD/MM/YYYY)
const showDatePicker = ref(false); // Controla a exibição do q-date

watch(answer, (newVal) => {
  // Atualiza o valor exibido no input quando a data é selecionada
  dateDisplay.value = formatDate(newVal);
  emit('updateAnswer', { answer: newVal });
});

watch(dateDisplay, (newVal) => {
  // Quando o valor do input for alterado, tenta atualizar o modelo
  if (newVal && newVal !== answer.value) {
    const formattedDate = parseDate(newVal);
    if (formattedDate) {
      answer.value = formattedDate;
    }
  }
});

const onDateSelect = () => {
  // Quando uma data é selecionada no q-date, fecha o popup
  showDatePicker.value = false;
};

// Função para formatar a data no formato DD/MM/YYYY
const formatDate = (date: string) => {
  if (!date) return '';
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
};

// Função para parse a data digitada no formato DD/MM/YYYY para YYYY-MM-DD
const parseDate = (date: string) => {
  let dateParts = date.split('/');
  dateParts = dateParts.filter((d) => d !== 'undefined');
  if (dateParts.length === 3) {
    const [day, month, year] = dateParts;
    return `${year}-${month}-${day}`;
  }
  return ''; // Retorna vazio se a data não for válida
};

function dateOptions(date: string) {
  return new Date(date) <= new Date();
}
</script>
