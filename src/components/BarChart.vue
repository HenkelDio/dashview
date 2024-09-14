<template>
  <q-card style="width: 100%; max-width: 100%;">
    <q-card-section>
      <div class="text-h6">{{indicator.description}}</div>
      <div class="text-subtitle2">{{indicator.type}}</div>
    </q-card-section>
    <q-card-section>
      <Bar
        id="my-chart-id"
        :options="chartOptions"
        :data="chartData"
      />
    </q-card-section>

    <q-card-section>
      <q-expansion-item
        expand-separator
        icon="info"
        label="Detalhes"

      >
      <q-list bordered separator>
        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>{{indicator.description}}</q-item-label>
            <q-item-label caption>Descrição</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>{{indicator.type}}</q-item-label>
            <q-item-label caption>Tipo</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>{{indicator.process}}</q-item-label>
            <q-item-label caption>Processo</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>{{indicator.perpective}}</q-item-label>
            <q-item-label caption>Perspectiva</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>{{indicator.departament}}</q-item-label>
            <q-item-label caption>Setor</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>{{indicator.responsable}}</q-item-label>
            <q-item-label caption>Responsável</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>{{indicator.objective}}</q-item-label>
            <q-item-label caption>Objetivo</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>{{indicator.formula}}</q-item-label>
            <q-item-label caption>Fórmula</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>{{indicator.periodicity}}</q-item-label>
            <q-item-label caption>Periodicidade</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
    </q-card-section>

  </q-card>
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { ref } from 'vue';
import { Indicator } from 'src/types';
import { useQuasar } from 'quasar';

const $q = useQuasar()

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

interface IProps{
   indicator : Indicator
}

const props = defineProps<IProps>()
const indicator = props.indicator;

const chartData = ref({
    labels: [ 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Agosto', 'Outubro', 'Novembro', 'Dezembro' ],
    datasets: [
      {
        label: indicator.label,
        data: indicator.data,
        backgroundColor: indicator.backgroundColor,
        borderWidth: 2,
        borderRadius: 5,
        borderSkipped: false,
      }
    ]
  })

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio:  $q.platform.is.mobile ? true : false
})
</script>
