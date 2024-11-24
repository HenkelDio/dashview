<template>
  <div>
    <div class="flex row q-gutter-md q-mb-md">
      <q-card class="card-dash" flat>
        <q-card-section>
          <div class="text-caption inter-medium text-grey-9 q-mb-lg">
            INDICADOR DE RECEBIDO E FATURADO %
          </div>
          <div style="height: 300px">
            <Doughnut
              id="my-chart-id"
              :options="chartOptions"
              :data="chartData"
            />
          </div>
        </q-card-section>
      </q-card>
      <div class="card-dash">
        <q-card style="height: 100%" flat>
          <q-card-section>
            <div class="text-caption inter-medium text-grey-9 q-mb-xl">
              INDICADOR DE RECEBIDO E FATURADO %
            </div>
            <div style="height: 300px">
              <Bar
                id="my-horizontal-bar-chart"
                :options="chartOptionsDepartament"
                :data="chartDataDepartament"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Doughnut, Bar } from 'vue-chartjs';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  ChartDataLabels,
  PointElement
);

const chartOptionsDepartament = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: false, // Esconde a legenda
    },
    datalabels: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      beginAtZero: true,
    },
  },
};

// Dados para o gráfico de barras horizontais
const chartDataDepartament = {
  labels: ['RECEBIDO', 'FATURADO'],
  datasets: [
    {
      label: 'Quantidade de Indicadores',
      data: [500000, 450000], // Quantidades para cada setor
      backgroundColor: '#1565C0', // Cor das barras
      hoverBackgroundColor: '#0D47A1', // Cor ao passar o mouse
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'right' as const,
    },
    datalabels: {
      display: true,
      color: 'white', // Cor do texto (escolha a cor de acordo com o fundo)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatter: (value: any) => value, // Formatar para exibir o valor numérico
      font: {
        weight: 'bold' as const,
        size: 14,
      },
    },
  },
};

const chartData = {
  labels: ['RECEBIDO', 'FATURADO'],
  datasets: [
    {
      label: 'Indicadores por Perspectiva',
      data: [500000, 450000],
      backgroundColor: ['#0D47A1', '#1976D2'], // Tonalidades de azul
      hoverBackgroundColor: ['#0B3D91', '#1565C0'], // Tonalidades de azul mais escuras
    },
  ],
};
</script>

<style lang="scss">
.card-dash {
  width: 48%;
}

@media (max-width: 700px) {
  .card-dash {
    width: 100%;
  }
}
</style>
