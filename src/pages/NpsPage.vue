<template>
  <q-page class="q-pa-md q-pt-xl">
    <div class="text-h5 page-title q-mb-xl">Envio de NPS</div>

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
              @click="listNps"
            />
          </div>

          <q-btn
            no-caps
            label="Importar arquivo"
            color="primary"
            class="inter-bold"
            size="1rem"
            unelevated
            @click="showDialog = true"
          />

          <!-- 
          /> -->
        </div>

        <q-dialog v-model="showDialog">
          <q-card>
            <q-card-section>
              <div class="text-h6">Importar arquivo</div>
              <div class="text-subtitle">
                Importe o arquivo de e-mails dos pacientes, para que seja
                enviado a pesquisa de satisfação.
              </div>
              <div class="text-caption">O arquivo deve ser um .csv</div>
            </q-card-section>
            <q-card-section>
              <q-file
                label="Importar arquivo"
                class="inter-bold"
                outlined
                color="white"
                dense
                v-model="file"
                accept=".csv"
              >
                <template v-slot:prepend>
                  <q-icon name="attachment" /> </template
              ></q-file>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn
                label="Enviar"
                color="primary"
                :disable="!file"
                @click="uploadFile"
                :loading="loadingFile"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
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
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td style="width: 20%" key="sentDate" :props="props">{{
                props.row.sentDate || '-'
              }}</q-td>
              <q-td style="width: 20%" key="sentBy" :props="props">{{
                props.row.sentBy || '-'
              }}</q-td>
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
                          label="Visualizar respostas"
                          class="labelAction full-width"
                          style="font-size: 12px"
                          @click="
                            $router.push(
                              '/answers?sortBy=all&npsId=' + props.row.id
                            )
                          "
                        ></q-btn>
                      </div>
                    </q-list>
                  </q-menu>
                </q-btn>
              </q-td>
            </q-tr>
          </template>

          <template v-slot:body-cell-actions="props">
            <div>
              <q-btn
                flat
                icon="visibility"
                color="primary"
                class="text-weight-bold"
                >Visualizar envios</q-btn
              >
            </div>

            <q-dialog v-model="showDialogEmails">
              <q-card>
                <q-card-section>
                  <div class="text-h6">Pesquisa enviada para os e-mails:</div>
                </q-card-section>
                <q-card-section>
                  <q-list bordered separator>
                    <div
                      v-for="(patient, index) in props.row.patientNpsList"
                      :key="index"
                    >
                      <q-item clickable v-ripple>
                        <q-item-section>{{ patient.email }}</q-item-section>
                      </q-item>
                    </div>
                  </q-list>
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn
                    label="Fechar"
                    flat
                    @click="showDialogEmails = false"
                  />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { Column, INPS, INPSTable } from 'src/types';
import { onMounted, ref } from 'vue';
import { countFeedbackReturns, getNPS, sendNPS } from 'src/services/NPSService';
import { Notify } from 'quasar';
import moment from 'moment';
import 'moment/dist/locale/pt-br';
import DateRangeInput from 'src/components/DateRangeInput.vue';
import notFound from '../assets/notfound.json';
import { Vue3Lottie } from 'vue3-lottie';

const loading = ref(false);
const rows = ref([] as INPSTable[]);
const showDialog = ref(false);
const file = ref<File | null>(null);
const loadingFile = ref(false);
const showDialogEmails = ref(false);
const loadingFeedbackReturns = ref(false);
const feedbackCount = ref(0);
const startDate = ref(0);
const endDate = ref(0);

const columns = ref<Column[]>([
  {
    name: 'sentDate',
    required: true,
    field: 'sentDate',
    label: 'DATA DE ENVIO',
    sortable: false,
    align: 'left',
  },
  {
    name: 'sentBy',
    field: 'sentBy',
    label: 'ENVIADO POR',
    sortable: false,
    align: 'left',
  },
  { name: 'actions', align: 'center', field: 'actions', label: '' },
]);

// watch(searchParam, (value: string) => {
//   filteredRows.value = rows.value.filter((item) =>
//     item.name.toLowerCase().includes(value.toLowerCase())
//   );
// });

async function uploadFile() {
  if (!file.value) {
    console.error('Nenhum arquivo selecionado');
    return;
  }

  loadingFile.value = true;

  const selectedFile = new File([file.value], file.value.name, {
    type: file.value.type,
  });

  const { error } = await sendNPS(selectedFile);

  loadingFile.value = false;

  if (error) {
    Notify.create({
      message: 'Erro ao importar arquivo',
      group: true,
      color: 'red',
    });

    return;
  }

  Notify.create({
    message: 'Pesquisas enviadas com sucesso!',
    group: true,
    color: 'green',
  });

  file.value = null;
  showDialog.value = false;
  listNps();
}

async function listNps() {
  loading.value = true;
  const { data, error } = await getNPS(startDate.value, endDate.value);
  loading.value = false;

  if (error) {
    Notify.create({
      message: 'Erro ao carregar nps',
      group: true,
      color: 'red',
    });

    return;
  }

  rows.value = formatNpsData(data);
  console.log('rows', rows.value);
}

function formatNpsData(data: INPS[]) {
  return data.map((item: INPS) => {
    return {
      ...item,
      sentDate: formatDate(item.sentDate),
    };
  });
}

function formatDate(timestamp: number): string {
  moment.locale('pt-br');
  return moment(timestamp).format('DD/MM/YYYY');
}

async function getFeedbackReturnsCount() {
  loadingFeedbackReturns.value = true;
  const { data } = await countFeedbackReturns();
  loadingFeedbackReturns.value = false;

  if (data) {
    feedbackCount.value = data;
  }
}

onMounted(() => {
  getFeedbackReturnsCount();
  listNps();
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
