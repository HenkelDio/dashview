<template>
  <div>
    <div class="flex row q-gutter-md q-mb-md">
      <q-card class="card-dash" flat>
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
      <div class="card-dash">
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
    'VALDIRENE DOS SANTOS',
    'ALISAN TORRES MORAES',
    'ANA RITA HUGEN',
    'JACKELLINE DAYANNE LEAL',
    'ELLEN JULIANE KAMINSKI',
    'DAVILYN BRILHANTE PANTOJA',
    'FERNANDA FANHANI',
    'KELI PATRICIA TABORDA RIBAS',
    'ERICO VINICIUS RODRIGUES',
    'GRACIELI FERREIRA COELHO',
    'FRANCIELLE MACIEL DE SOUZA',
    'JOSIANE PATRICIA DE SOUZA',
  ],
  datasets: [
    {
      label: 'Quantidade de Indicadores',
      data: [17, 13, 12, 9, 7, 7, 7, 7, 7, 6, 5, 1], // Quantidades correspondentes aos nomes
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
    'ENFERMAGEM',
    'FARMÁCIA',
    'HIGIENIZAÇÃO',
    'RECEPÇÃO',                               // 8
    'NUTRIÇÃO',                               // 7
    'FINANCEIRO',                             // 7
    'GESTÃO DE PESSOAS',                      // 6
    'CENTRO CIRURGICO',                       // 5
    'FATURAMENTO',                            // 5
    'QUALIDADE',                               // 4
    'SUPRIMENTOS',                            // 4
    'CADASTRO',                               // 3
    'NÚCLEO DE SEGURANÇA DO PACIENTE',       // 3
    'ADMINISTRAÇÃO',                          // 2
    'MANUTENÇÃO',                             // 2
    'ROUPARIA',                               // 2
    'SAME', // 2
    'UNIDADE DE INTERNAÇÃO', // 1
    'TESOURARIA',                             // 1
  ],
  datasets: [
    {
      label: 'Quantidade de Indicadores',
      data: [15, 13, 8, 8, 7, 7, 6, 5, 5, 4, 4, 3, 3, 2, 2, 2, 2, 1, 1], // Quantidades para cada setor
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
  labels: ['Financeira', 'Processos Internos', 'Clientes e Mercado', 'Pessoas/Infraestrutura', 'Res. Social e Ambiental'],
  datasets: [
    {
      label: 'Indicadores por Perspectiva',
      data: [19, 3, 9, 8, 8],
      backgroundColor: ['#0D47A1', '#1976D2', '#42A5F5', '#64B5F6', '#90CAF9'], // Tonalidades de azul
      hoverBackgroundColor: ['#0B3D91', '#1565C0', '#1E88E5', '#2196F3', '#BBDEFB'], // Tonalidades de azul mais escuras
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

<style lang="scss">
.card-dash {
  width: 48%
}

@media (max-width: 700px) {
  .card-dash {
    width: 100%
  }
}
</style>
