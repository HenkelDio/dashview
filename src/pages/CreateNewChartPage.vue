<template>
  <q-page class="q-pa-md q-pt-xl">
    <q-btn
      dense
      icon="chevron_left"
      flat
      class="q-mb-lg"
      @click="$router.back()"
      >Voltar</q-btn
    >
    <div class="text-h5 page-title">Criar novo gráfico</div>

    <q-card flat class="q-mt-xl">
      <q-card-section>
        <div class="text-h6 inter-bold q-mb-sm">Título do gráfico</div>
        <q-input
          v-model="chart.title"
          outlined
          label="Novo gráfico"
          :rules="[(val) => !!val || 'Campo obrigatório']"
        />
      </q-card-section>
    </q-card>

    <q-card flat class="q-mt-md">
      <q-card-section>
        <div class="text-h6 inter-bold q-mb-sm">Detalhes</div>
        <div class="flex column q-gutter-y-sm">
          <q-select
            outlined
            label="Perspectiva"
            v-model="chart.perspective"
            :options="perspectiveOptions"
            :loading="loadingPerspective"
            class="q-mb-md"
          >
            <template v-if="chart.perspective" v-slot:append>
              <q-icon
                name="cancel"
                @click.stop.prevent="chart.perspective = ''"
                class="cursor-pointer"
              />
            </template>
          </q-select>
          <q-select
            outlined
            label="Processo"
            v-model="chart.process"
            :options="processesOptions"
            :rules="[(val) => !!val || 'Campo obrigatório']"
          >
            <template v-if="chart.process" v-slot:append>
              <q-icon
                name="cancel"
                @click.stop.prevent="chart.process = ''"
                class="cursor-pointer"
              />
            </template>
          </q-select>
          <q-select
            outlined
            label="Setor"
            v-model="chart.department"
            :options="departmentsOptions"
            :loading="loadingDepartments"
            :rules="[(val) => !!val || 'Campo obrigatório']"
          >
            <template v-if="chart.department" v-slot:append>
              <q-icon
                name="cancel"
                @click.stop.prevent="chart.department = ''"
                class="cursor-pointer"
              />
            </template>
          </q-select>
          <q-select
            outlined
            label="Responsável"
            v-model="chart.responsible"
            use-input
            input-debounce="0"
            @new-value="addNewResponsible"
            @blur="handleBlur"
            :options="usersOptions"
            :rules="[(val) => !!val || 'Campo obrigatório']"
          >
            <template v-if="chart.responsible" v-slot:append>
              <q-icon
                name="cancel"
                @click.stop.prevent="chart.responsible = ''"
                class="cursor-pointer"
              />
            </template>
          </q-select>
          <q-select
            outlined
            label="Periodicidade"
            v-model="chart.periodicity"
            :options="periodicityOptions"
            :rules="[(val) => !!val || 'Campo obrigatório']"
          >
            <template v-if="chart.periodicity" v-slot:append>
              <q-icon
                name="cancel"
                @click.stop.prevent="chart.periodicity = ''"
                class="cursor-pointer"
              />
            </template>
          </q-select>
          <q-select
            outlined
            label="Ano"
            v-model="chart.year"
            :options="yearOptions"
            :rules="[(val) => !!val || 'Campo obrigatório']"
          >
            <template v-if="chart.year" v-slot:append>
              <q-icon
                name="cancel"
                @click.stop.prevent="chart.year = ''"
                class="cursor-pointer"
              />
            </template>
          </q-select>

          <q-select
            outlined
            label="Máscara"
            v-model="chart.mask"
            :options="maskOptions"
            class="q-mb-md"
            emit-value
          >
            <template v-if="chart.mask" v-slot:append>
              <q-icon
                name="cancel"
                @click.stop.prevent="chart.mask = ''"
                class="cursor-pointer"
              />
            </template>
          </q-select>

          <q-input
            v-model="chart.objective"
            outlined
            label="Objetivo"
            :rules="[(val) => !!val || 'Campo obrigatório']"
          />
          <q-input
            v-model="chart.formula"
            outlined
            label="Fórmula"
            :rules="[(val) => !!val || 'Campo obrigatório']"
          />
        </div>
      </q-card-section>
    </q-card>

    <q-card flat class="q-mt-md">
      <q-card-section>
        <div class="text-h6 inter-bold">Tipo de gráfico</div>
        <div class="flex row q-gutter-x-md">
          <div>
            <div class="q-gutter-sm q-mb-sm">
              <!-- <q-radio
            v-model="chart.type"
            checked-icon="task_alt"
            unchecked-icon="panorama_fish_eye"
            val="setor"
            label="Setores"
          >
          </q-radio> -->
              <q-radio
                v-model="chart.type"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                val="bar"
                label="Barra"
              />
            </div>
            <div
              style="
                background-color: #ededeb;
                width: 100px;
                border-radius: 8px;
              "
              class="flex justify-center"
            >
              <q-icon
                :name="chart.type === 'bar' ? 'equalizer' : 'pie_chart'"
                size="5rem"
                style="opacity: 0.8"
              />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card flat class="q-mt-md">
      <q-card-section>
        <div class="text-h6 inter-bold q-mb-sm">Legenda do gráfico</div>
        <div class="flex q-gutter-md q-pa-sm">
          <div v-for="(item, index) in chart.labels" :key="index">
            <div>
              <q-input
                v-model="chart.labels[index]"
                outlined
                label="Legenda"
                dense
                style="width: 110px"
              />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <div v-for="(dataset, datasetIndex) in chart.chartData" :key="datasetIndex">
      <q-card flat class="q-mt-md">
        <q-card-section>
          <div class="text-h6 inter-bold q-mb-sm">Dados do gráfico</div>
          <div class="flex q-gutter-x-md q-mb-md">
            <q-input
              v-model="chart.chartData[datasetIndex].label"
              outlined
              label="Rótulo principal"
              dense
            />

            <q-input
              outlined
              label="Cor das barras"
              v-model="chart.chartData[datasetIndex].backgroundColor"
              dense
            >
              <template v-slot:append>
                <div
                  :style="{
                    backgroundColor:
                      chart.chartData[datasetIndex].backgroundColor,
                    height: '20px',
                    width: '20px',
                    borderRadius: '5px',
                  }"
                ></div>
                <q-icon name="colorize" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-color
                      v-model="chart.chartData[datasetIndex].backgroundColor"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <div class="flex q-gutter-md">
            <div v-for="(item, index) in dataset.data" :key="index">
              <div>
                <q-input
                  v-model="chart.chartData[datasetIndex].data[index]"
                  outlined
                  label="Valor"
                  dense
                  style="width: 110px"
                />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <q-card flat class="q-mt-md">
      <q-card-section class="flex justify-center">
        <q-btn icon="add_circle" flat @click="addSection()">
          <q-tooltip> Adicionar mais uma seção de dados </q-tooltip>
        </q-btn>
      </q-card-section>
    </q-card>

    <div class="text-right">
      <q-btn
        color="primary"
        unelevated
        class="inter-medium q-mt-md"
        style="width: 200px"
        @click="id ? updateOneChart() : addChart()"
        :disable="!isFormValid"
        :loading="loading"
      >
        Salvar gráfico
      </q-btn>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { Notify } from 'quasar';
import {
  createChart,
  findChartById,
  updateChart,
} from 'src/services/ChartService';
import { getAllDepartments } from 'src/services/DepartmentService';
import {
  findAllPerspectives,
  findAllProcesses,
} from 'src/services/ModuleService';
import { listUsers } from 'src/services/UserService';
import { IChart, IDepartment, IPerspective, IProcess, User } from 'src/types';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();

const loading = ref(false);

const loadingPerspective = ref(false);
const perspectiveOptions = ref([] as string[]);

const loadingDepartments = ref(false);
const departmentsOptions = ref([] as string[]);

const loadingUsers = ref(false);
const usersOptions = ref([] as string[]);

const loadingProcesses = ref(false);
const processesOptions = ref([] as string[]);

const periodicityOptions = ref(['Mensal', 'Anual', 'Semestral', 'Trimestral']);

const yearOptions = ref(['2024', '2023', ' 2022', '2021']);

const maskOptions = ref([
  { value: 'CURRENCY', label: 'Moeda (R$)' },
  { value: 'PERCENTAGE', label: 'Porcentagem (%)' },
]);

const route = useRoute();

const id = ref(route.query.id);

const chart = ref({
  title: '',
  type: 'bar',
  perspective: '',
  process: '',
  department: '',
  responsible: '',
  periodicity: '',
  objective: '',
  formula: '',
  year: '2024',
  mask: '',
  labels: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ],
  chartData: [
    {
      label: 'Dados',
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      backgroundColor: '#422878',
    },
  ],
});

function addSection() {
  chart.value.chartData.push({
    label: 'Dados',
    data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    backgroundColor: '#422878',
  });
}

async function getAllPerspectives() {
  loadingPerspective.value = true;
  const {
    data,
    error,
  }: { data: IPerspective[] | null; error: unknown | null } =
    await findAllPerspectives('ACTIVE');
  loadingPerspective.value = false;

  if (error) {
    Notify.create({
      message: 'Erro ao carregar perspectivas',
      color: 'red',
    });
  }

  if (data) {
    perspectiveOptions.value = data.map((item) => item.name);
  }
}

async function getDepartments() {
  loadingDepartments.value = true;
  const { data, error }: { data: IDepartment[] | null; error: unknown } =
    await getAllDepartments('ACTIVE');
  loadingDepartments.value = false;

  if (error) {
    Notify.create({
      caption: 'Erro ao carregar departamentos',
      group: true,
      color: 'red',
    });
    return;
  }

  if (data) {
    departmentsOptions.value = data.map((item) => item.label);
  }
}

async function listAllUsers() {
  loadingUsers.value = true;
  const { data, error }: { data: User[] | null; error: unknown } =
    await listUsers('ACTIVE');
  loadingUsers.value = false;

  if (error) {
    Notify.create({
      caption: 'Erro ao carregar usuários',
      group: true,
      color: 'red',
    });
    return;
  }

  if (data) {
    usersOptions.value = data.map((item) => item.name);
  }
}

const addNewResponsible = (newValue: string) => {
  if (newValue && !usersOptions.value.includes(newValue)) {
    usersOptions.value.push(newValue);
  }
};

const handleBlur = () => {
  const newValue = chart.value.responsible;
  if (newValue && !usersOptions.value.includes(newValue)) {
    usersOptions.value.push(newValue);
  }
};

async function getAllProcesses() {
  loadingProcesses.value = true;
  const { data, error }: { data: IProcess[] | null; error: unknown } =
    await findAllProcesses('ACTIVE');
  loadingProcesses.value = false;

  if (error) {
    Notify.create({
      message: 'Erro ao carregar processos',
      color: 'red',
    });
  }

  if (data) {
    processesOptions.value = data.map((item) => item.name);
  }
}

async function updateOneChart() {
  loading.value = true;
  const { error } = await updateChart(chart.value);
  loading.value = false;

  if (error) {
    Notify.create({
      message: 'Erro ao atualizar gráfico',
      color: 'red',
    });
    return;
  }

  Notify.create({
    message: 'Gráfico atualizado com sucesso!',
    color: 'green',
  });

  router.push({ path: '/list-charts' });
}

async function addChart() {
  loading.value = true;

  chart.value = {
    ...chart.value,
    ...(chart.value.mask === '' ? {} : { mask: chart.value.mask }),
  };

  chart.value = {
    ...chart.value,
    ...(chart.value.perspective === ''
      ? {}
      : { mask: chart.value.perspective }),
  };

  const { error } = await createChart(chart.value);
  loading.value = false;

  if (error) {
    Notify.create({
      message: 'Erro ao criar gráfico',
      color: 'red',
    });
    return;
  }

  Notify.create({
    message: 'Gráfico criado com sucesso!',
    color: 'green',
  });

  router.push({ path: '/list-charts' });
}

async function getById() {
  const { data, error }: { data: IChart | null; error: unknown } =
    await findChartById(id.value?.toString());

  if (error) {
    Notify.create({
      message: 'Erro ao buscar gráfico',
      color: 'red',
    });
    return;
  }

  if (data) {
    chart.value = data;
  }
}

const isFormValid = computed(() => {
  return (
    chart.value.title &&
    chart.value.process &&
    chart.value.department &&
    chart.value.responsible &&
    chart.value.periodicity &&
    chart.value.objective &&
    chart.value.formula
  );
});

onMounted(() => {
  if (id.value) {
    getById();
  }

  getAllPerspectives();
  getDepartments();
  listAllUsers();
  getAllProcesses();
});
</script>
