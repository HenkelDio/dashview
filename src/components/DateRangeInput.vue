<template>
  <div id="period-date">
    <q-input
      id="period"
      outlined
      dense
      readonly
      v-model="dateDisplay"
      bg-color="white"
      label="Período"
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy
            ref="qDatePopup"
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date
              mask="DD/MM/YYYY"
              v-model="dateValue"
              :options="dateOptions"
              range
              :locale="callLocale"
            >
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="FECHAR" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import moment from 'moment';

const emit = defineEmits(['to', 'from']);

interface IProps {
  currentDate?: boolean;
  startDate?: number;
  endDate?: number;
}

const props = defineProps<IProps>();

const dateValue = ref<{ from: string; to: string }>({ from: '', to: '' });

const dateDisplay = computed(() => {
  if (!dateValue.value) {
    return '';
  }

  if (!dateValue.value.from || !dateValue.value.to) {
    return '';
  }

  const displayDate = `${dateValue.value.from} até ${dateValue.value.to}`;
  return displayDate;
});

function dateOptions(date: string) {
  return new Date(date) <= new Date();
}

function setCurrentDate() {
  if (!props.currentDate) return;
  if (!dateValue.value) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  dateValue.value.from = formatDate(yesterday);
  dateValue.value.to = formatDate(new Date());

  emit('to', formatDateToTimestamp(dateValue.value.to));
  emit('from', formatDateToTimestamp(dateValue.value.from));
}

function formatDate(date: Date) {
  const formattedDate = new Date(date);

  const year = formattedDate.getFullYear();
  const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');
  const day = formattedDate.getDate().toString().padStart(2, '0');

  return `${day}/${month}/${year}`;
}

watch(
  () => dateValue.value.to,
  () => {
    emit('to', formatDateToTimestamp(dateValue.value.to));
  }
);

watch(
  () => dateValue.value.from,
  () => {
    emit('from', formatDateToTimestamp(dateValue.value.from));
  }
);

function formatDateToTimestamp(date: string) {
  return moment(date, 'DD/MM/YYYY').valueOf();
}

const callLocale = computed(() => {
  return JSON.parse(
    '{"pluralDay":"Dias","days":["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"],"daysShort":["Dom","Seg","Ter","Qua","Qui","Sex","Sab"],"months":["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],"monthsShort":["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"],"firstDayOfWeek":1}'
  );
});

onMounted(() => {
  if (props.startDate && props.endDate) {
    dateValue.value.from = formatDate(new Date(props.startDate));
    dateValue.value.to = formatDate(new Date(props.endDate));
  } else {
    setCurrentDate();
  }
});
</script>

<style lang="scss">
#period-date {
  .q-field--outlined.q-field--readonly .q-field__control::before {
    opacity: 1;
    background: transparent;
    border-style: solid !important;
  }
}
</style>
