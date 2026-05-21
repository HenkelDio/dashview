<template>
  <q-page class="q-pa-md internal-patient-dashboard">
    <q-btn
      dense
      icon="chevron_left"
      flat
      class="q-mb-lg"
      @click="$router.back()"
    >
      Voltar
    </q-btn>

    <div class="dashboard-hero q-mb-xl">
      <div>
        <div class="text-h5 page-title">Entrevista com paciente internado</div>
        <div class="text-body2 text-grey-7 q-mt-sm hero-copy">
          Indicadores da pesquisa de experiência do paciente internado,
          carregados conforme o período selecionado.
        </div>
      </div>

      <q-card flat bordered class="filter-card q-mt-lg">
        <q-card-section
          class="row items-center justify-between q-col-gutter-md"
        >
          <div class="col-12 col-md">
            <div class="text-caption text-grey-7">PERÍODO SELECIONADO</div>
            <div class="text-subtitle2 text-weight-medium text-grey-10 q-mt-xs">
              {{ dateLabel }}
            </div>
          </div>

          <div class="col-12 col-md-auto filter-input-wrapper">
            <DateRangeInput
              :startDate="startDate"
              :endDate="endDate"
              @from="startDate = $event"
              @to="endDate = $event"
            />
          </div>
        </q-card-section>
      </q-card>

      <div class="stats-grid q-mt-lg">
        <q-card flat bordered class="stat-card">
          <q-card-section>
            <div class="text-caption text-grey-7">TOTAL DE ENTREVISTAS</div>
            <div class="text-h4 text-weight-bold text-grey-10 q-mt-sm">
              {{ loadingDashboard ? '-' : dashboardSummary.totalInterviews }}
            </div>
          </q-card-section>
        </q-card>

        <q-card flat bordered class="stat-card">
          <q-card-section>
            <div class="text-caption text-grey-7">PERGUNTAS COM GRÁFICO</div>
            <div class="text-h4 text-weight-bold text-grey-10 q-mt-sm">
              {{ loadingDashboard ? '-' : dashboardSummary.totalCharts }}
            </div>
          </q-card-section>
        </q-card>

        <q-card flat bordered class="stat-card">
          <q-card-section>
            <div class="text-caption text-grey-7">MÉDIA DA EXPERIÊNCIA</div>
            <div class="text-h4 text-weight-bold text-grey-10 q-mt-sm">
              {{ loadingDashboard ? '-' : dashboardSummary.averageScore }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div v-if="loadingDashboard" class="question-grid">
      <q-skeleton
        v-for="item in 6"
        :key="item"
        height="360px"
        square
        class="dashboard-skeleton"
      />
    </div>

    <q-card
      v-else-if="!questionSections.length"
      flat
      bordered
      class="empty-state-card"
    >
      <q-card-section class="text-center q-py-xl">
        <div class="text-subtitle1 text-weight-medium text-grey-9">
          Nenhum dado encontrado para o período selecionado.
        </div>
        <div class="text-body2 text-grey-7 q-mt-sm">
          Ajuste a data inicial e final para visualizar as respostas da
          entrevista.
        </div>
      </q-card-section>
    </q-card>

    <template v-else>
      <div
        v-for="section in questionSections"
        :key="section.id"
        class="q-mb-xl"
      >
        <div class="row items-end justify-between q-mb-md section-header">
          <div>
            <div class="text-overline text-primary">{{ section.title }}</div>
            <div class="text-subtitle1 text-weight-medium text-grey-10">
              {{ section.subtitle }}
            </div>
          </div>
        </div>

        <div class="question-grid">
          <InternalPatientQuestionChart
            v-for="question in section.questions"
            :key="question.id"
            :section="section.shortTitle"
            :question="question.title"
            :description="question.description"
            :options="question.options"
          />
        </div>
      </div>

      <div class="q-mb-xl">
        <div class="row items-end justify-between q-mb-md section-header">
          <div>
            <div class="text-overline text-primary">Observações do período</div>
            <div class="text-subtitle1 text-weight-medium text-grey-10">
              {{ observationsSubtitle }}
            </div>
          </div>
        </div>

        <q-card flat bordered class="observations-card">
          <q-card-section
            v-if="!periodObservations.length"
            class="text-body2 text-grey-7"
          >
            Nenhuma observação registrada para o período selecionado.
          </q-card-section>

          <q-list v-else separator>
            <q-item
              v-for="observation in periodObservations"
              :key="observation.id"
              class="q-py-md"
            >
              <q-item-section>
                <q-item-label lines="4">{{ observation.value }}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-btn
                  outline
                  color="primary"
                  no-caps
                  label="Ver mais"
                  :loading="loadingObservationId === observation.id"
                  @click="openObservationDetails(observation)"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </template>

    <InternalPatientInterviewDialog
      v-model="showAnswerDialog"
      :answer="selectedAnswer"
    />
  </q-page>
</template>

<script setup lang="ts">
import moment from 'moment';
import 'moment/dist/locale/pt-br';
import { computed, ref, watch } from 'vue';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Notify } from 'quasar';

import DateRangeInput from 'src/components/DateRangeInput.vue';
import InternalPatientInterviewDialog from 'src/components/InternalPatientInterviewDialog.vue';
import InternalPatientQuestionChart from 'src/components/InternalPatientQuestionChart.vue';
import {
  getGeneralAnswerById,
  loadGeneralDashboardAnalytics,
} from 'src/services/NPSService';
import type { IAnswer, IAnswerGeneral, IQuestion } from 'src/types';
import type {
  InterviewAnswerDialogData,
  InterviewAnswerItem,
} from 'src/types/internalPatientInterview';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartDataLabels
);

type QuestionOption = {
  label: string;
  value: number;
  color: string;
};

type DashboardQuestion = {
  id: string;
  title: string;
  description?: string;
  options: QuestionOption[];
};

type DashboardSection = {
  id: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  questions: DashboardQuestion[];
};

type ApiDashboardOption = {
  label: string;
  value: number;
};

type ApiDashboardQuestion = {
  index: string;
  title: string;
  inputType: string;
  totalResponses: number;
  average?: number;
  options: ApiDashboardOption[];
};

type ApiDashboardSection = {
  id: string;
  title: string;
  questions: ApiDashboardQuestion[];
};

type ApiDashboardObservation = {
  id: string;
  value: string;
};

type ApiDashboardResponse = {
  type: string;
  startDate: number;
  endDate: number;
  summary: {
    totalAnswers: number;
    totalQuestions: number;
    averageScore: number;
  };
  sections: ApiDashboardSection[];
  observations: ApiDashboardObservation[];
};

const palette = {
  green: '#34a853',
  blue: '#4285f4',
  amber: '#fbbc04',
  red: '#ea4335',
  gray: '#9aa0a6',
  teal: '#00acc1',
  indigo: '#5c6bc0',
  orange: '#fb8c00',
  cyan: '#26c6da',
};

const startDate = ref(moment().subtract(6, 'days').startOf('day').valueOf());
const endDate = ref(moment().endOf('day').valueOf());
const loadingDashboard = ref(false);
const dashboardData = ref<ApiDashboardResponse | null>(null);
const showAnswerDialog = ref(false);
const selectedAnswer = ref<InterviewAnswerDialogData | null>(null);
const loadingObservationId = ref<string | null>(null);
let loadDashboardTimeout: ReturnType<typeof setTimeout> | null = null;

const dateLabel = computed(() => {
  moment.locale('pt-br');
  return `De ${moment(startDate.value).format('DD/MM/YYYY')} até ${moment(
    endDate.value
  ).format('DD/MM/YYYY')}`;
});

const dashboardSummary = computed(() => {
  return {
    totalCharts: dashboardData.value?.summary.totalQuestions ?? 0,
    totalInterviews: dashboardData.value?.summary.totalAnswers ?? 0,
    averageScore: (dashboardData.value?.summary.averageScore ?? 0).toFixed(1),
  };
});

const questionSections = computed<DashboardSection[]>(() => {
  return (dashboardData.value?.sections ?? []).map((section) => ({
    id: section.id,
    title: section.title,
    shortTitle: removeSectionNumber(section.title),
    subtitle: buildSectionSubtitle(section.questions),
    questions: section.questions.map((question) => ({
      id: question.index,
      title: question.title,
      description: buildQuestionDescription(question),
      options: mapQuestionOptions(question),
    })),
  }));
});

const periodObservations = computed<ApiDashboardObservation[]>(() => {
  return dashboardData.value?.observations ?? [];
});

const observationsSubtitle = computed(() => {
  const total = periodObservations.value.length;

  if (!total) {
    return 'Sem observações registradas';
  }

  return total === 1 ? '1 observação registrada' : `${total} observações registradas`;
});

function buildQuestionDescription(question: ApiDashboardQuestion) {
  if (question.inputType === 'number' && typeof question.average === 'number') {
    return `Total de respostas: ${
      question.totalResponses
    } | Média: ${question.average.toFixed(1)}`;
  }

  return `Total de respostas: ${question.totalResponses}`;
}

function mapQuestionOptions(question: ApiDashboardQuestion) {
  const options = question.options ?? [];

  if (question.inputType === 'number') {
    return options.map((option) => ({
      label: option.label,
      value: option.value,
      color: getNumericColor(option.label),
    }));
  }

  return options.map((option) => ({
    label: option.label,
    value: option.value,
    color: getOptionColor(option.label),
  }));
}

function getOptionColor(label: string) {
  const normalizedLabel = label.trim().toLowerCase();

  const colorByLabel: Record<string, string> = {
    sempre: palette.green,
    'na maioria das vezes': palette.blue,
    raramente: palette.amber,
    nunca: palette.red,
    sim: palette.green,
    não: palette.red,
    'não se aplica': palette.gray,
    'nao se aplica': palette.gray,
  };

  return colorByLabel[normalizedLabel] ?? palette.teal;
}

function getNumericColor(label: string) {
  const score = Number(label);

  if (score <= 3) {
    return palette.red;
  }

  if (score <= 6) {
    return palette.orange;
  }

  if (score <= 8) {
    return palette.cyan;
  }

  return palette.indigo;
}

function removeSectionNumber(title: string) {
  return title.replace(/^\d+\.\s*/, '').trim();
}

function buildSectionSubtitle(questions: ApiDashboardQuestion[]) {
  const totalQuestions = questions.length;
  return totalQuestions === 1
    ? '1 pergunta analisada'
    : `${totalQuestions} perguntas analisadas`;
}

function getQuestionAnswer(questions: InterviewAnswerItem[], index: string) {
  return (
    questions.find((item) => item.index === index)?.answer || 'Não informado'
  );
}

function normalizeAnswerValue(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return 'Não informado';
  }

  return String(value);
}

function formatInterviewDate(answerDate: string, fallbackTimestamp: number) {
  if (answerDate && /^\d{4}-\d{2}-\d{2}$/.test(answerDate)) {
    return moment(answerDate).format('DD/MM/YYYY');
  }

  if (answerDate && /^\d{2}\/\d{2}\/\d{4}$/.test(answerDate)) {
    return answerDate;
  }

  if (fallbackTimestamp) {
    return moment(fallbackTimestamp).format('DD/MM/YYYY');
  }

  return 'Não informado';
}

function mapAnswerToDialogData(id: string, answerData: IAnswer | IAnswerGeneral) {
  const answersFromGeneral = (answerData as IAnswerGeneral).answers ?? [];
  const questionsFromNps = (answerData as IAnswer).questions ?? [];

  const questions =
    answersFromGeneral.length > 0
      ? answersFromGeneral.map((item) => ({
          index: String(item.index),
          title: item.title,
          answer: normalizeAnswerValue(item.answer),
        }))
      : (questionsFromNps as IQuestion[]).map((question) => ({
          index: question.index,
          title: question.title,
          answer: question.answer || 'Não informado',
        }));

  return {
    id,
    patient: (answerData as IAnswer).patientName || getQuestionAnswer(questions, '0'),
    medicalRecord: getQuestionAnswer(questions, '2'),
    date: formatInterviewDate(
      getQuestionAnswer(questions, '3'),
      (answerData as IAnswerGeneral).timestamp || (answerData as IAnswer).timestamp
    ),
    answers: questions,
  };
}

async function openObservationDetails(observation: ApiDashboardObservation) {
  loadingObservationId.value = observation.id;

  const { data, error } = await getGeneralAnswerById(observation.id);
  loadingObservationId.value = null;

  if (error || !data) {
    Notify.create({
      message: 'Erro ao carregar detalhes da observação.',
      type: 'negative',
    });
    return;
  }

  selectedAnswer.value = mapAnswerToDialogData(
    observation.id,
    data as IAnswer | IAnswerGeneral
  );
  showAnswerDialog.value = true;
}

async function loadDashboard() {
  if (!startDate.value || !endDate.value) {
    return;
  }

  loadingDashboard.value = true;

  const { data, error } = await loadGeneralDashboardAnalytics(
    startDate.value,
    endDate.value,
    'interview'
  );

  if (error) {
    dashboardData.value = null;
    Notify.create({
      message: 'Erro ao carregar dashboard da entrevista.',
      type: 'negative',
    });
    loadingDashboard.value = false;
    return;
  }

  dashboardData.value = data;
  loadingDashboard.value = false;
}

watch(
  [startDate, endDate],
  () => {
    if (loadDashboardTimeout) {
      clearTimeout(loadDashboardTimeout);
    }

    loadDashboardTimeout = setTimeout(() => {
      loadDashboard();
    }, 250);
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.internal-patient-dashboard {
  background: radial-gradient(
      circle at top right,
      rgba(66, 133, 244, 0.12),
      transparent 28%
    ),
    linear-gradient(180deg, #f8fafc 0%, #ffffff 30%);
}

.page-title {
  font-weight: 700;
}

.hero-copy {
  max-width: 760px;
  line-height: 1.5;
}

.dashboard-hero {
  padding: 8px 0 4px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.stat-card {
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.9);
}

.filter-card {
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.92);
}

.filter-input-wrapper {
  min-width: 280px;
}

.section-header {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 12px;
}

.question-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
}

.dashboard-skeleton {
  border-radius: 18px;
}

.empty-state-card {
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.92);
}

.observations-card {
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.92);
}

@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .filter-input-wrapper {
    width: 100%;
    min-width: 0;
  }
}
</style>
