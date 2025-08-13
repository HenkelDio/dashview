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
            <div class="text-h5 q-mt-xl" v-if="type === 'prospecting'">
              Pesquisa de Expectativas e Necessidades / Hospital Clínica Los
              Angeles
            </div>

            <div class="text-h5 q-mt-xl" v-else>
              Pesquisa de satisfação | Hospital Clínica Los Angeles
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
                  :required="question.required"
                />

                <SelectInputForm
                  v-if="question.inputType === 'select'"
                  :title="question.title"
                  :options="question.options"
                  @updateAnswer="updateAnswer(index, $event)"
                  :showObservation="question.showObservation"
                  :disabled="loadingSubmit"
                  :required="question.required"
                />

                <TextInputForm
                  v-if="question.inputType === 'text'"
                  :title="question.title"
                  :options="question.options"
                  @updateAnswer="updateAnswer(index, $event)"
                  :disabled="loadingSubmit"
                  :required="question.required"
                />

                <DateInputForm
                  v-if="question.inputType === 'date'"
                  :title="question.title"
                  :options="question.options"
                  @updateAnswer="updateAnswer(index, $event)"
                  :disabled="loadingSubmit"
                  :required="question.required"
                />
              </div>
            </div>

            <PatientInputForm
              v-if="feedbackRequest && answerType === 'Reclamação'"
              title="Gostaria de um retorno de nossa equipe para esclarecimentos sobre seus relatos?"
              @setPatientName="patientName = $event"
              @setPatientPhone="patientPhone = $event"
              @patientEmail="patientEmail = $event"
              @patientFeedbackReturn="patientFeedbackReturn = $event"
              @fieldError="fieldError = $event"
              @feedbackType="feedbackType = $event"
              :disabled="loadingSubmit"
            />

            <EmployeeInputForm
              v-if="employeeName"
              @employeeName="nameEmployee = $event"
              :disabled="loadingSubmit"
            />

            <q-btn
              color="primary"
              class="text-weight-bold q-my-lg"
              style="width: 100%; height: 40px"
              @click="handleSubmit"
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
import {
  getForm,
  saveAnswer,
  saveGeneralAnswer,
  saveRhAnswer,
} from 'src/services/NPSService';
import { IForm, IQuestion } from 'src/types';
import { computed, onMounted, ref } from 'vue';
import { Vue3Lottie } from 'vue3-lottie';
import congratulations from '../assets/congratulations.json';
import { useRoute } from 'vue-router';
import EmployeeInputForm from 'src/components/form/EmployeeInputForm.vue';
import SelectInputForm from 'src/components/form/SelectInputForm.vue';

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
const employeeName = ref(false);
const nameEmployee = ref('');
const feedbackType = ref();

const route = useRoute();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const token = ref(route.query.token);
const type = ref(route.query.type);

useMeta(() => ({
  title: 'Formulário | Clínica Los Angeles',
}));

async function loadForm() {
  loading.value = true;
  const { data, error } = await getForm(type.value?.toString());
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
  employeeName.value = form.value.parameters.employeeName;

  answers.value = form.value.questions.map((question) => ({
    index: question.index,
    title: question.title,
    answer: '',
    observation: '',
    required: question.required,
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

const isValid = computed(() => {
  if (!answers.value) return false;

  const filteredAnswers = answers.value.filter(
    (item: IQuestion) => item.required
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

async function submitRhAnswers() {
  loadingSubmit.value = true;
  const payload = {
    employeeName: nameEmployee.value ? nameEmployee.value : null,
    description: answers.value.filter(
      (item: { index: string }) => item.index === '17'
    )[0].answer,
    type: getAnswerType(),
  };

  const { error } = await saveRhAnswer(payload);
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

function getUserInfo() {
  if (type.value === 'notification' && nameEmployee.value) {
    return {
      name: nameEmployee.value,
    };
  }

  if (patientName.value || patientEmail.value || patientPhone.value) {
    return {
      name: patientName.value,
      email: patientEmail.value,
      phone: patientPhone.value,
    };
  }

  return null;
}

async function handleSubmit() {
  if (!isValid.value) {
    return;
  }

  if (type.value === 'employeeChannel') {
    await submitRhAnswers();
    return;
  }

  if (type.value === 'notification' || type.value === 'prospecting') {
    await submitGeneralAnswers();
    return;
  }

  await submitAnswers();
}

async function submitGeneralAnswers() {
  loadingSubmit.value = true;
  const payload = {
    type: type.value,
    feedbackType: feedbackType.value,
    answers: answers.value.map((answer: IQuestion) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { required, ...rest } = answer;

      if (!rest.observation || rest.observation.trim() === '') {
        delete rest.observation;
      }

      return rest;
    }),

    userInfo: getUserInfo(),
  };

  const { error } = await saveGeneralAnswer(payload);
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

const answerType = computed(() => {
  const type = answers.value.filter(
    (item: { index: string }) => item.index === '16'
  )[0].answer;
  return type;
});

function getAnswerType() {
  const type = answers.value.filter(
    (item: { index: string }) => item.index === '16'
  )[0].answer;

  if (type === 'Elogio') {
    return {
      value: 'compliment',
      label: 'Elogio',
    };
  }

  if (type === 'Sugestão') {
    return {
      value: 'suggestion',
      label: 'Sugestão',
    };
  }

  if (type === 'Reclamação') {
    return {
      value: 'complaint',
      label: 'Reclamação',
    };
  }

  if (type === 'Denúncia') {
    return {
      value: 'denunciation',
      label: 'Denúncia',
    };
  }
}

async function submitAnswers() {
  if (!isValid.value) {
    return;
  }

  loadingSubmit.value = true;

  const payload = {
    origin: type.value,
    answers: answers.value,
    feedbackType: feedbackType.value ? feedbackType.value.value : null,
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
