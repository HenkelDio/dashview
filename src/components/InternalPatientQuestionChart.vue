<template>
  <q-card flat bordered class="question-card">
    <q-card-section class="q-pb-sm">
      <div class="text-overline text-primary">{{ section }}</div>
      <div class="text-subtitle1 text-weight-medium text-grey-10">
        {{ question }}
      </div>
      <div v-if="description" class="text-caption text-grey-7 q-mt-xs">
        {{ description }}
      </div>
    </q-card-section>

    <q-card-section>
      <div class="chart-wrapper">
        <Bar :data="chartData" :options="chartOptions" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import type { ChartData, ChartOptions } from 'chart.js';

interface QuestionOption {
  label: string;
  value: number;
  color: string;
}

interface Props {
  section: string;
  question: string;
  description?: string;
  options: QuestionOption[];
}

const props = defineProps<Props>();

const chartData = computed<ChartData<'bar'>>(() => ({
  labels: props.options.map((option) => option.label),
  datasets: [
    {
      label: 'Respostas',
      data: props.options.map((option) => option.value),
      backgroundColor: props.options.map((option) => option.color),
      borderRadius: 8,
      borderSkipped: false,
      maxBarThickness: 38,
    },
  ],
}));

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context) => `${context.raw ?? 0} respostas`,
      },
    },
    datalabels: {
      color: '#1f2937',
      anchor: 'end',
      align: 'top',
      font: {
        weight: 'bold',
        size: 12,
      },
      formatter: (value) => (Number(value) > 0 ? value : ''),
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: '#4b5563',
        font: { size: 11 },
      },
    },
    y: {
      beginAtZero: true,
      grid: { color: '#e5e7eb' },
      ticks: {
        precision: 0,
        color: '#4b5563',
      },
    },
  },
};
</script>

<style scoped lang="scss">
.question-card {
  height: 100%;
  border-radius: 18px;
}

.chart-wrapper {
  height: 260px;
}
</style>
