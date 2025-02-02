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
      :disable="props.disabled"
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
        v-model="showDatePicker"
        transition-show="scale"
        transition-hide="scale"
      >
        <q-date
          v-model="answer"
          mask="YYYY-MM-DD"
          @update:model-value="onDateSelect"
          :options="dateOptions"
          :locale="callLocale"
        >
          <div class="row items-center justify-end">
            <q-btn
              @click="showDatePicker = false"
              label="FECHAR"
              color="primary"
              flat
            />
          </div>
        </q-date>
      </q-popup-proxy>
    </q-input>
  </q-card>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

interface IProps {
  title: string;
  disabled: boolean;
}

const emit = defineEmits(['updateAnswer']);
const props = defineProps<IProps>();

const answer = ref<string | null>(null); // Armazena a data no formato YYYY-MM-DD
const dateDisplay = ref(''); // Data formatada para exibição (DD/MM/YYYY)
const showDatePicker = ref(false); // Controla a exibição do q-date

// Sincroniza o campo de exibição quando a data muda
watch(answer, (newVal) => {
  dateDisplay.value = newVal ? formatDate(newVal) : '';
  emit('updateAnswer', { answer: newVal });
});

// Sincroniza a entrada manual no input com o q-date
watch(dateDisplay, (newVal) => {
  const parsedDate = parseDate(newVal);
  if (parsedDate && parsedDate !== answer.value) {
    answer.value = parsedDate;
  }
});

const callLocale = computed(() => ({
  pluralDay: 'Dias',
  days: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  daysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  months: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ],
  monthsShort: [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ],
  firstDayOfWeek: 1,
}));

// Atualiza a data ao selecionar no q-date
const onDateSelect = (newDate: string) => {
  answer.value = newDate;
  showDatePicker.value = false;
};

// Converte YYYY-MM-DD para DD/MM/YYYY
const formatDate = (date: string) => {
  if (!date) return '';
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
};

// Converte DD/MM/YYYY para YYYY-MM-DD
const parseDate = (date: string) => {
  const parts = date.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
  }
  return '';
};

// Permite apenas datas no passado ou hoje
const dateOptions = (date: string) => {
  return new Date(date) <= new Date();
};
</script>
