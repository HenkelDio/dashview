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

      <q-btn
        icon="save_alt"
        label="Salvar"
        flat
        dense
        @click="saveChartAsImage"
        class="inter-medium"
        color="primary"
      />
    </q-card-section>

    <q-card-section>
      <div style="height: 250px; max-height: 250px" v-if="chartData">
        <Bar ref="barChartRef" :data="chartData" :options="chartOptions" />
      </div>
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
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { computed, ref } from 'vue';
import { Notify } from 'quasar';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartDataLabels
);

const barChartRef = ref<InstanceType<typeof Bar> | null>(null);

interface IProps {
  classifications: {
    [key: string]: number;
  };
}

const props = defineProps<IProps>();

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
      borderRadius: 6,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const, // ← TORNA HORIZONTAL
  plugins: {
    legend: {
      display: false,
    },
    datalabels: {
      display: true,
      color: '#fff',
      font: {
        weight: 'bold' as const,
        size: 14,
      },
      formatter: (value: number) => value,
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      ticks: { stepSize: 1 },
    },
    y: {
      beginAtZero: true,
    },
  },
};

function saveChartAsImage() {
  if (barChartRef.value?.chart) {
    const chartInstance = barChartRef.value.chart as ChartJS;
    chartInstance.update('none');
    setTimeout(() => {
      const imageBase64 = chartInstance.toBase64Image('image/jpeg', 1);
      if (imageBase64) {
        const link = document.createElement('a');
        link.href = imageBase64;
        link.download = 'grafico_relacao_score.jpeg';
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
</script>
