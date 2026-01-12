<template>
  <q-page class="q-pa-md">
    <q-btn
      dense
      icon="chevron_left"
      flat
      class="q-mb-lg"
      @click="$router.back()"
      >Voltar</q-btn
    >

    <div class="text-h5 page-title q-mb-xl">Respostas</div>

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
              { label: 'Todas as respostas', value: 'all' },
              { label: 'Apenas solicitações de retorno', value: 'request' },
            ]"
          />
          <div class="flex q-gutter-x-md">
            <q-select
              v-model="filter"
              :options="filterOptions"
              dense
              outlined
              @update:model-value="reloadTable"
            />

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
              @click="reloadTable"
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
          flat
          :columns="columns"
          row-key="id"
          table-header-class="inter-bold text-dark"
          rows-per-page-label="Resultados por página"
          loading-label="Carregando..."
          :loading="loading"
          no-data-label="Sem dados disponíveis"
          v-model:pagination="pagination"
          @request="loadAnswers"
          :rows-per-page-options="[5, 10, 20]"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td
                style="width: 20%"
                class="my-special-class"
                key="patient"
                :props="props"
              >
                <div
                  v-if="props.row.feedbackReturn && !props.row.requestAnswered"
                >
                  <q-badge color="blue" label="Solicitação de retorno" />
                  <div>{{ props.row.patientName || '' }}</div>
                </div>
                <div v-if="props.row.requestAnswered">
                  <q-badge
                    color="green"
                    :label="`Solicitação de retorno respondida em ${formatDate(
                      props.row.requestAnswered.timestamp
                    )}`"
                  />
                  <div>{{ props.row.patientName }}</div>
                </div>
                <div v-if="!props.row.patientName">Sem informações</div>
                <div v-if="props.row.patientName && !props.row.feedbackReturn">
                  {{ props.row.patientName }}
                </div>
              </q-td>
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
                key="score"
                :props="props"
              >
                <q-badge
                  :color="getBadgeTypeNPS(props.row.score.score)"
                  :label="getLabelNPS(props.row.score.score)"
                />
              </q-td>
              <q-td
                style="width: 20%"
                class="my-special-class"
                key="classification"
                :props="props"
              >
                <div
                  v-if="props.row.classification"
                  :style="{
                    backgroundColor: props.row.classification.color,
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    display: 'inline-block',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                  }"
                >
                  {{ props.row.classification.description }}
                </div>

                <div v-if="!props.row.classification">-</div>
              </q-td>
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
                          label="Visualizar respostas"
                          class="labelAction full-width"
                          style="font-size: 12px"
                          @click="
                            questions = props.row.questions;
                            answer = props.row;
                            show = true;
                          "
                        ></q-btn>
                        <q-btn
                          flat
                          outline
                          label="Informações do paciente"
                          class="labelAction full-width"
                          style="font-size: 12px"
                          @click="
                            patientInfo = props.row;
                            showPatientInfoDialog = true;
                          "
                        ></q-btn>
                        <q-btn
                          flat
                          outline
                          v-if="
                            props.row.feedbackReturn &&
                            !props.row.requestAnswered
                          "
                          label="Marcar como respondido"
                          class="labelAction full-width"
                          style="font-size: 12px"
                          @click="
                            answerId = props.row.id;
                            showConfirm = true;
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
                  <div class="text-h6">Respostas</div>

                  <q-item clickable v-ripple>
                    <q-item-section>
                      <q-item-label>Nome do paciente</q-item-label>
                      <q-item-label caption lines="2">{{
                        answer.patientName
                          ? answer.patientName
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
                          :color="getBadgeType(answer.answerType)"
                          :label="answer.answerType"
                        />
                      </q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item clickable v-ripple>
                    <q-item-section v-if="answer.patientEmail">
                      <q-item-label>E-mail do paciente</q-item-label>
                      <q-item-label caption lines="2">{{
                        answer.patientEmail
                      }}</q-item-label>
                    </q-item-section>

                    <q-item-section v-if="answer.patientPhone">
                      <q-item-label>Telefone</q-item-label>
                      <q-item-label caption lines="2">{{
                        answer.patientPhone
                      }}</q-item-label>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label>Score</q-item-label>
                      <q-item-label caption lines="2"
                        ><q-badge
                          :color="getBadgeTypeNPS(answer.score.score)"
                          :label="`${getLabelNPS(answer.score.score)} - ${
                            answer.score.answer
                          }`"
                        />
                      </q-item-label>
                    </q-item-section>
                    <q-item-section v-if="answer.origin">
                      <q-item-label>Origem</q-item-label>
                      <q-item-label caption lines="2">
                        {{
                          answer.origin === 'onlyNew'
                            ? 'Formulário Recepção'
                            : 'Formulário NPS (Geral)'
                        }}
                      </q-item-label>
                    </q-item-section>

                    <q-item-section v-if="answer.classification?.id">
                      <q-item-label>Classificação</q-item-label>
                      <q-item-label caption lines="2">
                        <div
                          :style="{
                            backgroundColor: answer.classification.color,
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            display: 'inline-block',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                          }"
                        >
                          {{ answer.classification.description }}
                        </div>
                      </q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item clickable v-ripple v-if="answer.feedbackType">
                    <q-item-section>
                      <q-item-label>Tipo de retorno desejado</q-item-label>
                      <q-item-label caption lines="2">
                        {{
                          answer.feedbackType === 'whatsapp'
                            ? 'WhatsApp'
                            : 'E-mail'
                        }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-list bordered separator>
                    <q-item
                      clickable
                      v-ripple
                      v-for="question in questions"
                      :key="question.index"
                    >
                      <q-item-section>
                        <q-item-label>{{ question.title }}</q-item-label>
                        <q-item-label caption lines="100">{{
                          question.answer
                        }}</q-item-label>
                        <q-item-label caption lines="100">{{
                          question.observation
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
                <q-card-actions align="right" style="padding: 15px">
                  <q-btn
                    @click="
                      showClassification = true;
                      getClassifications();
                    "
                    unelevated
                    color="secondary"
                    >Classificar resposta</q-btn
                  >
                </q-card-actions>
              </q-card>
            </q-dialog>

            <q-dialog v-model="showClassification">
              <q-card style="min-width: 600px">
                <q-card-section>
                  <div class="text-h6">Classificar resposta</div>
                  <q-select
                    :loading="loadingClassifications"
                    :options="classifications"
                    v-model="classification"
                    label="Classificação"
                    outlined
                    emit-value
                    map-options
                  />
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn flat @click="showClassification = false">Fechar</q-btn>
                  <q-btn
                    unelevated
                    color="primary"
                    :disable="!classification"
                    @click="saveClassification"
                    >Salvar</q-btn
                  >
                </q-card-actions>
              </q-card>
            </q-dialog>

            <q-dialog v-model="showPatientInfoDialog">
              <q-card style="min-width: 600px">
                <q-card-section>
                  <div class="text-h6">Informações do paciente</div>
                  <q-list bordered separator>
                    <q-item clickable v-ripple>
                      <q-item-section>
                        <q-item-label>Nome</q-item-label>
                        <q-item-label caption lines="2">{{
                          patientInfo.patientName
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item clickable v-ripple>
                      <q-item-section>
                        <q-item-label>Telefone</q-item-label>
                        <q-item-label caption lines="2">{{
                          patientInfo.patientPhone
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item clickable v-ripple>
                      <q-item-section>
                        <q-item-label>E-mail</q-item-label>
                        <q-item-label caption lines="2">{{
                          patientInfo.patientEmail
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </q-dialog>

            <q-dialog v-model="showConfirm" persistent>
              <q-card style="min-width: 400px">
                <q-card-section>
                  <div class="text-h6">
                    Tem certeza que deseja marcar como respondido?
                  </div>
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn
                    label="Fechar"
                    flat
                    @click="showConfirm = false"
                    :disable="loadingAnswered"
                  >
                  </q-btn>
                  <q-btn
                    unelevated
                    color="primary"
                    label="Sim"
                    @click="setAnswered()"
                    :loading="loadingAnswered"
                  >
                  </q-btn>
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
import {
  Column,
  IAnswer,
  IClassification,
  IQuestion,
  IRequestAnswered,
} from 'src/types';
import { onMounted, ref, watch } from 'vue';
import { Notify } from 'quasar';
import { getAnswers, setRequestAnswered } from 'src/services/NPSService';
import moment from 'moment';
import 'moment/dist/locale/pt-br';
import DateRangeInput from 'src/components/DateRangeInput.vue';
import { useRoute } from 'vue-router';
import notFound from '../assets/notfound.json';
import { Vue3Lottie } from 'vue3-lottie';
import {
  getAllClassification,
  saveAnswerClassification,
} from 'src/services/classificationService';

interface IAnswerTable {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  date: string;
  questions: IQuestion[];
  actions: string;
  requestAnswered?: IRequestAnswered;
  classification: IClassification | undefined;
}

const route = useRoute();

const npsId = ref(route.query.npsId || '');
const sortBy = ref(route.query.sortBy || 'all');

const loading = ref(false);
const rows = ref([] as IAnswerTable[]);
const show = ref(false);
const questions = ref([] as IQuestion[]);
const answer = ref({} as IAnswer);
const startDate = ref(0);
const endDate = ref(0);
const patientInfo = ref(
  {} as { patientName: string; patientEmail: string; patientPhone: string }
);
const showPatientInfoDialog = ref(false);
const showConfirm = ref(false);
const loadingAnswered = ref(false);
const answerId = ref('');
const classification = ref<string | null>(null);

const showClassification = ref(false);
const classifications = ref([] as { value: string; label: string }[]);
const loadingClassifications = ref(false);

const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 0,
});

const filter = ref({
  label: 'Ver todos',
  value: 'all',
});
const filterOptions = ref([
  {
    label: 'Apenas detratores',
    value: 'detractor',
  },
  {
    label: 'Apenas promotores',
    value: 'promoter',
  },
  {
    label: 'Apenas neutros',
    value: 'neutral',
  },
  {
    label: 'Ver todos',
    value: 'all',
  },
]);

const columns = ref<Column[]>([
  {
    name: 'patient',
    required: true,
    field: 'patient',
    label: 'PACIENTE',
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
    name: 'score',
    required: true,
    field: 'score',
    label: 'SCORE',
    sortable: false,
    align: 'left',
  },
  {
    name: 'classification',
    required: true,
    field: 'classification',
    label: 'CLASSIFICAÇÃO',
    sortable: false,
    align: 'left',
  },
  {
    name: 'description',
    required: true,
    field: 'description',
    label: 'EXPERIÊNCIA',
    sortable: false,
    align: 'left',
  },
  { name: 'actions', align: 'right', field: 'actions', label: '' },
]);

function reloadTable() {
  pagination.value.page = 1;
  loadAnswers({ pagination: pagination.value });
}

watch(sortBy, () => {
  reloadTable();
});

interface IResponse {
  data: {
    content: IAnswer[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  } | null;
  error: unknown | null;
}

interface IResponseClassification {
  data: IClassification[] | null;
  error: unknown | null;
}

async function getClassifications() {
  loadingClassifications.value = true;
  const { data, error }: IResponseClassification = await getAllClassification(
    'ACTIVE'
  );
  loadingClassifications.value = false;

  if (error) {
    Notify.create({
      caption: 'Erro ao carregar departamentos',
      group: true,
      color: 'red',
    });
    return;
  }

  if (data) {
    classifications.value = data.map((item) => {
      return {
        label: item.description,
        value: item.id,
      };
    });
  }
}

async function saveClassification() {
  const payload = {
    answerId: answer.value.id,
    classificationId: classification.value,
  };
  const { error } = await saveAnswerClassification(payload);

  if (error) {
    Notify.create({
      caption: 'Erro ao classificar resposta',
      group: true,
      color: 'red',
    });
    return;
  }

  Notify.create({
    caption: 'Resposta classificada com sucesso',
    group: true,
    color: 'green',
  });

  showClassification.value = false;
  show.value = false;

  reloadTable();
}

function getLabelNPS(score: string) {
  if (score === 'DETRACTOR') {
    return 'Detrator';
  }

  if (score === 'NEUTRAL') {
    return 'Neutro';
  }

  return 'Promotor';
}

function getBadgeType(type: string): string {
  if (type === 'Reclamação') {
    return 'red';
  }

  if (type === 'Sugestão') {
    return 'grey';
  }

  return 'green';
}

function getBadgeTypeNPS(type: string): string {
  if (type === 'DETRACTOR') {
    return 'red';
  }

  if (type === 'NEUTRAL') {
    return 'grey';
  }

  return 'green';
}

function formatDescription(text?: string): string {
  if (!text) return '-';
  return text.length > 50 ? text.slice(0, 50) + '...' : text;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function loadAnswers(props?: any) {
  loading.value = true;

  if (props?.pagination) {
    console.log('props.pagination', props);
    pagination.value.page = props.pagination.page;
    pagination.value.rowsPerPage = props.pagination.rowsPerPage;
  }

  const { page, rowsPerPage } = pagination.value;

  const { data, error }: IResponse = await getAnswers(
    sortBy.value?.toString(),
    npsId.value?.toString(),
    startDate.value,
    endDate.value,
    filter.value.value,
    page - 1, // backend começa em 0
    rowsPerPage
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
    rows.value = formatRows(data.content);
    pagination.value.rowsNumber = data.totalElements;
  }
}

function formatRows(data: IAnswer[]) {
  return data.map((item: IAnswer) => {
    return {
      id: item.id || '',
      patientName: item.patientName,
      patientPhone: item.patientPhone,
      date: formatDate(item.timestamp),
      score: {
        score: item.score.score,
        answer: item.score.answer,
      },
      description: item.questions.filter((item) => item.index === '14')[0]
        .answer,
      questions: item.questions,
      feedbackReturn: item.feedbackReturn,
      patientEmail: item.patientEmail,
      requestAnswered: item.requestAnswered,
      answerType: item.answerType,
      origin: item.origin,
      actions: '',
      classification: item.classification,
      feedbackType: item.feedbackType,
    };
  });
}

function formatDate(timestamp: number): string {
  moment.locale('pt-br');
  return moment(timestamp).format('DD/MM/YYYY');
}

async function setAnswered() {
  loadingAnswered.value = true;
  const { data, error } = await setRequestAnswered(answerId.value);
  loadingAnswered.value = false;

  if (error) {
    Notify.create({
      message: 'Erro ao marcar como respondido',
      color: 'red',
    });
    return;
  }

  if (data) {
    Notify.create({
      message: 'Solicitação marcada como respondida',
      color: 'green',
    });
    loadAnswers();
    showConfirm.value = false;
  }
}

onMounted(() => {
  loadAnswers({ pagination: pagination.value });
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
