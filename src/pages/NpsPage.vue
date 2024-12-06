<template>
  <q-page class="q-pa-md q-pt-xl">
    <div class="text-h5 page-title">NPS</div>

    <div class="flex q-gutter-x-md q-mt-xl">
      <div
        :style="{
          width: '280px',
          marginBottom: '20px',
        }"
      >
        <CardInfo
          value="20"
          description="Solicitições de retorno"
          icon="account_circle"
          colorIcon="green"
          :action="true"
        />
      </div>

      <div
        :style="{
          width: '280px',
          marginBottom: '20px',
        }"
      >
        <CardInfo
          value="15"
          description="Formulários respondidos"
          icon="insert_chart"
          colorIcon="blue"
        />
      </div>
    </div>

    <q-card flat class="q-mt-sm">
      <q-card-section>
        <div class="flex justify-between">
          <q-input id="period" outlined dense readonly v-model="dateDisplay">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    :options="dateOptions"
                    mask="DD/MM/YYYY"
                    v-model="dateValue"
                    range
                  >
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="FECHAR"
                        color="primary"
                        flat
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-btn
            no-caps
            label="Importar arquivo"
            color="primary"
            class="inter-bold"
            size="1rem"
            unelevated
            @click="showDialog = true"
          />
        </div>
      </q-card-section>

      <q-card-section>
        <q-table
          flat
          class="my-sticky-header-table"
          style="height: 400px"
          :rows="rows"
          virtual-scroll
          :columns="columns"
          row-key="name"
          table-header-class="inter-bold text-dark"
          rows-per-page-label="Resultados por página"
          loading-label="Carregando..."
          :loading="loading"
          no-data-label="Sem dados disponíveis"
        >
          <template v-slot:body-cell-actions="">
            <div>
              <q-btn
                flat
                icon="visibility"
                color="primary"
                class="text-weight-bold"
                >Visualizar respostas</q-btn
              >
            </div>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { Column, INPSTable } from 'src/types';
import { computed, ref } from 'vue';
import 'moment/dist/locale/pt-br';
import CardInfo from 'src/components/CardInfo.vue';

const loading = ref(false);
const rows = ref([
  { date: '30/11/2024', sendBy: 'Willian Henkel', formType: 'NPS 1' },
  { date: '30/11/2024', sendBy: 'Willian Henkel', formType: 'NPS 1' },
  { date: '30/11/2024', sendBy: 'Willian Henkel', formType: 'NPS 1' },
  { date: '30/11/2024', sendBy: 'Willian Henkel', formType: 'NPS 1' },
  { date: '30/11/2024', sendBy: 'Willian Henkel', formType: 'NPS 1' },
  { date: '30/11/2024', sendBy: 'Willian Henkel', formType: 'NPS 1' },
  { date: '30/11/2024', sendBy: 'Willian Henkel', formType: 'NPS 1' },
  { date: '30/11/2024', sendBy: 'Willian Henkel', formType: 'NPS 1' },
  { date: '30/11/2024', sendBy: 'Willian Henkel', formType: 'NPS 1' },
  { date: '30/11/2024', sendBy: 'Willian Henkel', formType: 'NPS 1' },
  { date: '30/11/2024', sendBy: 'Willian Henkel', formType: 'NPS 1' },
  { date: '30/11/2024', sendBy: 'Willian Henkel', formType: 'NPS 1' },
  { date: '30/11/2024', sendBy: 'Willian Henkel', formType: 'NPS 1' },
] as INPSTable[]);
const showDialog = ref(false);
const dateValue = ref({} as { to: string; from: string });

const columns = ref<Column[]>([
  {
    name: 'date',
    required: true,
    field: 'date',
    label: 'DATA DE ENVIO',
    sortable: false,
    align: 'left',
  },
  {
    name: 'sendBy',
    field: 'sendBy',
    label: 'ENVIADO POR',
    sortable: false,
    align: 'left',
  },
  {
    name: 'formType',
    field: 'formType',
    label: 'TIPO DE FORMULÁRIO',
    sortable: false,
    align: 'left',
  },
  { name: 'actions', align: 'center', field: 'actions', label: '' },
]);

// function formatDate(timestamp: number): string {
//   moment.locale('pt-br');
//   return moment(timestamp).fromNow();
// }

// watch(searchParam, (value: string) => {
//   filteredRows.value = rows.value.filter((item) =>
//     item.name.toLowerCase().includes(value.toLowerCase())
//   );
// });

const dateDisplay = computed(() => {
  if (!dateValue.value) {
    return '';
  }

  if (!dateValue.value.from || !dateValue.value.to) {
    return '';
  }

  const displayDate = `${dateValue.value.from} - ${dateValue.value.to}`;
  return displayDate;
});

function dateOptions(date: string) {
  return new Date(date) <= new Date();
}
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
