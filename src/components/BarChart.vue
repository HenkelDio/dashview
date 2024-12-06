<template>
  <q-card flat style="background-color: red">
    <q-card-section>
      <div class="text-h6 inter-medium">{{ indicator.title }}</div>
      <div class="text-subtitle2">{{ indicator.department }}</div>
    </q-card-section>
    <q-card-section>
      <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
    </q-card-section>

    <q-card-section>
      <q-expansion-item expand-separator icon="info" label="Detalhes">
        <q-list bordered separator>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>{{ indicator.title }}</q-item-label>
              <q-item-label caption>Descrição</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>{{ indicator.process }}</q-item-label>
              <q-item-label caption>Processo</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple v-if="indicator.perspective">
            <q-item-section>
              <q-item-label>{{ indicator.perspective }}</q-item-label>
              <q-item-label caption>Perspectiva</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>{{ indicator.department }}</q-item-label>
              <q-item-label caption>Setor</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>{{ indicator.responsible }}</q-item-label>
              <q-item-label caption>Responsável</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>{{ indicator.objective }}</q-item-label>
              <q-item-label caption>Objetivo</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>{{ indicator.formula }}</q-item-label>
              <q-item-label caption>Fórmula</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>{{ indicator.periodicity }}</q-item-label>
              <q-item-label caption>Periodicidade</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-expansion-item>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
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
import { ref } from 'vue';
import { IChart, IChartData } from 'src/types';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

interface IProps {
  chart: IChart;
}

const props = defineProps<IProps>();
const indicator = props.chart;

const chartData = ref({
  labels: indicator.labels,
  datasets: indicator.chartData.map((indicator: IChartData) => ({
    label: indicator.label,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: (indicator.data as any[]).map((value) => {
      if (typeof value === 'string') {
        return Number(value.replace(/\./g, '').replace(',', '.'));
      } else if (typeof value === 'number') {
        return value;
      }
      console.warn(`Valor inválido encontrado: ${value}`);
      return 0;
    }),
    backgroundColor: indicator.backgroundColor,
    borderWidth: 1,
    borderRadius: 5,
    borderSkipped: false,
  })),
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    datalabels: {
      display: true,
      color: 'white',
    },
    tooltip:
      indicator.mask === 'CURRENCY'
        ? {
            callbacks: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              label: function (context: any) {
                const value = context.raw; // Valor original (número)
                return new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(value);
              },
            },
          }
        : indicator.mask === 'PERCENTAGE'
        ? {
            callbacks: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              label: function (context: any) {
                const value = context.raw; // Valor original (número)
                return new Intl.NumberFormat('pt-BR', {
                  style: 'percent',
                  minimumFractionDigits: 2, // Exibe duas casas decimais (opcional)
                }).format(value / 100); // Divida por 100 para converter de base 100
              },
            },
          }
        : {},
  },
});
</script>
