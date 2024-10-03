<template>
  <div class="flex row q-gutter-x-md">
    <q-card style="width: 40%;" flat>
      <q-card-section>
        <div class="text-h6 inter-medium">QUANTIDADE DE INDICADORES POR PERSPECTIVA</div>
      </q-card-section>
      <q-card-section>
        <Doughnut id="my-chart-id" :options="chartOptions" :data="chartData" />
      </q-card-section>
    </q-card>

    <q-card style="width: 55%;" flat>
      <q-card-section>
        <div class="text-h6 inter-medium">QUANTIDADE DE INDICADORES POR RESPONSÁVEL</div>
      </q-card-section>
      <q-card-section>
        <Bar id="my-horizontal-bar-chart" :options="chartOptionsResponsible" :data="chartDataResponsible" />
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
import { Doughnut, Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

// Registrar os componentes necessários do Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,  // ArcElement é necessário para gráficos de rosca (Doughnut)
  CategoryScale,
  LinearScale,
  BarElement    // Necessário para gráficos de barras
);

// Opções para ambos os gráficos
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

// Opções específicas para o gráfico de barras horizontais
const chartOptionsResponsible = {
  indexAxis: 'y' as const,  // Use 'as const' para especificar o literal correto
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      beginAtZero: true,  // Iniciar o eixo X em zero
    },
  },
};


// Dados para o gráfico de barras horizontais
const chartDataResponsible = {
  labels: [
    'GRACIELI FERREIRA COELHO',
    'ALISAN TORRES MORAES',
    'JACKELLINE DAYANNE LEAL',
    'VALDIRENE DOS SANTOS',
    'FERNANDA FANHANI',
    'ERICO VINICIUS RODRIGUES',
    'JOSIANE PATRICIA DE SOUZA',
    'ANA RITA HUGEN',
    'KELI PATRICIA TABORDA RIBAS',
    'ELLEN JULIANE KAMINSKI',
    'DAVILYN BRILHANTE PANTOJA',
    'FRANCIELLE MACIEL DE SOUZA',
  ],
  datasets: [
    {
      label: 'Quantidade de Indicadores',
      data: [2, 9, 8, 25, 6, 6, 4, 9, 7, 8, 6, 8],  // Quantidades correspondentes aos nomes
      backgroundColor: '#42A5F5',  // Cor das barras
      hoverBackgroundColor: '#64B5F6',
    },
  ],
};

// Dados para o gráfico de rosca
const chartData = {
  labels: ['Financeiro', 'Crescimento', 'Clientes', 'Processos Internos'],
  datasets: [
    {
      label: 'Indicadores por Perspectiva',
      data: [30, 20, 15, 35],  // Quantidades de exemplo para cada perspectiva
      backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#FF7043'],
      hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D', '#FF8A65'],
    },
  ],
};
</script>
