<template>
  <q-page class="q-pa-md">
    <q-btn
      dense
      icon="chevron_left"
      flat
      class="q-mb-lg"
      @click="$router.back()"
    >
      Voltar
    </q-btn>

    <div class="text-h5 page-title q-mb-xl">
      Respostas da entrevista com paciente
    </div>

    <q-card flat class="q-mt-sm">
      <q-card-section>
        <div class="row q-col-gutter-md items-center">
          <div class="col-12 col-md-auto">
            <DateRangeInput
              :currentDate="false"
              :startDate="startDate"
              :endDate="endDate"
              @from="startDate = $event"
              @to="endDate = $event"
            />
          </div>

          <div class="col-12 col-md-auto">
            <q-btn
              dense
              label="Buscar"
              color="secondary"
              class="inter-medium q-px-md"
              size="1rem"
              unelevated
              no-caps
              icon="search"
              @click="loadAnswers"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <div v-if="rows.length === 0 && !loading" class="text-center">
          <div class="text-h6 inter-medium">Nenhum resultado encontrado</div>
          <Vue3Lottie :animationData="notFound" :height="200" :width="200" />
        </div>

        <q-inner-loading
          :showing="loading"
          style="height: 100px"
          color="primary"
        />

        <q-table
          v-if="rows.length > 0"
          v-model:pagination="pagination"
          class="my-sticky-header-table"
          flat
          :rows="rows"
          :columns="columns"
          row-key="id"
          table-header-class="inter-bold text-dark"
          rows-per-page-label="Resultados por página"
          loading-label="Carregando..."
          :loading="loading"
          no-data-label="Sem dados disponíveis"
          :rows-per-page-options="[5, 10, 20, 50]"
        >
          <template #body="props">
            <q-tr :props="props">
              <q-td key="patient" :props="props">
                {{ props.row.patient }}
              </q-td>

              <q-td key="medicalRecord" :props="props">
                {{ props.row.medicalRecord }}
              </q-td>

              <q-td key="date" :props="props">
                {{ props.row.date }}
              </q-td>

              <q-td key="score" :props="props">
                {{ props.row.score }}
              </q-td>

              <q-td key="actions" :props="props" class="text-right">
                <q-btn
                  flat
                  outline
                  color="primary"
                  label="Visualizar"
                  no-caps
                  @click="openAnswerDialog(props.row)"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model="showAnswerDialog">
      <q-card style="width: 900px; max-width: 95vw">
        <q-card-section class="row items-center justify-between">
          <div class="text-h6">Detalhes da entrevista</div>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>

        <q-card-section v-if="selectedAnswer">
          <q-list bordered separator>
            <q-item>
              <q-item-section>
                <q-item-label>Paciente</q-item-label>
                <q-item-label caption lines="2">
                  {{ selectedAnswer.patient }}
                </q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label>CIRURGIA</q-item-label>
                <q-item-label caption lines="2">
                  {{ selectedAnswer.medicalRecord }}
                </q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label>Data da entrevista</q-item-label>
                <q-item-label caption lines="2">
                  {{ selectedAnswer.date }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              v-for="item in selectedAnswer.answers"
              :key="`${selectedAnswer.id}-${item.index}`"
            >
              <q-item-section>
                <q-item-label>{{ item.title }}</q-item-label>
                <q-item-label caption lines="100">
                  {{ formatAnswerValue(item.answer) }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts" setup>
import { Notify } from 'quasar';
import { computed, onMounted, ref } from 'vue';
import moment from 'moment';
import 'moment/dist/locale/pt-br';
import { Vue3Lottie } from 'vue3-lottie';

import DateRangeInput from 'src/components/DateRangeInput.vue';
import notFound from '../assets/notfound.json';
import { loadDashboardGeneral } from 'src/services/NPSService';
import type { Column, IAnswerGeneral } from 'src/types';

interface InterviewAnswerItem {
  index: string;
  title: string;
  answer: string;
}

interface InterviewAnswerRow {
  id: string;
  patient: string;
  medicalRecord: string;
  date: string;
  score: string;
  timestamp: number;
  answers: InterviewAnswerItem[];
}

interface IResponse {
  data: IAnswerGeneral[] | null;
  error: unknown | null;
}

const startDate = ref(moment().subtract(6, 'days').startOf('day').valueOf());
const endDate = ref(moment().endOf('day').valueOf());
const loading = ref(false);
const rows = ref<InterviewAnswerRow[]>([]);
const showAnswerDialog = ref(false);
const selectedAnswer = ref<InterviewAnswerRow | null>(null);

const pagination = ref({
  sortBy: 'timestamp',
  descending: true,
  page: 1,
  rowsPerPage: 10,
});

const columns = computed<Column[]>(() => [
  {
    name: 'patient',
    required: true,
    field: 'patient',
    label: 'PACIENTE',
    sortable: true,
    align: 'left',
  },
  {
    name: 'medicalRecord',
    field: 'medicalRecord',
    label: 'CIRURGIA',
    sortable: true,
    align: 'left',
  },
  {
    name: 'date',
    field: 'date',
    label: 'DATA',
    sortable: true,
    align: 'left',
  },
  {
    name: 'score',
    field: 'score',
    label: 'NOTA GERAL',
    sortable: true,
    align: 'left',
  },
  {
    name: 'actions',
    field: 'actions',
    label: '',
    sortable: false,
    align: 'right',
  },
]);

async function loadAnswers() {
  loading.value = true;

  const { data, error }: IResponse = await loadDashboardGeneral(
    startDate.value,
    endDate.value,
    'interview'
  );

  loading.value = false;

  if (error) {
    Notify.create({
      message: 'Erro ao carregar respostas.',
      color: 'red',
    });
    return;
  }

  rows.value = formatRows(data ?? []);
  pagination.value.page = 1;
}

function formatRows(data: IAnswerGeneral[]) {
  return data.map((item, index) => {
    const answers = (item.answers ?? []) as InterviewAnswerItem[];

    return {
      id: `${item.timestamp}-${index}`,
      patient: getAnswerValue(answers, '0'),
      medicalRecord: getAnswerValue(answers, '2'),
      date: formatInterviewDate(getAnswerValue(answers, '3'), item.timestamp),
      score: getAnswerValue(answers, '18'),
      timestamp: item.timestamp,
      answers,
    };
  });
}

function getAnswerValue(answers: InterviewAnswerItem[], index: string) {
  return (
    answers.find((item) => item.index === index)?.answer || 'Não informado'
  );
}

function formatInterviewDate(answerDate: string, fallbackTimestamp: number) {
  if (answerDate && /^\d{4}-\d{2}-\d{2}$/.test(answerDate)) {
    return moment(answerDate).format('DD/MM/YYYY');
  }

  if (answerDate && /^\d{2}\/\d{2}\/\d{4}$/.test(answerDate)) {
    return answerDate;
  }

  return moment(fallbackTimestamp).format('DD/MM/YYYY');
}

function formatAnswerValue(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return moment(value).format('DD/MM/YYYY');
  }

  return value || 'Não informado';
}

function openAnswerDialog(row: InterviewAnswerRow) {
  selectedAnswer.value = row;
  showAnswerDialog.value = true;
}

onMounted(() => {
  loadAnswers();
});
</script>

<style lang="sass">
.my-sticky-header-table
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    background-color: #fff

  thead tr th
    position: sticky
    z-index: 1

  thead tr:first-child th
    top: 0

  &.q-table--loading thead tr:last-child th
    top: 48px

  tbody
    scroll-margin-top: 48px
</style>
