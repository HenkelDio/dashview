<template>
  <q-card class="q-mt-md" flat>
    <q-card-section>
      <div>
        <div class="text-body2 inter-medium text-grey-9">
          {{ props.details.title }}
        </div>
        <div class="text-caption inter-medium text-grey-9 q-mb-lg">
          {{
            props.details.compliments +
            props.details.complaints +
            props.details.suggestions
          }}
          respostas
        </div>
      </div>
      <div style="height: 250px; max-height: 250px" v-if="props.details">
        <Pie
          ref="dataScorePie"
          :options="chartOptionsScore"
          :data="chartDataScore"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ref } from 'vue';

ChartJS.register(Title, Tooltip, Legend, ArcElement, ChartDataLabels);

interface IProps {
  details: {
    title: string;
    complaints: number;
    suggestions: number;
    compliments: number;
  };
}

const props = defineProps<IProps>();

const chartOptionsScore = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: '#333',
        font: {
          size: 12,
          weight: 'bold' as const,
        },
      },
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
    title: {
      display: false,
    },
  },
};

const chartDataScore = ref({
  labels: ['Reclamações', 'Sugestões', 'Elogios'],
  datasets: [
    {
      label: 'Respostas',
      data: [
        props.details.complaints,
        props.details.suggestions,
        props.details.compliments,
      ],
      backgroundColor: ['#FF1744', '#FF6D00', '#00E676'],
      hoverBackgroundColor: ['#D32F2F', '#FBC02D', '#388E3C'],
    },
  ],
});
</script>
