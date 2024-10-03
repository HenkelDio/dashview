<template>
  <div>
    <div class="flex row q-gutter-x-md q-mb-md">
      <q-card style="width: 48%" flat>
        <q-card-section>
          <div class="text-caption inter-medium text-grey-9 q-mb-lg">
            QUANTIDADE DE INDICADORES POR PERSPECTIVA
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
      <div style="width: 48%">
        <q-card style="height: 100%" flat>
          <q-card-section>
            <div class="text-caption inter-medium text-grey-9 q-mb-lg">
              QUANTIDADE DE INDICADORES POR CLASSIFICAÇÃO
            </div>
            <div style="height: 300px">
              <Doughnut
                id="my-chart-id"
                :options="chartOptionsClassification"
                :data="chartDataClassification"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-card flat class="q-mb-md">
      <q-card-section>
        <div class="text-caption inter-medium text-grey-9 q-mb-lg">
          QUANTIDADE DE INDICADORES POR RESPONSÁVEL
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

    <q-card flat>
      <q-card-section>
        <div class="text-caption inter-medium text-grey-9 q-mb-lg">
          QUANTIDADE DE INDICADORES POR DEPARTAMENTO
        </div>
        <div>
          <Bar
            id="my-horizontal-bar-chart"
            :options="chartOptionsDepartament"
            :data="chartDataDepartament"
          />
        </div>
      </q-card-section>
    </q-card>
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
import { Platform } from 'quasar';

// Registrar os componentes necessários do Chart.js
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

console.log('Platform.is.mobile', Platform.is.mobile);

// Opções específicas para o gráfico de barras horizontais
const chartOptionsResponsible = {
  indexAxis: 'y' as const, // Use 'as const' para especificar o literal correto
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    x: {
      beginAtZero: true, // Iniciar o eixo X em zero
    },
  },
  plugins: {
    datalabels: {
      display: false, // Desativar rótulos globalmente
    },
    legend: {
      display: false,
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
      data: [2, 9, 8, 25, 6, 6, 4, 9, 7, 8, 6, 8], // Quantidades correspondentes aos nomes
      backgroundColor: '#1565C0',
      hoverBackgroundColor: '#0D47A1',
    },
  ],
};

const chartOptionsDepartament = {
  responsive: true,
  maintainAspectRatio: true,
  indexAxis: 'y' as const, // Inverte o eixo para barras horizontais
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
  labels: [
    'ADMINISTRAÇÃO',
    'CADASTRO',
    'CENTRO CIRURGICO',
    'ENFERMAGEM',
    'FARMÁCIA',
    'FATURAMENTO',
    'FINANCEIRO',
    'GESTÃO DE PESSOAS',
    'HIGIENIZAÇÃO',
    'MANUTENÇÃO',
    'NÚCLEO DE SEG. DO PACIENTE',
    'NUTRIÇÃO',
    'QUALIDADE',
    'RECEPÇÃO',
    'ROUPARIA',
    'SUPRIMENTOS',
    'TESOURARIA',
    'UNIDADE DE INTERNAÇÃO',
  ],
  datasets: [
    {
      label: 'Quantidade de Indicadores',
      data: [3, 2, 5, 13, 21, 6, 9, 8, 3, 2, 2, 7, 4, 3, 2, 3, 1, 1], // Quantidades para cada setor
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
  labels: ['Financeiro', 'Crescimento', 'Clientes', 'Processos Internos'],
  datasets: [
    {
      label: 'Indicadores por Perspectiva',
      data: [30, 20, 15, 35],
      backgroundColor: ['#0D47A1', '#1565C0', '#1E88E5', '#2196F3'],
      hoverBackgroundColor: ['#0B3D91', '#0D47A1', '#1565C0', '#1E88E5'],
    },
  ],
};

const chartOptionsClassification = {
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

const chartDataClassification = {
  labels: ['Estratégico', 'Operacional'],
  datasets: [
    {
      label: 'Indicadores por Perspectiva',
      data: [53, 45],
      backgroundColor: ['#0D47A1', '#1565C0'],
      hoverBackgroundColor: ['#0B3D91', '#0D47A1'],
    },
  ],
};
</script>
