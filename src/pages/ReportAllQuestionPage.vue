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

    <div class="text-h5 page-title q-mb-xl">Relatório por pergunta</div>
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
              :disable="startDate === 0 && endDate === 0"
              dense
              label="Buscar"
              color="secondary"
              class="inter-medium q-px-md"
              size="1rem"
              unelevated
              no-caps
              icon="search"
              @click="getReportByQuestion"
              :disabled="loading"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-inner-loading
          :showing="loading"
          style="height: 100px"
          color="primary"
        />
      </q-card-section>
    </q-card>

    <div v-if="!loading">
      <div v-if="answers.length > 0">
        <div v-for="(item, index) in answers" :key="index">
          <ReportChart :details="item" />
        </div>
      </div>
      <div v-if="itemManifest.title">
        <ReportManifestChart :details="itemManifest" />
      </div>
      <div v-if="reviews.length > 0">
        <q-card flat class="q-mt-sm">
          <q-card-section>
            <q-expansion-item
              expand-separator
              icon="info"
              label="Relatos sobre experiências"
              :caption="reviews.length + ' respostas'"
            >
              <q-list
                bordered
                separator
                class="rounded-borders cursor-pointer"
                v-for="(item, index) in reviews"
                :key="index"
                @click="showForm(item._id)"
              >
                <q-item>{{ item.answer }}</q-item>
              </q-list>
            </q-expansion-item>
          </q-card-section>
        </q-card>

        <q-dialog v-model="show">
          <q-card style="min-width: 600px">
            <q-card-section>
              <div class="text-h6">Respostas</div>
              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label>Nome do paciente</q-item-label>
                  <q-item-label caption lines="2">{{
                    answer.patientName ? answer.patientName : 'Não informado'
                  }}</q-item-label>
                </q-item-section>

                <q-item-section>
                  <q-item-label>Data</q-item-label>
                  <q-item-label caption lines="2">{{
                    formatDate(answer.dateOfAdmission)
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
              </q-item>

              <q-list bordered separator class="q-mt-md">
                <q-item
                  clickable
                  v-ripple
                  v-for="question in answer.questions"
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
          </q-card>
        </q-dialog>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { Notify } from 'quasar';
import DateRangeInput from 'src/components/DateRangeInput.vue';
import ReportChart from 'src/components/ReportChart.vue';
import ReportManifestChart from 'src/components/ReportManifestChart.vue';
import { getAnswerById, reportByQuestion } from 'src/services/NPSService';
import { IAnswer } from 'src/types';
import { ref } from 'vue';
import moment from 'moment';
import 'moment/dist/locale/pt-br';

const show = ref(false);
const answer = ref({} as IAnswer);
const loadingAnswer = ref(false);

const startDate = ref(0);
const endDate = ref(0);
const answers = ref(
  [] as {
    title: string;
    observations: string[];
    detractors: number;
    neutrals: number;
    promoters: number;
  }[]
);
const loading = ref(false);
const itemManifest = ref(
  {} as {
    title: string;
    complaints: number;
    compliments: number;
    suggestions: number;
  }
);
const reviews = ref([] as { _id: string; answer: string }[]);

function formatDate(timestamp: number): string {
  moment.locale('pt-br');
  return moment(timestamp).format('DD/MM/YYYY');
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

async function showForm(id: string) {
  loadingAnswer.value = true;
  const { data, error } = await getAnswerById(id);
  loadingAnswer.value = false;

  if (error) {
    Notify.create({
      message: 'Erro ao carregar respostas',
      color: 'red',
    });
    return;
  }

  if (data) {
    answer.value = data;
    show.value = true;
  }
}

async function getReportByQuestion() {
  loading.value = true;
  const { data, error } = await reportByQuestion(
    startDate.value,
    endDate.value
  );
  loading.value = false;

  if (error) {
    Notify.create({
      message: 'Erro ao carregar relatório',
      color: 'red',
    });
    return;
  }

  answers.value = data.department;
  itemManifest.value = data.manifest;
  reviews.value = data.reviews;
}
</script>
