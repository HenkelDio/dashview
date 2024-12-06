<template>
  <q-page class="q-pa-md q-pt-xl">
    <div class="flex justify-between items-top q-mb-xl q-mt-md">
      <div>
        <div class="text-h5 page-title" style="margin-bottom: 10px">
          Dashboard
        </div>
        <div class="text-subtitle1 inter-medium" style="margin-left: 2px">
          {{ store.$state.yearModel }}
        </div>
      </div>
      <div>
        <q-btn
          flat
          @click="showDialogFilter = true"
          class="inter-bold text-dark"
        >
          Filtros
        </q-btn>
      </div>
    </div>

    <div class="flex q-gutter-x-md">
      <!-- <div
        :style="{ width: isMobile ? '100%' : '280px', marginBottom: '20px' }"
      >
        <CardInfo
          value="15"
          description="Indicadores em andamento"
          icon="insert_chart"
          colorIcon="blue"
        />
      </div> -->
      <!-- <div
        :style="{ width: isMobile ? '100%' : '280px', marginBottom: '20px' }"
      >
        <CardInfo
          :value="usersQuantity"
          description="Usuários cadastrados"
          icon="account_circle"
          colorIcon="green"
        />
      </div> -->
    </div>

    <div v-if="loading" class="flex column q-gutter-y-md">
      <q-skeleton type="QToolbar" height="250px" />
      <q-skeleton type="QToolbar" height="250px" />
      <q-skeleton type="QToolbar" height="250px" />
      <q-skeleton type="QToolbar" height="250px" />
    </div>

    <!-- <div class="flex q-gutter-y-md" v-for="chart in charts" :key="chart.id">
      <BarChart :chart="chart" class="q-mb-md" />
    </div> -->

    <div
      class="flex q-gutter-md"
      v-for="(layout, index) in charts"
      :key="index + Math.random()"
    >
      <div style="background-color: blue" class="flex row">
        <div v-for="chart in layout" :key="chart.id">
          <BarChart :chart="chart as IChart" class="q-mb-md" />
        </div>
      </div>
    </div>

    <div v-if="!loading && charts.length === 0" class="q-mt-xl">
      <div class="text-center">
        <div class="text-h6 text-center inter-medium">
          Puxa, não foi encontrado nenhum gráfico... <br />Você pode tentar
          realizar outro filtros ou cadastrar novos gráficos
        </div>
        <q-btn
          flat
          label="Adicionar novo gráfico"
          class="inter-bold text-secondary"
          @click="$router.push({ path: '/list-charts' })"
        ></q-btn>
        <Vue3Lottie :animationData="notFound" :height="200" :width="200" />
      </div>
    </div>

    <FilterDialog v-if="showDialogFilter" @close="closeFilterDialog()" />
  </q-page>
</template>

<script setup lang="ts">
import { Notify } from 'quasar';
import BarChart from 'src/components/BarChart.vue';
import FilterDialog from 'src/components/FilterDialog.vue';
import { findAllChartsByDepartment } from 'src/services/ChartService';
import { countUsers } from 'src/services/UserService';
import { useFilterStore } from 'src/stores/filters';
import { IChart, IFilterCharts } from 'src/types';
import { onMounted, ref } from 'vue';
import notFound from '../assets/notfound.json';
import { Vue3Lottie } from 'vue3-lottie';

const store = useFilterStore();

const showDialogFilter = ref(false);
const usersQuantity = ref('0');
const loading = ref(false);
const charts = ref([
  [
    {
      id: '670dba0b1fce8a3f70941d2f',
      title: 'NPS - NET PROMOTER SCORE',
      type: 'bar',
      perspective: 'CLIENTES E MERCADO',
      process: 'GESTÃO DA QUALIDADE',
      department: 'QUALIDADE',
      responsible: 'ELLEN',
      periodicity: 'Mensal',
      objective:
        'Aumentar a fidelização e satisfação do cliente paciente e acompanhantes.',
      formula:
        '% Clientes promotores -% clientes detratores=NPS (Fonte IBES Instituto Brasiseiro de Excelência em S',
      labels: [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro',
      ],
      chartData: [
        {
          label: 'Dados',
          data: [75, 82.93, 95.6, 100, 100, 94.4, 95.6, 98.2, 98.4, 0, 0, 0],
          backgroundColor: '#FF5733',
        },
      ],
      createdBy: {
        name: 'ELLEN',
        document: '0',
      },
      createdOn: 1728952843146,
      status: 'ACTIVE',
      year: '2024',
      mask: 'PERCENTAGE',
      layoutType: 'large',
    },
  ],
  [
    {
      id: '670dba0b1fce8a3f70941d30',
      title: 'TAXA DE ADESÃO PESQUISAS DE SATISFAÇÃO',
      type: 'bar',
      perspective: 'Na',
      process: 'GESTÃO DA QUALIDADE',
      department: 'QUALIDADE',
      responsible: 'ELLEN',
      periodicity: 'Mensal',
      objective:
        'Mensurar a TAXA da adesão de pesquisas de satisfação respondidas pelos pacientes.',
      formula:
        'Total de pacientes que responderam a pesquisa / { número de cirurgias posto de enfermagem*100',
      labels: [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro',
      ],
      chartData: [
        {
          label: 'Pacientes internados',
          data: [216, 247, 294, 329, 317, 349, 471, 383, 304, '342', 0, 0],
          backgroundColor: '#FF5733',
        },
        {
          label: 'Respondidos',
          data: [
            '8',
            '61',
            '90',
            '32',
            '25',
            '23',
            '75',
            '116',
            '70',
            '24',
            11,
            12,
          ],
          backgroundColor: '#422878',
        },
      ],
      createdBy: {
        name: 'ELLEN',
        document: '0',
      },
      createdOn: 1728952843192,
      status: 'ACTIVE',
      year: '2024',
      mask: null,
      layoutType: 'short',
    },
    {
      id: '674352607b79b93c9799e276',
      title: 'PRAZO MÉDIO DE RECEBIMENTO DAS CONTAS EM DIAS',
      type: 'bar',
      perspective: 'FINANCEIRA',
      process: 'FATURAMENTO',
      department: 'FATURAMENTO',
      responsible: 'érico vinicius',
      periodicity: 'Mensal',
      objective: 'Identificar o prazo médio de recebimento em dias.',
      formula:
        'Média de dias entre a data de faturamento da conta e o recebimento desta',
      labels: [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro',
      ],
      chartData: [
        {
          label: 'Quantidade de dias',
          data: [
            '39',
            '36',
            '34',
            '34',
            '34',
            '32',
            '33',
            '0',
            '0',
            '0',
            '0',
            '0',
          ],
          backgroundColor: '#422878',
        },
      ],
      createdBy: {
        name: 'Willian Henkel',
        document: '12440038912',
      },
      createdOn: 1732465248399,
      status: 'ACTIVE',
      year: '2024',
      mask: null,
      layoutType: 'medium',
    },
  ],
]);
const filters = ref({} as IFilterCharts);

function closeFilterDialog() {
  filters.value = {
    department: store.departmentModel,
    perspective: store.perspectiveModel,
    process: store.processModel,
    responsible: store.responsibleModel,
    year: store.yearModel,
  };

  showDialogFilter.value = false;
  getChartsByDepartment();
}

// const filteredIndicators = computed(() => {
//   return charts.value.filter((indicator: IChart) => {
//     // Comparar os valores do store com os campos do indicador
//     const matchPerspective = !store.perspectiveModel || indicator.perspective === ;
//     const matchProcess =
//       !store.processModel || indicator.process === ;
//     const matchDepartment =
//       !store.departmentModel || indicator.department === ;
//     const matchResponsible =
//       !store.responsibleModel ||
//       indicator.responsible === ;

//     const matchYear =
//       !store.yearModel ||
//       indicator.year === store.yearModel;

//     // Retorna apenas os indicadores que atendem a todos os critérios
//     return matchPerspective && matchProcess && matchDepartment && matchResponsible && matchYear;
//   });
// });

async function getUsersQuantity() {
  const { data, error } = await countUsers();

  if (error) {
    console.log(error);
  }

  usersQuantity.value = data.toString();
}

async function getChartsByDepartment() {
  loading.value = true;
  const { data, error }: { data: IChart[] | null; error: unknown } =
    await findAllChartsByDepartment('ACTIVE', filters.value);
  loading.value = false;

  if (error) {
    Notify.create({
      message: 'Erro ao encontrar indicadores',
      color: 'red',
    });
    return;
  }

  if (data) {
    // charts.value = data;
  }
}

onMounted(() => {
  getUsersQuantity();
  getChartsByDepartment();
});
</script>
