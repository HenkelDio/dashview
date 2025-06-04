<template>
  <div>
    <div
      v-if="
        !doughnutDataPromoter.labels.length &&
        !doughnutDataDetractor.labels.length &&
        !doughnutDataNeutral.labels.length &&
        !loading
      "
      class="q-mt-xl"
    >
      <div class="text-h6 text-center inter-medium">
        Nenhum resultado encontrado
      </div>
      <Vue3Lottie :animationData="notFound" :height="200" :width="200" />
    </div>

    <div
      v-if="!chartDataScore.labels.length && departmentId && !loading"
      class="q-mt-xl"
    >
      <div class="text-h6 text-center inter-medium">
        Nenhum resultado encontrado
      </div>
      <Vue3Lottie :animationData="notFound" :height="200" :width="200" />
    </div>

    <div class="flex row q-mb-md wrap">
      <!-- Gráfico de Pizza (Notas Promotoras) -->

      <q-card
        class="card-dash full-width"
        flat
        v-if="chartDataScore.labels.length && !loading"
      >
        <q-card-section>
          <div class="text-caption inter-medium text-grey-9 q-mb-lg">
            RELAÇÃO DE SCORE
          </div>
          <div class="chart-container-large">
            <Bar
              ref="dataScoreBar"
              :options="chartOptionsScore"
              :data="chartDataScore"
            />
          </div>
        </q-card-section>
      </q-card>

      <q-skeleton
        type="QToolbar"
        height="500px"
        class="card-dash full-width"
        v-if="loading"
      />

      <q-card
        class="card-dash full-width"
        flat
        v-if="doughnutDataPromoter.labels.length && !loading && !departmentId"
      >
        <q-card-section>
          <div class="text-caption inter-medium text-grey-9 q-mb-lg">
            QUANTIDADE DE NOTAS PROMOTORAS POR DEPARTAMENTO
          </div>
          <div class="chart-container-large">
            <Doughnut
              ref="doughnutPromoter"
              :options="doughnutOptions"
              :data="doughnutDataPromoter"
            />
          </div>
        </q-card-section>
      </q-card>

      <!-- Gráfico de Pizza (Notas Detratoras) -->
      <div class="flex justify-between wrap full-width">
        <q-skeleton
          type="QToolbar"
          height="390px"
          class="card-dash"
          v-if="loading"
        />

        <q-card
          class="card-dash"
          flat
          v-if="
            doughnutDataDetractor.labels.length && !loading && !departmentId
          "
        >
          <q-card-section>
            <div class="text-caption inter-medium text-grey-9 q-mb-lg">
              QUANTIDADE DE NOTAS DETRATORAS POR DEPARTAMENTO
            </div>
            <div class="chart-container">
              <Doughnut
                ref="doughnutDetractor"
                :options="doughnutOptions"
                :data="doughnutDataDetractor"
              />
            </div>
          </q-card-section>
        </q-card>

        <!-- Gráfico de Pizza (Notas Neutras) -->
        <q-card
          class="card-dash"
          flat
          v-if="doughnutDataNeutral.labels.length && !loading && !departmentId"
        >
          <q-skeleton
            type="QToolbar"
            height="390px"
            class="card-dash"
            v-if="loading"
          />

          <q-card-section>
            <div class="text-caption inter-medium text-grey-9 q-mb-lg">
              QUANTIDADE DE NOTAS NEUTRAS POR DEPARTAMENTO
            </div>
            <div class="chart-container">
              <Doughnut
                ref="doughnutNeutral"
                :options="doughnutOptions"
                :data="doughnutDataNeutral"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { Bar, Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LinearScale,
  BarElement,
  CategoryScale,
  PointElement,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { IScoreDepartment } from 'src/types';
import notFound from '../../assets/notfound.json';
import { Vue3Lottie } from 'vue3-lottie';

// Interface de props
interface IProps {
  scoreDepartments: IScoreDepartment;
  loading: boolean;
  answersCount: {
    detractors: number;
    neutrals: number;
    promoters: number;
  };
  departmentId?: string;
}

const props = defineProps<IProps>();

// Registrar componentes do Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartDataLabels,
  LinearScale,
  BarElement,
  CategoryScale,
  LinearScale,
  BarElement,
  ChartDataLabels,
  PointElement
);

// Configurações globais dos gráficos de pizza
const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'right' as const,
    },
    datalabels: {
      display: true,
      color: 'white',
      formatter: (value: number) => value,
      font: {
        weight: 'bold' as const,
        size: 14,
      },
    },
  },
};

// Cores monocromáticas para cada gráfico
const colorPalettes = {
  promoter: [
    '#1E88E5', // azul
    '#43A047', // verde
    '#FB8C00', // laranja
    '#8E24AA', // roxo
    '#00ACC1', // ciano
    '#FDD835', // amarelo
    '#6D4C41', // marrom
    '#C2185B', // rosa escuro
    '#3949AB', // azul intenso
    '#7CB342', // verde oliva
    '#D81B60', // rosa vibrante
    '#5E35B1', // roxo escuro
    '#00897B', // verde água
  ],

  detractor: [
    '#E53935', // vermelho vibrante
    '#6A1B9A', // roxo fechado
    '#F4511E', // laranja queimado
    '#3949AB', // azul forte
    '#C2185B', // rosa escuro
    '#0097A7', // azul petróleo
    '#7B1FA2', // roxo vibrante
    '#1E88E5', // azul
    '#D32F2F', // vermelho escuro
    '#43A047', // verde escuro
    '#FDD835', // amarelo solar
    '#5E35B1', // roxo
    '#00897B', // verde água
  ],

  neutral: [
    '#90A4AE', // cinza azulado
    '#FFC107', // amarelo moderno
    '#26A69A', // verde água
    '#7E57C2', // roxo claro
    '#FF7043', // laranja claro
    '#42A5F5', // azul claro
    '#AB47BC', // roxo suave
    '#66BB6A', // verde médio
    '#FFA726', // laranja médio
    '#26C6DA', // ciano claro
    '#9CCC65', // verde limão
    '#EC407A', // rosa claro
    '#78909C', // cinza escuro
  ],
};

// Dados reativos dos gráficos
import { Chart } from 'chart.js';

const dataScoreBar = ref<Chart | null>(null);
const doughnutDataPromoter = ref({
  labels: [] as string[],
  datasets: [
    {
      label: 'Notas Promotoras',
      data: [] as number[],
      backgroundColor: [] as string[],
      hoverBackgroundColor: [] as string[],
    },
  ],
});

const doughnutDataDetractor = ref({
  labels: [] as string[],
  datasets: [
    {
      label: 'Notas Detratoras',
      data: [] as number[],
      backgroundColor: [] as string[],
      hoverBackgroundColor: [] as string[],
    },
  ],
});

const doughnutDataNeutral = ref({
  labels: [] as string[],
  datasets: [
    {
      label: 'Notas Neutras',
      data: [] as number[],
      backgroundColor: [] as string[],
      hoverBackgroundColor: [] as string[],
    },
  ],
});

const chartOptionsScore = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    indexAxis: 'y',
    legend: {
      display: false, // Esconde a legenda
    },
    datalabels: {
      display: true, // Habilita os rótulos de dados
      color: 'white', // Cor do texto dos rótulos
      font: {
        weight: 'bold' as const,
        size: 14,
      },
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      beginAtZero: true,
    },
    y: {
      beginAtZero: true,
    },
  },
};

const chartDataScore = ref({
  labels: [] as string[],
  datasets: [
    {
      borderRadius: 6,
      label: 'Quantidade de Indicadores',
      data: [] as number[],
      backgroundColor: [
        '#FF1744', // Cor para Detratores
        '#FF6D00', // Cor para Neutros
        '#00E676', // Cor para Promotores
      ],
      hoverBackgroundColor: [
        '#D32F2F', // Hover para Detratores
        '#FBC02D', // Hover para Neutros
        '#388E3C', // Hover para Promotores
      ],
    },
  ],
});

// Função para aplicar cores ao gráfico
const applyColors = (
  dataset: { backgroundColor: string[]; hoverBackgroundColor: string[] },
  colors: string[]
) => {
  dataset.backgroundColor = colors;
  dataset.hoverBackgroundColor = colors.map((color) => `${color}CC`); // Tonalidade mais escura para hover
};

watch(
  () => props.answersCount,
  (newCount) => {
    if (newCount && !Object.values(newCount).every((item) => item === 0)) {
      chartDataScore.value = {
        labels: ['DETRATORES', 'NEUTROS', 'PROMOTORES'],
        datasets: [
          {
            borderRadius: 6,
            label: 'Quantidade de Indicadores',
            data: [newCount.detractors, newCount.neutrals, newCount.promoters],
            backgroundColor: ['#FF1744', '#FF6D00', '#00E676'],
            hoverBackgroundColor: ['#D32F2F', '#FBC02D', '#388E3C'],
          },
        ],
      };
    } else {
      chartDataScore.value.labels = [];
      chartDataScore.value.datasets[0].data = [0, 0, 0];
    }
  }
);

watch(
  () => props.scoreDepartments,
  (newScoreDepartments) => {
    // Atualiza gráfico de Notas Promotoras
    if (
      newScoreDepartments.promoters &&
      !Object.values(newScoreDepartments.promoters).every((item) => item === 0)
    ) {
      doughnutDataPromoter.value.labels = Object.keys(
        newScoreDepartments.promoters
      );
      doughnutDataPromoter.value.datasets[0].data = Object.values(
        newScoreDepartments.promoters
      );
      applyColors(
        doughnutDataPromoter.value.datasets[0],
        colorPalettes.promoter.slice(
          0,
          doughnutDataPromoter.value.labels.length
        )
      );
    } else {
      doughnutDataPromoter.value.labels = [];
      doughnutDataPromoter.value.datasets[0].data = [];
    }

    // Atualiza gráfico de Notas Detratoras
    if (
      newScoreDepartments.detractors &&
      !Object.values(newScoreDepartments.detractors).every((item) => item === 0)
    ) {
      doughnutDataDetractor.value.labels = Object.keys(
        newScoreDepartments.detractors
      );
      doughnutDataDetractor.value.datasets[0].data = Object.values(
        newScoreDepartments.detractors
      );
      applyColors(
        doughnutDataDetractor.value.datasets[0],
        colorPalettes.detractor.slice(
          0,
          doughnutDataDetractor.value.labels.length
        )
      );
    } else {
      doughnutDataDetractor.value.labels = [];
      doughnutDataDetractor.value.datasets[0].data = [];
    }

    // Atualiza gráfico de Notas Neutras
    if (
      newScoreDepartments.neutrals &&
      !Object.values(newScoreDepartments.neutrals).every((item) => item === 0)
    ) {
      doughnutDataNeutral.value.labels = Object.keys(
        newScoreDepartments.neutrals
      );
      doughnutDataNeutral.value.datasets[0].data = Object.values(
        newScoreDepartments.neutrals
      );
      applyColors(
        doughnutDataNeutral.value.datasets[0],
        colorPalettes.neutral.slice(0, doughnutDataNeutral.value.labels.length)
      );
    } else {
      doughnutDataNeutral.value.labels = [];
      doughnutDataNeutral.value.datasets[0].data = [];
    }
  },
  { deep: true, immediate: true }
);
</script>

<style lang="scss">
.card-dash {
  width: 48%;
  margin-bottom: 16px;
}

.chart-container {
  height: 300px;
  max-height: 300px;
}

.chart-container-large {
  height: 400px;
  max-height: 400px;
}

@media (max-width: 700px) {
  .card-dash {
    width: 100%;
  }
}
</style>
