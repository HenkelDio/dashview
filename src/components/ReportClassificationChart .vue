<template>
  <q-card class="q-mt-md" flat>
    <q-card-section class="flex justify-between items-center">
      <div>
        <div class="text-body2 inter-medium text-grey-9">
          INDICADOR DE CLASSIFICAÇÃO
        </div>
        <div class="text-caption inter-medium text-grey-9">
          {{ total }} respostas
        </div>
      </div>

      <div class="row items-center q-gutter-sm">
        <!-- Alternar orientação (só faz sentido no Bar) -->
        <q-btn
          icon="swap_vert"
          label="Orientação"
          flat
          dense
          color="primary"
          class="inter-medium"
          :disable="chartType === 'pie'"
          @click="toggleAxis"
        />

        <!-- Alternar Bar / Pie -->
        <q-btn
          :icon="chartType === 'bar' ? 'pie_chart' : 'bar_chart'"
          :label="chartType === 'bar' ? 'Pizza' : 'Barras'"
          flat
          dense
          color="primary"
          class="inter-medium"
          @click="toggleChartType"
        />

        <!-- Salvar -->
        <q-btn
          icon="save_alt"
          label="Salvar"
          flat
          dense
          color="primary"
          class="inter-medium"
          @click="saveChartAsImage"
        />
      </div>
    </q-card-section>

    <q-card-section>
      <div style="height: 350px; max-height: 350px" v-if="chartData">
        <Bar
          v-if="chartType === 'bar'"
          ref="chartRef"
          :data="chartData"
          :options="barOptions"
        />

        <Pie v-else ref="chartRef" :data="chartData" :options="pieOptions" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { Notify } from 'quasar';
import { Bar, Pie } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  type Chart,
  type ChartOptions,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  ChartDataLabels
);

interface IProps {
  classifications: {
    [key: string]: number;
  };
}

const props = defineProps<IProps>();

const chartRef = ref<{ chart: Chart } | null>(null);

type ChartType = 'bar' | 'pie';
const chartType = ref<ChartType>('bar');
const isHorizontal = ref(true);

const labels = computed(() => Object.keys(props.classifications));
const values = computed(() => Object.values(props.classifications));

const total = computed(() =>
  values.value.reduce((sum, value) => sum + value, 0)
);

const chartData = computed(() => ({
  labels: labels.value,
  datasets: [
    {
      label: 'Classificações',
      data: values.value,
      backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC'],
      borderRadius: chartType.value === 'bar' ? 6 : 0,
    },
  ],
}));

const barOptions = computed<ChartOptions<'bar'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: isHorizontal.value ? 'y' : 'x',
  plugins: {
    legend: { display: false },
    datalabels: {
      display: true,
      color: '#fff',
      backgroundColor: '#1976d2',
      borderRadius: 6,
      padding: 6,
      font: { weight: 'bold', size: 14 },
      formatter: (value) => value,
    },
  },
  scales: {
    x: { beginAtZero: true },
    y: { beginAtZero: true },
  },
}));

const pieOptions = computed<ChartOptions<'pie'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'right' },
    datalabels: {
      color: '#fff',
      font: { weight: 'bold' },
      formatter: (value, ctx) => {
        const data = ctx.chart.data.datasets[0].data as number[];
        const total = data.reduce((a, b) => a + b, 0);
        return `${((value / total) * 100).toFixed(1)}%`;
      },
    },
  },
}));

/* =========================
 * Actions
 * ========================= */
function toggleAxis() {
  isHorizontal.value = !isHorizontal.value;
  chartRef.value?.chart.update();
}

function toggleChartType() {
  chartType.value = chartType.value === 'bar' ? 'pie' : 'bar';

  // força recriação correta do chart
  chartRef.value?.chart.destroy();
}

function saveChartAsImage() {
  const chart = chartRef.value?.chart;
  if (!chart) {
    Notify.create({
      message: 'Gráfico não encontrado.',
      type: 'negative',
    });
    return;
  }

  chart.update('none');

  setTimeout(() => {
    const imageBase64 = chart.toBase64Image('image/jpeg', 1);

    if (!imageBase64) {
      Notify.create({
        message: 'Não foi possível gerar a imagem do gráfico.',
        type: 'negative',
      });
      return;
    }

    const link = document.createElement('a');
    link.href = imageBase64;
    link.download = 'grafico_classificacoes.jpeg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Notify.create({
      message: 'Gráfico salvo com sucesso!',
      type: 'positive',
      icon: 'cloud_download',
    });
  }, 100);
}
</script>
