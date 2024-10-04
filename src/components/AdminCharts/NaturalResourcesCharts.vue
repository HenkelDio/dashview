<template>
  <div>
    <q-card flat class="q-mb-md" style="height: 250px">
      <q-card-section>
        <div class="text-caption inter-medium text-grey-9 q-mb-lg">
          INDICADOR DE RECURSOS NATURAIS R$
        </div>
        <div>
          <Bar
            id="my-horizontal-bar-chart"
            :options="chartOptionsResponsible"
            :data="chartDataResponsible"
          />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
import { Bar } from 'vue-chartjs';
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

const chartOptionsResponsible = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      beginAtZero: true, // Iniciar o eixo X em zero
    },
  },
  plugins: {
    datalabels: {
      display: true,
      color: 'white',
    },
    legend: {
      display: false,
    },
  },
};

// Dados para o gráfico de barras horizontais
const chartDataResponsible = {
  labels: ['ÁGUA', 'LUZ', 'GLP', 'GÁS MEDICINAL', 'LAVANDERIA'],
  datasets: [
    {
      label: 'Quantidade de Indicadores',
      data: [17, 13, 12, 9, 7, 7, 7, 7, 7, 6, 5, 1],
      backgroundColor: '#1565C0',
      hoverBackgroundColor: '#0D47A1',
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
