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

          <div class="flex q-gutter-x-md align-center">
            <q-btn
              flat
              no-caps
              color="secondary"
              class="inter-medium"
              @click="showTutorial = true"
              >Como enviar o NPS?</q-btn
            >
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
              <div class="text-caption">O arquivo deve ser um .xls</div>
            </q-card-section>
            <q-card-section>
              <q-file
                label="Importar arquivo"
                class="inter-bold"
                outlined
                color="white"
                dense
                v-model="file"
                accept=".xls"
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

        <q-dialog v-model="showEmailsErrors">
          <q-card>
            <q-card-section>
              <div class="text-h6">
                Não foi possível enviar a pesquisa para os seguintes e-mails:
              </div>
            </q-card-section>
            <q-card-section>
              <div v-for="email in emailsErrors" :key="email">
                <q-item clickable v-ripple>
                  <q-item-section>{{ email }}</q-item-section>
                </q-item>
              </div>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn
                label="Fechar"
                color="primary"
                @click="showEmailsErrors = false"
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
              <q-td style="width: 20%" key="sentBy" :props="props">{{
                props.row.quantity + ' e-mails' || '-'
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
                        <q-btn
                          flat
                          outline
                          label="Visualizar e-mails"
                          class="labelAction full-width"
                          style="font-size: 12px"
                          @click="
                            patientNpsList = props.row.patientNpsList;
                            showEmails = true;
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

    <q-dialog v-model="showTutorial">
      <q-card style="min-height: 500px">
        <q-card-section>
          <div class="text-h6">Como enviar o NPS?</div>
          <div class="caption">
            Para enviar a pesquisa de satisfação você precisará exportar um
            arquivo do sistema de internação da RISC e importar aqui.
          </div>

          <q-tabs
            v-model="tab"
            dense
            class="text-grey q-mt-md"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="video" label="Vídeo" />
            <q-tab name="text" label="Descrito" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="video">
              <div>
                <div class="text-subtitle2">Como gerar o arquivo</div>
                <q-video style="height: 400px" :src="reportVideo" />
              </div>
              <div>
                <div class="text-subtitle2 q-mt-lg">
                  Como importar o arquivo
                </div>
                <q-video style="height: 400px" :src="importVideo" />
              </div>
            </q-tab-panel>
            <q-tab-panel name="text">
              <div class="text-body2 q-mt-md">
                <div class="text-subtitle2">
                  1. Acessar o Sistema de Internação da RISC
                </div>
                <div class="text-grey-9">
                  Acesse o sistema de internação da RISC. Faça login com suas
                  credenciais de acesso.
                </div>
              </div>

              <div class="text-body2 q-mt-md">
                <div class="text-subtitle2">2. Acessar Relatórios</div>
                <div class="text-grey-9">
                  No painel de navegação, clique em "Relatórios" para expandir
                  as opções.
                </div>
              </div>

              <div class="text-body2 q-mt-md">
                <div class="text-subtitle2">
                  3. Selecionar Relatório de Dados do Paciente - Excel
                </div>
                <div class="text-grey-9">
                  No menu de relatórios, clique em "Relatório Dados do Paciente
                  - Excel" para abrir a tela de configuração do relatório.
                </div>
              </div>

              <div class="text-body2 q-mt-md">
                <div class="text-subtitle2">4. Selecionar o Período</div>
                <div class="text-grey-9">
                  Escolha o intervalo de datas desejado preenchendo as datas de
                  início e término do período.
                </div>
              </div>

              <div class="text-body2 q-mt-md">
                <div class="text-subtitle2">
                  5. Configurar o Tipo de Pesquisa
                </div>
                <div class="text-grey-9">
                  Em "Tipo de Pesquisa", selecione a opção "Pesquisar pela data
                  de Alta".
                </div>
              </div>

              <div class="text-body2 q-mt-md">
                <div class="text-subtitle2">6. Gerar o Relatório</div>
                <div class="text-grey-9">
                  Clique em "Ok" ou "Gerar Relatório" para processar os dados e
                  gerar o arquivo .xls.
                </div>
              </div>

              <div class="text-body2 q-mt-md">
                <div class="text-subtitle2">
                  7. Acessar o Sistema Gerenciador de NPS
                </div>
                <div class="text-grey-9">
                  Acesse o Sistema Gerenciador de NPS. Faça login com suas
                  credenciais.
                </div>
              </div>

              <div class="text-body2 q-mt-md">
                <div class="text-subtitle2">
                  8. Ir para a Aba de Envio de NPS
                </div>
                <div class="text-grey-9">
                  No Sistema Gerenciador de NPS, clique na aba "Envio de NPS"
                  para abrir a tela de importação de arquivos.
                </div>
              </div>

              <div class="text-body2 q-mt-md">
                <div class="text-subtitle2">9. Importar o Arquivo</div>
                <div class="text-grey-9">
                  Clique em "Importar" e selecione o arquivo .xls gerado pelo
                  sistema de internação da RISC. Clique em "Abrir".
                </div>
              </div>

              <div class="text-body2 q-mt-md">
                <div class="text-subtitle2">10. Enviar o Arquivo</div>
                <div class="text-grey-9">
                  Após a seleção, clique em "Enviar" para importar os dados do
                  arquivo para o Sistema Gerenciador de NPS.
                </div>
              </div>

              <div class="text-body2 q-mt-md">
                <div class="text-subtitle2">11. Confirmar o Envio</div>
                <div class="text-grey-9">
                  O sistema processará o arquivo. Aguarde a mensagem de
                  confirmação do envio.
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showEmails">
      <q-card style="min-height: 500px">
        <q-card-section>
          <div class="text-subtitle2 q-mb-sm">
            Enviado para {{ patientNpsList.length }} e-mails
          </div>

          <q-list
            bordered
            separator
            v-for="(email, index) in patientNpsList"
            :key="index"
          >
            <q-item-section class="q-pa-sm">
              <q-item-label class="inter-medium">{{
                email.email
              }}</q-item-label>
              <q-item-label caption>{{ email.name }}</q-item-label>
            </q-item-section>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts" setup>
import { Column, INPS, INPSTable, PatientNps } from 'src/types';
import { onMounted, ref } from 'vue';
import { countFeedbackReturns, getNPS, sendNPS } from 'src/services/NPSService';
import { Notify } from 'quasar';
import moment from 'moment';
import 'moment/dist/locale/pt-br';
import DateRangeInput from 'src/components/DateRangeInput.vue';
import notFound from '../assets/notfound.json';
import { Vue3Lottie } from 'vue3-lottie';
import reportVideo from '../assets/como_gerar_o_relatorio.mp4';
import importVideo from '../assets/envio_de_email.mp4';

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
const showTutorial = ref(false);
const tab = ref('video');
const showEmailsErrors = ref(false);
const emailsErrors = ref([]);
const showEmails = ref(false);
const patientNpsList = ref([] as PatientNps[]);

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
  {
    name: 'quantity',
    field: 'quantity',
    label: 'ENVIADO PARA',
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

  const { error, data } = await sendNPS(selectedFile);

  loadingFile.value = false;

  if (error) {
    Notify.create({
      message: 'Erro ao importar arquivo',
      group: true,
      color: 'red',
    });

    return;
  }

  if (data.length > 0) {
    showEmailsErrors.value = true;
    emailsErrors.value = data;
  } else {
    Notify.create({
      message: 'Pesquisas enviadas com sucesso!',
      group: true,
      color: 'green',
    });
  }

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
      quantity: item.patientNpsList.length,
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
