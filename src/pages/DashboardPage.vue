<template>
  <q-page class="q-pa-md q-pt-xl">
    <div class="flex justify-between items-top q-mb-xl q-mt-md">
      <div>
        <div class="text-h5 page-title" style="margin-bottom: 10px">
          Dashboard
        </div>
        <div class="text-subtitle1 inter-medium" style="margin-left: 2px;">
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
      <q-skeleton type="QToolbar" height="250px"/>
      <q-skeleton type="QToolbar" height="250px"/>
      <q-skeleton type="QToolbar" height="250px"/>
      <q-skeleton type="QToolbar" height="250px"/>
    </div>

    <div
      class="flex q-gutter-y-md"
      v-for="(chart, index) in charts"
      :key="index"
    >
      <BarChart :chart="chart" class="q-mb-md" />
    </div>

    <div v-if="!loading && charts.length === 0" class="q-mt-xl">
      <div class="text-center">
        <div class="text-h6 text-center inter-medium">Puxa, não foi encontrado nenhum gráfico...
          <br>Você pode tentar realizar outro filtros ou cadastrar novos gráficos</div>
          <q-btn flat label="Adicionar novo gráfico" class="inter-bold text-secondary" @click="$router.push({ path: '/list-charts'})"></q-btn>
          <Vue3Lottie :animationData="notFound" :height="200" :width="200"/>
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
const charts = ref([] as IChart[]);
const filters = ref({} as IFilterCharts);

function closeFilterDialog() {

  filters.value = {
    department: store.departmentModel,
    perspective: store.perspectiveModel,
    process: store.processModel,
    responsible: store.responsibleModel,
    year: store.yearModel
  }

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
  const { data, error }: {data: IChart[] | null, error: unknown} = await findAllChartsByDepartment('ACTIVE', filters.value);
  loading.value = false;

  if(error) {
    Notify.create({
      message: 'Erro ao encontrar indicadores',
      color: 'red'
    })
    return;
  }

  if(data) {
    charts.value = data;
  }

}

onMounted(() => {
  getUsersQuantity();
  getChartsByDepartment();
});
</script>
