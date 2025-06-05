<template>
  <q-page class="q-pa-md q-pt-md">
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

        <q-skeleton height="110px" width="530px" square v-if="loadingAnswers" />
        <q-card flat v-if="!loadingAnswers">
          <q-card-section>
            <div class="flex justify-between">
              <div class="flex column">
                <div class="row justify-between">
                  <div class="inter text-grey-8" style="font-size: 0.8rem">
                    TOTAL DE PERGUNTAS RESPONDIDAS POR TIPO
                  </div>
                </div>

                <div class="flex justify-between q-mt-sm q-gutter-x-md">
                  <div class="flex row items-center q-gutter-x-md">
                    <div class="bg-red-1" style="border-radius: 8px">
                      <q-icon name="thumb_down" color="red" size="3rem" />
                    </div>
                    <div class="text-grey-9">
                      <div class="inter-bold text-h6">
                        {{ answersCount.complaint }}
                      </div>
                      <div class="inter text-caption">RECLAMAÇÃO</div>
                    </div>
                  </div>

                  <div class="flex row items-center q-gutter-x-md">
                    <div class="bg-green-1" style="border-radius: 8px">
                      <q-icon name="thumb_up" color="green" size="3rem" />
                    </div>
                    <div class="text-grey-9">
                      <div class="inter-bold text-h6">
                        {{ answersCount.compliment }}
                      </div>
                      <div class="inter text-caption">ELOGIO</div>
                    </div>
                  </div>

                  <div class="flex row items-center q-gutter-x-md">
                    <div class="bg-grey-3" style="border-radius: 8px">
                      <q-icon name="lightbulb" color="grey" size="3rem" />
                    </div>
                    <div class="text-grey-9">
                      <div class="inter-bold text-h6">
                        {{ answersCount.suggestion }}
                      </div>
                      <div class="inter text-caption">SUGESTÃO</div>
                    </div>
                  </div>

                  <div class="flex row items-center q-gutter-x-md">
                    <div class="bg-yellow-3" style="border-radius: 8px">
                      <q-icon name="dangerous" color="yellow-9" size="3rem" />
                    </div>
                    <div class="text-grey-9">
                      <div class="inter-bold text-h6">
                        {{ answersCount.denunciation }}
                      </div>
                      <div class="inter text-caption">DENÚNCIA</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <q-card
        class="card-dash full-width"
        flat
        v-if="!loadingAnswers && chartDataScore.labels.length"
      >
        <q-card-section>
          <div class="flex justify-between items-center q-mb-lg">
            <div class="text-caption inter-medium text-grey-9">
              RELAÇÃO DE TIPOS
            </div>
            <q-btn
              icon="save_alt"
              label="Salvar"
              flat
              dense
              @click="saveChartAsImage"
              class="inter-medium"
              color="primary"
            />
          </div>
          <div class="chart-container-large">
            <Bar
              ref="barChartRef"
              :options="chartOptionsScore"
              :data="chartDataScore"
            />
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
            @click="getRhAnswers"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { Bar } from 'vue-chartjs';
import { Notify } from 'quasar';
import moment from 'moment';
import 'moment/dist/locale/pt-br';

import DateRangeInput from 'src/components/DateRangeInput.vue';
import { loadDashboardRh } from 'src/services/NPSService';
import { IAnswerRH } from 'src/types';

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
  compliment: 0,
  suggestion: 0,
  complaint: 0,
  denunciation: 0,
});

const chartDataScore = ref({
  labels: ['Reclamação', 'Sugestão', 'Elogio', 'Denúncia'],
  datasets: [
    {
      borderRadius: 6,
      label: 'Quantidade',
      data: [0, 0, 0, 0],
      backgroundColor: ['#F44336', '#9E9E9E', '#4CAF50', '#f5ee27'],
      hoverBackgroundColor: ['#D32F2F', '#757575', '#388E3C', '#757575'],
    },
  ],
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

const answersRh = ref<IAnswerRH[]>([]);
const startDate = ref(0);
const endDate = ref(0);

const barChartRef = ref<InstanceType<typeof Bar> | null>(null);

const dateLabel = computed(() => {
  moment.locale('pt-br');
  return `De ${moment(startDate.value).format('DD/MM/YYYY')} até ${moment(
    endDate.value
  ).format('DD/MM/YYYY')}`;
});

watch(
  answersCount,
  (newCounts) => {
    chartDataScore.value.datasets[0].data = [
      newCounts.complaint,
      newCounts.suggestion,
      newCounts.compliment,
      newCounts.denunciation,
    ];
  },
  { deep: true }
);

function saveChartAsImage() {
  if (barChartRef.value?.chart) {
    const chartInstance = barChartRef.value.chart as ChartJS;
    chartInstance.update('none');
    setTimeout(() => {
      const imageBase64 = chartInstance.toBase64Image('image/png', 1);
      if (imageBase64) {
        const link = document.createElement('a');
        link.href = imageBase64;
        link.download = 'grafico_relacao_score.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        Notify.create({
          message: 'Gráfico salvo com sucesso!',
          type: 'positive',
          icon: 'cloud_download',
        });
      } else {
        Notify.create({
          message: 'Não foi possível gerar a imagem do gráfico.',
          type: 'negative',
        });
      }
    }, 100);
  } else {
    Notify.create({
      message:
        'Referência do gráfico não encontrada ou gráfico não renderizado.',
      type: 'negative',
    });
  }
}

async function getRhAnswers() {
  loadingAnswers.value = true;
  try {
    const { data } = await loadDashboardRh(startDate.value, endDate.value);
    if (data) {
      answersRh.value = data;

      const types = [
        'complaint',
        'suggestion',
        'compliment',
        'denunciation',
      ] as const;
      types.forEach((type) => {
        answersCount.value[type] = answersRh.value.filter(
          (a) => a.type.value === type
        ).length;
      });

      answersCount.value.total = types.reduce(
        (sum, type) => sum + answersCount.value[type],
        0
      );
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
  getRhAnswers();
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
