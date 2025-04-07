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
      <div v-for="(item, index) in answers" :key="index">
        <ReportChart :details="item" />
      </div>
      <div>
        <ReportManifestChart :details="itemManifest" />
      </div>
      <div>
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
                class="rounded-borders"
                v-for="item in reviews"
                :key="item"
              >
                <q-item>{{ item }}</q-item>
              </q-list>
            </q-expansion-item>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { Notify } from 'quasar';
import DateRangeInput from 'src/components/DateRangeInput.vue';
import ReportChart from 'src/components/ReportChart.vue';
import ReportManifestChart from 'src/components/ReportManifestChart.vue';
import { reportByQuestion } from 'src/services/NPSService';
import { ref } from 'vue';

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
const reviews = ref([]);

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
