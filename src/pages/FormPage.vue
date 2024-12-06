<template>
  <q-layout view="lHh Lpr lFf" class="inter">
    <q-page-container>
      <q-page class="form-page">
        <div>
          <q-header style="background-color: #1b1e3f" reveal>
            <q-img src="../assets/logo-light.png" width="150px"></q-img>
          </q-header>

          <div class="text-h5 q-mt-xl">
            Pesquisa de satisfação | Clínica Los Angeles
          </div>

          <q-separator class="q-mt-md" />

          <div v-for="(question, index) in form.questions" :key="index">
            <div class="q-mt-xl q-gutter-y-md">
              <SelectInputForm
                :title="question.title"
                :options="question.options"
                @updateAnswer="updateAnswer(index, $event)"
              />
            </div>
          </div>

          <q-btn
            color="primary"
            class="text-weight-bold q-my-lg"
            style="width: 100%; height: 40px"
            @click="submitAnswers"
            :disable="!isValid"
          >
            ENVIAR
          </q-btn>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import { Notify } from 'quasar';
import SelectInputForm from 'src/components/form/SelectInputForm.vue';
import { getForm } from 'src/services/NPSService';
import { IForm, IQuestion } from 'src/types';
import { computed, onMounted, ref } from 'vue';

const form = ref({} as IForm);

const answers = ref();

async function loadForm() {
  const { data, error } = await getForm();

  if (error) {
    Notify.create({
      message: 'Erro ao carregar formulário',
      color: 'red',
    });
    return;
  }

  form.value = data;
  answers.value = form.value.questions.map((question) => ({
    title: question.title,
    answer: '',
    observation: '',
  }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function updateAnswer(index: number, { answer, observation }: any) {
  answers.value[index].answer = answer;
  answers.value[index].observation = observation;
}

const isValid = computed(() => {
  return answers.value.every((item: IQuestion) => item.answer.trim() !== '');
});

async function submitAnswers() {
  if (!isValid.value) {
    return;
  }

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
</style>
