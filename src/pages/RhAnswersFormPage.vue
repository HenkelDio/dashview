<template>
  <q-page class="q-pa-md q-pt-xl">
    <div class="text-h5 page-title q-mb-xl">Respostas</div>

    <q-card flat class="q-mt-sm">
      <q-card-section>
        <div class="flex justify-between">
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
              @click="loadAnswers"
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

        <q-table
          v-if="rows.length > 0"
          class="my-sticky-header-table"
          style="height: 400px"
          :rows="rows"
          virtual-scroll
          flat
          :columns="columns"
          row-key="name"
          table-header-class="inter-bold text-dark"
          rows-per-page-label="Resultados por página"
          loading-label="Carregando..."
          :loading="loading"
          no-data-label="Sem dados disponíveis"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td
                style="width: 20%"
                class="my-special-class"
                key="employee"
                :props="props"
              >
                <div v-if="props.row.employeeName">
                  {{ props.row.employeeName }}
                </div>
                <div v-if="!props.row.employeeName">Não informado</div>
              </q-td>
              <q-td
                style="width: 20%"
                class="my-special-class"
                key="type"
                :props="props"
              >
                <q-badge
                  :color="getBadgeType(props.row.type)"
                  :label="props.row.type"
              /></q-td>
              <q-td
                style="width: 20%"
                class="my-special-class"
                key="date"
                :props="props"
                >{{ props.row.date || '-' }}</q-td
              >
              <q-td
                style="width: 20%"
                class="my-special-class"
                key="description"
                :props="props"
                >{{ formatDescription(props.row.description) }}</q-td
              >
              <q-td
                style="width: 10%"
                class="my-special-class"
                key="actions"
                :props="props"
              >
                <q-btn
                  class="buttonDropDownActions"
                  icon="more_vert"
                  color="primary"
                  outline
                  flat
                >
                  <q-menu>
                    <q-list class="listActions" style="width: 150px">
                      <div>
                        <q-btn
                          flat
                          outline
                          label="Visualizar resposta"
                          class="labelAction full-width"
                          style="font-size: 12px"
                          @click="
                            answer = props.row;
                            show = true;
                          "
                        ></q-btn>
                      </div>
                    </q-list>
                  </q-menu>
                </q-btn>
              </q-td>
            </q-tr>

            <q-dialog v-model="show">
              <q-card style="min-width: 600px">
                <q-card-section>
                  <div class="text-h6 q-mb-md">Respostas</div>
                  <q-list bordered separator>
                    <q-item clickable v-ripple>
                      <q-item-section>
                        <q-item-label>Nome do colaborador</q-item-label>
                        <q-item-label caption lines="2">{{
                          answer.employeeName
                            ? answer.employeeName
                            : 'Não informado'
                        }}</q-item-label>
                      </q-item-section>

                      <q-item-section>
                        <q-item-label>Data</q-item-label>
                        <q-item-label caption lines="2">{{
                          answer.date
                        }}</q-item-label>
                      </q-item-section>

                      <q-item-section>
                        <q-item-label>Tipo</q-item-label>
                        <q-item-label caption lines="2"
                          ><q-badge
                            :color="getBadgeType(answer.type)"
                            :label="answer.type"
                          />
                        </q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item clickable v-ripple>
                      <q-item-section>
                        <q-item-label>Descrição</q-item-label>
                        <q-item-label caption lines="100">{{
                          answer.description
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </q-dialog>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { Column, IAnswerRH } from 'src/types';
import { onMounted, ref } from 'vue';
import { Notify } from 'quasar';
import { loadDashboardRh } from 'src/services/NPSService';
import moment from 'moment';
import 'moment/dist/locale/pt-br';
import DateRangeInput from 'src/components/DateRangeInput.vue';
import notFound from '../assets/notfound.json';
import { Vue3Lottie } from 'vue3-lottie';

interface IAnswerTable {
  employeeName: string;
  date: string;
  description: string;
  type: string;
}

const loading = ref(false);
const rows = ref([] as IAnswerTable[]);
const show = ref(false);
const answer = ref({} as IAnswerTable);
const startDate = ref(0);
const endDate = ref(0);

const columns = ref<Column[]>([
  {
    name: 'employee',
    required: true,
    field: 'employee',
    label: 'COLABORADOR',
    sortable: false,
    align: 'left',
  },
  {
    name: 'type',
    required: true,
    field: 'type',
    label: 'TIPO',
    sortable: false,
    align: 'left',
  },
  {
    name: 'date',
    field: 'date',
    label: 'DATA',
    sortable: false,
    align: 'left',
  },
  {
    name: 'description',
    required: true,
    field: 'description',
    label: 'DESCRIÇÃO',
    sortable: false,
    align: 'left',
  },
  { name: 'actions', align: 'right', field: 'actions', label: '' },
]);

interface IResponse {
  data: IAnswerRH[] | null;
  error: unknown | null;
}

function formatDescription(text?: string): string {
  if (!text) return '-';
  return text.length > 70 ? text.slice(0, 70) + '...' : text;
}

function getBadgeType(type: string): string {
  if (type === 'Reclamação') {
    return 'red';
  }

  if (type === 'Sugestão') {
    return 'grey';
  }

  if (type === 'Denúncia') {
    return 'yellow-9';
  }

  return 'green';
}

async function loadAnswers() {
  loading.value = true;

  const { data, error }: IResponse = await loadDashboardRh(
    startDate.value,
    endDate.value
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
    rows.value = formatRows(data);
  }
}

function formatRows(data: IAnswerRH[]) {
  return data.map((item: IAnswerRH) => {
    return {
      description: item.description,
      employeeName: item.employeeName,
      date: formatDate(item.timestamp),
      type: item.type.label,
    };
  });
}

function formatDate(timestamp: number): string {
  moment.locale('pt-br');
  return moment(timestamp).format('DD/MM/YYYY');
}

onMounted(() => {
  loadAnswers();
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
