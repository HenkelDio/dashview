<template>
  <q-card class="q-mt-md" flat>
    <q-card-section>
      <div>
        <div class="text-body2 inter-medium text-grey-9">
          {{ props.details.title }}
        </div>
        <div class="text-caption inter-medium text-grey-9 q-mb-lg">
          {{
            props.details.detractors +
            props.details.neutrals +
            props.details.promoters
          }}
          respostas
        </div>
      </div>
      <div style="height: 250px; max-height: 250px" v-if="props.details">
        <Bar
          ref="dataScoreBar"
          :options="chartOptionsScore"
          :data="chartDataScore"
        />
      </div>

      <q-expansion-item
        expand-separator
        icon="info"
        label="Observações"
        :caption="props.details.observations.length + ' respostas'"
      >
        <q-card>
          <q-card-section>
            <q-list
              bordered
              separator
              class="rounded-borders"
              v-for="item in props.details.observations"
              :key="item"
            >
              <q-item>{{ item }}</q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import { Bar } from 'vue-chartjs';
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
import { ref } from 'vue';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LinearScale,
  BarElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  ChartDataLabels
);

interface IProps {
  details: {
    title: string;
    observations: string[];
    detractors: number;
    neutrals: number;
    promoters: number;
  };
}

const props = defineProps<IProps>();

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
  labels: ['DETRATORES', 'NEUTROS', 'PROMOTORES'] as string[],
  datasets: [
    {
      borderRadius: 6,
      label: 'Quantidade de Indicadores',
      data: [
        props.details.detractors,
        props.details.neutrals,
        props.details.promoters,
      ] as number[],
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
</script>
