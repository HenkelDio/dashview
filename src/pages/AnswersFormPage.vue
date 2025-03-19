<template>
  <q-page class="q-pa-md q-pt-xl">
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
                key="patient"
                :props="props"
              >
                <div v-if="props.row.patient && !props.row.requestAnswered">
                  <q-badge color="blue" label="Solicitação de retorno" />
                  <div>{{ props.row.patient || '' }}</div>
                </div>
                <div v-if="props.row.patient && props.row.requestAnswered">
                  <q-badge
                    color="green"
                    :label="`Solicitação de retorno respondida em ${formatDate(
                      props.row.requestAnswered.date
                    )}`"
                  />
                  <div>{{ props.row.patient }}</div>
                </div>
                <div v-if="!props.row.patient">Sem informações</div>
              </q-td>
              <q-td
                style="width: 20%"
                class="my-special-class"
                key="date"
                :props="props"
                >{{ props.row.date || '-' }}</q-td
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
                  <q-list bordered separator>
                    <q-item
                      clickable
                      v-ripple
                      v-for="question in questions"
                      :key="question.index"
                    >
                      <q-item-section>
                        <q-item-label>{{ question.title }}</q-item-label>
                        <q-item-label caption lines="6">{{
                          question.answer
                        }}</q-item-label>
                        <q-item-label caption lines="4">{{
                          question.observation
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
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
                          patientInfo.patient
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
import { Column, IAnswer, IQuestion, IRequestAnswered } from 'src/types';
import { onMounted, ref, watch } from 'vue';
import { Notify } from 'quasar';
import { getAnswers, setRequestAnswered } from 'src/services/NPSService';
import moment from 'moment';
import 'moment/dist/locale/pt-br';
import DateRangeInput from 'src/components/DateRangeInput.vue';
import { useRoute } from 'vue-router';
import notFound from '../assets/notfound.json';
import { Vue3Lottie } from 'vue3-lottie';

interface IAnswerTable {
  id: string;
  patient: string;
  patientEmail: string;
  patientPhone: string;
  date: string;
  questions: IQuestion[];
  actions: string;
  requestAnswered?: IRequestAnswered;
}

const route = useRoute();

const npsId = ref(route.query.npsId || '');
const sortBy = ref(route.query.sortBy || 'all');

const loading = ref(false);
const rows = ref([] as IAnswerTable[]);
const show = ref(false);
const questions = ref([] as IQuestion[]);
const startDate = ref(0);
const endDate = ref(0);
const patientInfo = ref(
  {} as { patient: string; patientEmail: string; patientPhone: string }
);
const showPatientInfoDialog = ref(false);
const showConfirm = ref(false);
const loadingAnswered = ref(false);
const answerId = ref('');

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
  { name: 'actions', align: 'right', field: 'actions', label: '' },
]);

watch(sortBy, () => {
  loadAnswers();
});

interface IResponse {
  data: IAnswer[] | null;
  error: unknown | null;
}

async function loadAnswers() {
  loading.value = true;

  const { data, error }: IResponse = await getAnswers(
    sortBy.value?.toString(),
    npsId.value?.toString(),
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

function formatRows(data: IAnswer[]) {
  return data.map((item: IAnswer) => {
    return {
      id: item.id || '',
      patient: item.patientName,
      patientPhone: item.patientPhone,
      date: formatDate(item.timestamp),
      questions: item.questions,
      feedbackReturn: item.feedbackReturn,
      patientEmail: item.patientEmail,
      requestAnswered: item.requestAnswered,
      actions: '',
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
