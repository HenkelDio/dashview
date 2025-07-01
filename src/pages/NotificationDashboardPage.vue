<template>
  <q-page class="q-pa-md">
    <q-btn
      dense
      icon="chevron_left"
      flat
      class="q-mb-lg"
      @click="$router.back()"
      >Voltar</q-btn
    >
    <div class="flex justify-between items-top q-mt-md">
      <div>
        <div class="text-h5 page-title" style="margin-bottom: 10px">
          Dashboard
        </div>
        <div class="absolute">
          {{ startDate === 0 || endDate === 0 ? '' : dateLabel }}
        </div>
      </div>
      <div class="row q-gutter-x-sm">
        <div class="flex q-gutter-x-md">
          <q-btn
            dense
            label="Filtros"
            flat
            @click="showFilterDialog = true"
            class="inter-medium q-px-md"
            size="1rem"
          />
        </div>
      </div>
    </div>

    <div style="margin-bottom: 10px; margin-top: 50px">
      <div class="flex q-gutter-x-md q-mb-md">
        <q-skeleton height="110px" width="260px" square v-if="loadingAnswers" />
        <q-card flat v-if="!loadingAnswers">
          <q-card-section>
            <div class="flex justify-between">
              <div class="flex column">
                <div class="inter text-grey-8" style="font-size: 0.8rem">
                  TOTAL DE PESQUISAS RESPONDIDAS
                </div>
                <div class="flex row q-mt-sm items-center q-gutter-x-md">
                  <div class="bg-blue-1" style="border-radius: 8px">
                    <q-icon
                      name="signal_cellular_alt"
                      color="primary"
                      size="3rem"
                    />
                  </div>
                  <div
                    class="inter-bold text-h6 text-grey-9"
                    style="margin-bottom: 2px"
                  >
                    {{ answersCount.total }}
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <q-card
        class="card-dash full-width q-mt-md"
        flat
        v-if="!loadingAnswers && chartDataType.labels.length"
      >
        <q-card-section>
          <div class="flex justify-between items-center q-mb-lg">
            <div class="text-caption inter-medium text-grey-9">
              CATEGORIA DA NOTIFICAÇÃO
            </div>
          </div>
          <div class="chart-container-large">
            <Bar :options="chartOptionsScore" :data="chartDataType" />
          </div>
        </q-card-section>
      </q-card>

      <q-card
        class="card-dash full-width q-mt-md"
        flat
        v-if="!loadingAnswers && chartDataOrigin.labels.length"
      >
        <q-card-section>
          <div class="flex justify-between items-center q-mb-lg">
            <div class="text-caption inter-medium text-grey-9">
              ORIGEM DA NOTIFICAÇÃO
            </div>
          </div>
          <div class="chart-container-large">
            <Bar :options="chartOptionsScore" :data="chartDataOrigin" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <q-dialog v-model="showFilterDialog" persistent>
      <q-card style="width: 500px">
        <q-card-section>
          <div class="text-h6">Filtros</div>
          <div class="q-mt-md q-gutter-y-md">
            <DateRangeInput
              @from="startDate = $event"
              @to="endDate = $event"
              :currentDate="true"
              :startDate="startDate"
              :endDate="endDate"
            />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Fechar" flat @click="showFilterDialog = false" />
          <q-btn
            label="BUSCAR"
            color="primary"
            unelevated
            icon-right="search"
            @click="getGeneralAnswers"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Bar } from 'vue-chartjs';
import { Notify } from 'quasar';
import moment from 'moment';
import 'moment/dist/locale/pt-br';

import DateRangeInput from 'src/components/DateRangeInput.vue';
import { loadDashboardGeneral } from 'src/services/NPSService';
import { IAnswerGeneral } from 'src/types';

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

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartDataLabels
);

// const loadingScore = ref(false);
const loadingAnswers = ref(false);
const showFilterDialog = ref(false);

const answersCount = ref({
  total: 0,
});

const chartOptionsScore = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
  plugins: {
    legend: { display: false },
    datalabels: {
      display: true,
      color: 'black',
      font: { weight: 'bold' as const, size: 14 },
      anchor: 'end' as const,
      align: 'start' as const,
      offset: -15,
      formatter: (value: number) => (value > 0 ? value : null),
    },
    title: { display: false },
  },
  scales: {
    x: { beginAtZero: true, grid: { display: false } },
    y: { beginAtZero: true, grid: { display: false } },
  },
};

const chartDataType = ref({
  labels: [
    'Experiência',
    'Segurança do paciente',
    'Falhas de processos',
    'Conduta ética',
    'Segurança do colaborador/ equipe do corpo clínico',
  ],
  datasets: [
    {
      borderRadius: 6,
      label: 'Quantidade',
      data: [12, 8, 6, 5, 10],
      backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC', '#FF7043'],
      hoverBackgroundColor: [
        '#1E88E5',
        '#43A047',
        '#FB8C00',
        '#9C27B0',
        '#F4511E',
      ],
    },
  ],
});

const chartDataOrigin = ref({
  labels: [
    'Colaborador contratado',
    'Corpo clínico',
    'Terceiro (fornecedor, prestador de serviço etc.)',
  ],
  datasets: [
    {
      borderRadius: 6,
      label: 'Quantidade',
      data: [9, 14, 7],
      backgroundColor: ['#26A69A', '#5C6BC0', '#EF5350'],
      hoverBackgroundColor: ['#00897B', '#3949AB', '#E53935'],
    },
  ],
});

const answers = ref<IAnswerGeneral[]>([]);
const startDate = ref(0);
const endDate = ref(0);

const dateLabel = computed(() => {
  moment.locale('pt-br');
  return `De ${moment(startDate.value).format('DD/MM/YYYY')} até ${moment(
    endDate.value
  ).format('DD/MM/YYYY')}`;
});

async function getGeneralAnswers() {
  loadingAnswers.value = true;
  try {
    const { data } = await loadDashboardGeneral(
      startDate.value,
      endDate.value,
      'notification'
    );
    if (data) {
      answers.value = data;

      const categoryMap: Record<string, number> = {};
      const originMap: Record<string, number> = {};

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.forEach((item: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const category = item.answers.find((a: any) =>
          a.title.includes('relato está relacionado')
        )?.answer;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const origin = item.answers.find((a: any) =>
          a.title.includes('Perfil do notificador')
        )?.answer;

        if (category) {
          categoryMap[category] = (categoryMap[category] || 0) + 1;
        }

        if (origin) {
          originMap[origin] = (originMap[origin] || 0) + 1;
        }
      });

      // Atualiza dados do gráfico de categoria
      chartDataType.value.labels = Object.keys(categoryMap);
      chartDataType.value.datasets[0].data = Object.values(categoryMap);

      // Atualiza dados do gráfico de origem
      chartDataOrigin.value.labels = Object.keys(originMap);
      chartDataOrigin.value.datasets[0].data = Object.values(originMap);

      answersCount.value.total = answers.value.length;
    }
  } catch (err) {
    Notify.create({
      message: 'Erro ao buscar dados.',
      type: 'negative',
    });
  } finally {
    loadingAnswers.value = false;
  }
}

onMounted(() => {
  getGeneralAnswers();
});
</script>

<style scoped lang="scss">
.chart-container-large {
  width: 100%;
  height: 350px;
}
.page-title {
  font-weight: 600;
}
</style>
