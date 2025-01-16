<template>
  <q-page class="q-pa-md q-pt-sm">
    <q-btn
      dense
      icon="chevron_left"
      flat
      class="q-mb-lg"
      @click="$router.back()"
      >Voltar</q-btn
    >

    <div class="text-h5 page-title q-mb-xl">Visão geral de respostas</div>

    <q-card flat class="q-mt-sm">
      <q-card-section>
        <div class="flex justify-between">
          <q-btn-toggle
            v-model="sortBy"
            color="grey-4"
            toggle-color="grey-5"
            no-caps
            toggle-text-color="grey-10"
            unelevated
            text-color="grey-9"
            class="inter-bold"
            emit-value
            :options="[
              { label: 'Todos', value: 'all' },
              { label: 'Promotores', value: 'promoters' },
              { label: 'Detratores', value: 'detractors' },
              { label: 'Neutros', value: 'neutrals' },
            ]"
          />
          <div class="flex q-gutter-x-md">
            <DateRangeInput
              @from="startDate = $event"
              @to="endDate = $event"
              :currentDate="false"
            />
            <q-btn
              v-if="startDate > 0 && endDate > 0"
              dense
              label="Buscar"
              color="secondary"
              class="inter-medium q-px-md"
              size="1rem"
              unelevated
              no-caps
              icon="search"
              @click="loadAllAnswers"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <div v-if="rows.length === 0 && !loading">
          <div class="text-center">
            <div class="text-h6 text-center inter-medium">
              Nenhum resultado encontrado
            </div>
            <Vue3Lottie :animationData="notFound" :height="200" :width="200" />
          </div>
        </div>

        <q-inner-loading
          :showing="loading"
          style="height: 100px"
          color="primary"
        />
        <div class="q-gutter-y-md">
          <div v-for="(item, index) in rows" :key="index">
            <ScoreCard
              :type="item.type"
              :question="item.question"
              :patient="item.patientName"
              :dateOfAdmission="item.dateOfAdmission"
              :timestamp="item.timestamp"
            />
          </div>
        </div>

        <div style="margin: 10px auto; width: 200px">
          <q-pagination v-model="currentPage" :max="totalPages" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { IChartAnswer } from 'src/types';
import { onMounted, ref, watch } from 'vue';
import { Notify } from 'quasar';
import moment from 'moment';
import 'moment/dist/locale/pt-br';
import DateRangeInput from 'src/components/DateRangeInput.vue';
import { useRoute } from 'vue-router';
import notFound from '../assets/notfound.json';
import { Vue3Lottie } from 'vue3-lottie';
import ScoreCard from 'src/components/ScoreCard.vue';
import { getAllAnswers } from 'src/services/NPSService';

const route = useRoute();

const departmentId = ref(route.query.departmentId || '');
const sortBy = ref('all');

const loading = ref(false);
const rows = ref([] as IChartAnswer[]);
const startDate = ref(0);
const endDate = ref(0);
const currentPage = ref(1);
const totalPages = ref(5);

watch(sortBy, () => {
  loadAllAnswers();
});

interface IResponse {
  data: {
    currentPage: number;
    data: IChartAnswer[];
    totalDocuments: number;
    totalPages: number;
  } | null;
  error: unknown | null;
}

async function loadAllAnswers() {
  loading.value = true;

  const { data, error }: IResponse = await getAllAnswers(
    startDate.value,
    endDate.value,
    departmentId.value.toString(),
    1
  );

  loading.value = false;

  if (error) {
    Notify.create({
      message: 'Erro ao carregar respostas',
      color: 'red',
    });
    return;
  }

  if (data) {
    rows.value = formatRows(data.data);
    totalPages.value = data.totalPages;
  }
}

function formatRows(data: IChartAnswer[]) {
  return data
    .sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return dateB - dateA;
    })
    .map((item: IChartAnswer) => {
      return {
        ...item,
        timestamp: formatDate(item.timestamp),
        dateOfAdmission: formatDate(item.dateOfAdmission),
      };
    });
}

function formatDate(timestamp: number | string): string {
  moment.locale('pt-br');
  return moment(timestamp).format('DD/MM/YYYY');
}

onMounted(() => {
  loadAllAnswers();
});
</script>

<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */
  height: 310px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #fff

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
</style>
