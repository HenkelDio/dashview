<template>
  <q-layout view="lHh Lpr lFf" class="inter">
    <q-page-container>
      <q-page class="form-page">
        <div>
          <q-header style="background-color: #1b1e3f" reveal>
            <q-img src="../assets/logo-light.png" width="150px"></q-img>
          </q-header>

          <div v-if="submitted">
            <Vue3Lottie
              :animationData="congratulations"
              :height="200"
              :width="200"
            />
            <div class="text-h5 text-weight-bold">
              Muito obrigado pelo seu feedback!
            </div>
            <div class="text-subtitle2">
              Acesse:
              <a
                href="https://clinicalosangeles.com.br"
                style="color: #1b1e3f; font-weight: 600"
                >https://clinicalosangeles.com.br</a
              >
            </div>
          </div>

          <div v-if="!submitted">
            <div class="text-h5 q-mt-xl">
              Pesquisa de satisfação | Clínica Los Angeles
            </div>

            <q-separator class="q-mt-md" />

            <q-inner-loading
              :showing="loading"
              style="height: 100px; margin-bottom: 50px"
              color="primary"
            />

            <div v-for="(question, index) in form.questions" :key="index">
              <div class="q-mt-xl q-gutter-y-md">
                <RadioInputForm
                  v-if="question.inputType === 'radio'"
                  :title="question.title"
                  :index="question.index"
                  :options="question.options"
                  :showObservation="question.showObservation"
                  @updateAnswer="updateAnswer(index, $event)"
                  :disabled="loadingSubmit"
                />

                <TextInputForm
                  v-if="question.inputType === 'text'"
                  :title="question.title"
                  :options="question.options"
                  @updateAnswer="updateAnswer(index, $event)"
                  :disabled="loadingSubmit"
                />

                <DateInputForm
                  v-if="question.inputType === 'date'"
                  :title="question.title"
                  :options="question.options"
                  @updateAnswer="updateAnswer(index, $event)"
                  :disabled="loadingSubmit"
                />
              </div>
            </div>

            <PatientInputForm
              class="q-mt-xl"
              v-if="feedbackRequest"
              title="Gostaria de um retorno de nossa equipe para esclarecimentos sobre seus relatos?"
              @setPatientName="patientName = $event"
              @setPatientPhone="patientPhone = $event"
              @patientEmail="patientEmail = $event"
              @patientFeedbackReturn="patientFeedbackReturn = $event"
              @fieldError="fieldError = $event"
              :disabled="loadingSubmit"
            />

            <q-btn
              color="primary"
              class="text-weight-bold q-my-lg"
              style="width: 100%; height: 40px"
              @click="submitAnswers"
              :loading="loadingSubmit"
              :disable="!isValid"
            >
              ENVIAR
            </q-btn>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import { Notify, useMeta } from 'quasar';
import DateInputForm from 'src/components/form/DateInputForm.vue';
import PatientInputForm from 'src/components/form/PatientInputForm.vue';
import RadioInputForm from 'src/components/form/RadioInputForm.vue';
import TextInputForm from 'src/components/form/TextInputForm.vue';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getForm, saveAnswer } from 'src/services/NPSService';
import { IForm, IQuestion } from 'src/types';
import { computed, onMounted, ref } from 'vue';
import { Vue3Lottie } from 'vue3-lottie';
import congratulations from '../assets/congratulations.json';
import { useRoute } from 'vue-router';

const form = ref({} as IForm);
const loading = ref(false);
const loadingSubmit = ref(false);
const submitted = ref(false);
const feedbackRequest = ref(false);
const patientFeedbackReturn = ref(false);
const answers = ref();
const patientName = ref('');
const patientPhone = ref('');
const patientEmail = ref('');
const fieldError = ref(false);

const route = useRoute();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const token = ref(route.query.token);

useMeta(() => ({
  title: 'Formulário | Clínica Los Angeles',
}));

async function loadForm() {
  loading.value = true;
  const { data, error } = await getForm();
  loading.value = false;

  if (error) {
    Notify.create({
      message: 'Erro ao carregar formulário',
      color: 'red',
    });
    return;
  }

  form.value = data;
  feedbackRequest.value = form.value.parameters.feedbackRequest;

  answers.value = form.value.questions.map((question) => ({
    index: question.index,
    title: question.title,
    answer: '',
    observation: '',
  }));
}

function updateAnswer(
  index: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { answer, observation }: any
) {
  answers.value[index].answer = answer;
  answers.value[index].observation = observation;
}

// const isValid = computed(() => {
//   if (!answers.value) return false;

//   const filteredAnswers = answers.value.filter(
//     (item: IQuestion) => item.title !== 'Gostaria de um retorno?'
//   );

//   const allAnswersFilled = filteredAnswers.every((item: IQuestion) =>
//     Boolean(item.answer?.trim())
//   );

//   if (patientFeedbackReturn.value) {
//     return Boolean(
//       patientEmail.value &&
//         patientName.value &&
//         patientPhone.value &&
//         !fieldError.value &&
//         allAnswersFilled
//     );
//   }

//   return allAnswersFilled;
// });

const isValid = computed(() => {
  if (!answers.value) return false;

  const filteredAnswers = answers.value.filter((item: IQuestion) =>
    ['13', '12', '15', '16'].includes(item.index)
  );

  const allAnswersFilled = filteredAnswers.every((item: IQuestion) =>
    Boolean(item.answer?.trim())
  );

  if (patientFeedbackReturn.value) {
    return Boolean(
      patientEmail.value &&
        patientName.value &&
        patientPhone.value &&
        !fieldError.value &&
        allAnswersFilled
    );
  }

  return allAnswersFilled;
});

async function submitAnswers() {
  if (!isValid.value) {
    return;
  }

  loadingSubmit.value = true;

  const payload = {
    answers: answers.value,
    patientInfo: {
      patientName: patientName.value,
      patientPhone: patientPhone.value.replace(/\D/g, ''),
      patientEmail: patientEmail.value,
      patientFeedbackReturn: patientFeedbackReturn.value,
    },
  };

  const { error } = await saveAnswer(payload, token.value?.toString());
  loadingSubmit.value = false;

  console.log('error', error);

  if (error) {
    Notify.create({
      message: 'Erro ao enviar respostas.',
      color: 'red',
    });
    return;
  }

  submitted.value = true;
  Notify.create({
    message: 'Respostas enviadas com sucesso!',
    color: 'green',
  });
}

onMounted(() => {
  loadForm();
});
</script>

<style lang="scss">
.form-page {
  width: 600px;
  text-align: center;
  margin: 0 auto;
}

@media (max-width: 700px) {
  .form-page {
    width: 100%;
    padding: 10px;
  }
}
</style>
