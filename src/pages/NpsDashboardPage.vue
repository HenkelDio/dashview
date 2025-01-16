<template>
  <q-page class="q-pa-md q-pt-md">
    <div class="flex justify-between items-top q-mt-md">
      <div>
        <div class="text-h5 page-title" style="margin-bottom: 10px">
          Dashboard
        </div>
        <div class="absolute">
          {{ departmentModel.label }} | {{ dateLabel }}
        </div>
      </div>
      <div class="row q-gutter-x-sm">
        <div class="flex q-gutter-x-md">
          <q-btn
            dense
            label="Filtros"
            flat
            @click="showFilterDialog = true"
            class="inter-medium q-px-md"
            size="1rem"
          />
        </div>

        <!-- <q-select
          v-model="typeModel"
          :options="typeOptions"
          label="Tipo"
          dense
          outlined
          bg-color="white"
          style="width: 200px"
        /> -->
      </div>
    </div>

    <div style="margin-bottom: 10px; margin-top: 50px">
      <div class="flex q-gutter-x-md q-mb-md">
        <q-skeleton height="110px" width="260px" square v-if="loadingAnswers" />

        <q-card flat v-if="!loadingAnswers">
          <q-card-section>
            <div class="flex justify-between">
              <div class="flex column">
                <div class="inter text-grey-8" style="font-size: 0.8rem">
                  TOTAL DE PESQUISAS RESPONDIDAS
                </div>
                <div class="flex row q-mt-sm items-center q-gutter-x-md">
                  <div class="bg-blue-1" style="border-radius: 8px">
                    <q-icon
                      name="signal_cellular_alt"
                      color="primary"
                      size="3rem"
                    />
                  </div>
                  <div
                    class="inter-bold text-h6 text-grey-9"
                    style="margin-bottom: 2px"
                  >
                    {{ answersCount.total }}
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-skeleton height="110px" width="530px" square v-if="loadingAnswers" />
        <q-card flat v-if="!loadingAnswers">
          <q-card-section>
            <div class="flex justify-between">
              <div class="flex column">
                <div class="row justify-between">
                  <div class="inter text-grey-8" style="font-size: 0.8rem">
                    TOTAL DE PERGUNTAS RESPONDIDAS POR NOTA
                  </div>
                  <div
                    class="inter text-caption cursor-pointer"
                    @click="$router.push({ path: '/general-view' })"
                  >
                    ver mais
                    <q-tooltip> Ir para detalhes de respostas </q-tooltip>
                  </div>
                </div>

                <div class="flex justify-between q-mt-sm q-gutter-x-md">
                  <div class="flex row items-center q-gutter-x-md">
                    <div class="bg-red-1" style="border-radius: 8px">
                      <q-icon
                        name="sentiment_dissatisfied"
                        color="red"
                        size="3rem"
                      />
                    </div>
                    <div class="text-grey-9">
                      <div class="inter-bold text-h6">
                        {{ answersCount.detractors }}
                      </div>
                      <div class="inter text-caption">DETRATORES</div>
                    </div>
                  </div>

                  <div class="flex row items-center q-gutter-x-md">
                    <div class="bg-grey-3" style="border-radius: 8px">
                      <q-icon
                        name="sentiment_neutral"
                        color="grey"
                        size="3rem"
                      />
                    </div>
                    <div class="text-grey-9">
                      <div class="inter-bold text-h6">
                        {{ answersCount.neutrals }}
                      </div>
                      <div class="inter text-caption">NEUTROS</div>
                    </div>
                  </div>

                  <div class="flex row items-center q-gutter-x-md">
                    <div class="bg-green-1" style="border-radius: 8px">
                      <q-icon
                        name="sentiment_satisfied"
                        color="green"
                        size="3rem"
                      />
                    </div>
                    <div class="text-grey-9">
                      <div class="inter-bold text-h6">
                        {{ answersCount.promoters }}
                      </div>
                      <div class="inter text-caption">PROMOTORES</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <AdminCharts
        :scoreDepartments="scoreDepartments"
        :loading="loadingScore"
        :answersCount="{
          promoters: answersCount.promoters,
          detractors: answersCount.detractors,
          neutrals: answersCount.neutrals,
        }"
        :departmentId="departmentModel.id"
      />
    </div>

    <q-dialog v-model="showFilterDialog" persistent>
      <q-card style="width: 500px">
        <q-card-section>
          <div class="text-h6">Filtros</div>
          <div class="q-mt-md q-gutter-y-md">
            <DateRangeInput
              @from="startDate = $event"
              @to="endDate = $event"
              :currentDate="true"
            />
            <q-select
              v-model="departmentModel"
              outlined
              dense
              label="Filtrar por departamento"
              :options="departmentOptions"
            >
              <template v-if="departmentModel.label" v-slot:append>
                <q-icon
                  name="cancel"
                  @click.stop.prevent="
                    departmentModel = { label: '' } as IDepartment
                  "
                  class="cursor-pointer"
                /> </template
            ></q-select>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            label="Fechar"
            flat
            unelevated
            @click="showFilterDialog = false"
          ></q-btn>
          <q-btn
            label="BUSCAR"
            color="primary"
            unelevated
            icon-right="search"
            @click="
              getAnswersCount(),
                (showFilterDialog = false),
                getScoreDepartments()
            "
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { Notify } from 'quasar';
import AdminCharts from 'src/components/AdminCharts/AdminCharts.vue';
import DateRangeInput from 'src/components/DateRangeInput.vue';
import { getAllDepartments } from 'src/services/DepartmentService';
import { countAnswers, loadScoreDepartments } from 'src/services/NPSService';
import { countUsers } from 'src/services/UserService';
import { IDepartment, IScoreDepartment } from 'src/types';
import { computed, onMounted, ref, watch } from 'vue';
import moment from 'moment';
import 'moment/dist/locale/pt-br';

const usersQuantity = ref('0');
// const typeModel = ref('Por nota');

// const typeOptions = ref(['Por nota', 'Por retornos']);
const loadingScore = ref(false);
const loadingAnswers = ref(false);
const showFilterDialog = ref(false);
const departmentModel = ref({ label: '' } as IDepartment);
const departmentOptions = ref([]);
const loadingDepartament = ref(false);
const answersCount = ref(
  {} as {
    total: number;
    detractors: number;
    neutrals: number;
    promoters: number;
  }
);

const scoreDepartments = ref({} as IScoreDepartment);

const startDate = ref(0);
const endDate = ref(0);

function formatDate(timestamp: number): string {
  moment.locale('pt-br');
  return moment(timestamp).format('DD/MM/YYYY');
}

async function getUsersQuantity() {
  const { data, error } = await countUsers();

  if (error) {
    console.log(error);
  }

  usersQuantity.value = data.toString();
}

async function getAnswersCount() {
  loadingAnswers.value = true;
  const { data } = await countAnswers(
    startDate.value,
    endDate.value,
    departmentModel.value.id
  );
  loadingAnswers.value = false;

  if (data) {
    answersCount.value = data;
  }
}

async function getScoreDepartments() {
  loadingScore.value = true;
  const { data } = await loadScoreDepartments(startDate.value, endDate.value);
  loadingScore.value = false;

  if (data) {
    scoreDepartments.value = data;
  }
}

async function getDepartments() {
  loadingDepartament.value = true;
  const { data, error } = await getAllDepartments('ACTIVE');
  loadingDepartament.value = false;

  if (error) {
    Notify.create({
      message: 'Erro ao carregar departamentos',
      color: 'red',
    });
    return;
  }

  if (data) {
    departmentOptions.value = data;
  }
}

function setCurrentDate() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  startDate.value = yesterday.getTime();
  endDate.value = new Date().getTime();
}

const dateLabel = computed(() => {
  if (startDate.value > 0 && endDate.value > 0) {
    return `${formatDate(startDate.value)} até ${formatDate(endDate.value)}`;
  }
  return '';
});

watch(showFilterDialog, () => {
  if (showFilterDialog.value) {
    getDepartments();
  }
});

onMounted(() => {
  setCurrentDate();
  getUsersQuantity();
  getAnswersCount();
  getScoreDepartments();
});
</script>
