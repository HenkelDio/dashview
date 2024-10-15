<template>
  <q-page class="q-pa-md q-pt-xl">
    <div class="text-h5 page-title">Gráficos</div>

    <q-card flat class="q-mt-xl">
      <q-card-section>
        <div class="flex justify-between">
          <div class="flex q-gutter-md">
            <q-btn-toggle
              v-model="chartStatus"
              color="grey-4"
              toggle-color="grey-5"
              no-caps
              toggle-text-color="grey-10"
              unelevated
              text-color="grey-9"
              class="inter-bold"
              emit-value
              :options="[
                { label: 'Ativos', value: 'ACTIVE' },
                { label: 'Inativos', value: 'INACTIVE' },
              ]"
            />
            <q-input
              v-model="searchParam"
              outlined
              dense
              placeholder="Buscar pelo nome"
            />
          </div>

          <q-btn
            no-caps
            label="Adicionar gráfico"
            color="primary"
            class="inter-bold"
            size="1rem"
            unelevated
            @click="$router.push({ path: '/create-chart'})"
            :style="inputStyle"
          />
        </div>
      </q-card-section>

      <q-card-section>
        <q-table
          flat
          :rows="filteredRows"
          :columns="columns"
          row-key="name"
          table-header-class="inter-bold text-dark"
          rows-per-page-label="Resultados por página"
          loading-label="Carregando..."
          :loading="loading"
          no-data-label="Nenhum gráfico encontrado"
        >
        <template v-slot:body-cell-createdBy="props">
            <div class="flex items-center q-py-sm q-pl-xl">
              <q-avatar
                style="cursor: default;"
                size="32px"
                class="q-mr-sm text-white"
                :color="props.row.status === 'ACTIVE' ? 'primary' : 'dark'"
                >{{ props.row.createdBy.charAt(0) }}
                <q-tooltip>
                  {{props.row.createdBy}}
                </q-tooltip>
                </q-avatar
              >
            </div>
            <q-separator />
          </template>
          <template v-slot:body-cell-actions="props">
            <div>
              <q-btn
                v-if="props.row.status === 'ACTIVE'"
                flat
                round
                dense
                icon="edit"
                color="primary"
                @click="$router.push({path: `/create-chart`, query: {id: props.row.id }})"
              />
              <q-btn
                flat
                round
                dense
                :icon="
                  props.row.status === 'ACTIVE'
                    ? 'delete'
                    : 'published_with_changes'
                "
                :color="props.row.status === 'ACTIVE' ? 'negative' : 'primary'"
                @click="handleShowDialog(props.row.status, props.row.id)"
              />
            </div>

            <GenericDialog
              v-if="showDisableDialog"
              @close="() => showDisableDialog = false"
              @confirm="changeStatus(props.row.id, props.row.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')"
              title="Desativar gráfico?"
              description="O gráfico não ficará mais visível"
              confirm-label-button="Desativar"
              color-label-button="red"
              :loading="loadingDisable"
            />
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { Notify, useQuasar } from 'quasar';
import { Column, IChart, IFilterCharts, STATUS } from 'src/types';
import { computed, onMounted, ref, watch } from 'vue';
import moment from 'moment';
import 'moment/dist/locale/pt-br'
import GenericDialog from 'src/components/Dialogs/GenericDialog.vue';
import { changeStatusChart, findAllChartsByDepartment } from 'src/services/ChartService';

interface IChartTable {
  id: string,
  title: string,
  createdBy: string
  createdOn: string,
  status: STATUS
}

const loading = ref(false);
const rows = ref([] as IChartTable[]);
const showDisableDialog = ref(false);
const searchParam = ref('');
const filteredRows = ref([] as IChartTable[]);
const chartStatus = ref('ACTIVE');
const loadingDisable = ref(false);

const columns = ref<Column[]>([
  {
    name: 'title',
    required: true,
    field: 'title',
    label: 'GRÁFICO',
    sortable: false,
    align: 'left',
  },
  {
    name: 'createdBy',
    field: 'createdBy',
    label: 'CRIADO POR',
    sortable: false,
    align: 'left',
  },
  {
    name: 'createdOn',
    label: 'CRIADO EM',
    field: 'createdOn',
    sortable: true,
    align: 'left',
  },
  { name: 'actions', align: 'center', field: 'actions', label: '' },
]);

async function getAllChartByDepartment() {
  loading.value = true;

  const payload: IFilterCharts = {

  }

  const { data, error } = await findAllChartsByDepartment(chartStatus.value, payload);
  loading.value = false;

  if(error) {
    Notify.create({
      message: 'Erro ao carregar processos',
      color: 'red'
    })
  }

  if(data) {
    const currentRows: IChartTable[] = data.map((chart: IChart) => {
      return {
        id: chart.id,
        title: chart.title,
        createdBy: chart.createdBy.name,
        createdOn: formatDate(chart.createdOn),
        status: chart.status,
      };
    });

    rows.value = currentRows;
    filteredRows.value = currentRows;
  }
}

function formatDate(timestamp: number): string {
    moment.locale('pt-br');
    return moment(timestamp).fromNow();
}

async function changeStatus(id: string, status: string) {
  loadingDisable.value = true;
  const { error } = await changeStatusChart(status, id);
  loadingDisable.value = false;

  if(error) {
    Notify.create({
      message: 'Erro ao desativar perspectivas',
      color: 'red'
    })
    return;
  }
  showDisableDialog.value = false;
  getAllChartByDepartment();
}

function handleShowDialog(status: string, id: string,) {
  if(status === 'ACTIVE') {
    showDisableDialog.value = true
  } else {
    changeStatus(id, 'ACTIVE');
  }
}

watch(searchParam, (value: string) => {
  filteredRows.value = rows.value.filter((item) =>
    item.title.toLowerCase().includes(value.toLowerCase())
  );
});

watch(chartStatus, () => {
  showDisableDialog.value = false;
  getAllChartByDepartment()
});

const $q = useQuasar();

const inputStyle = computed(() => {
  return $q.platform.is.mobile
    ? {
        marginTop: '10px',
      }
    : {

      };
});

onMounted(() => {
  getAllChartByDepartment()
})

</script>
