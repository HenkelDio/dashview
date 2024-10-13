<template>
<q-dialog v-model="show" persistent>
  <q-card :style="{width: isMobile ? '100%' : '500px'}">
    <q-card-section>
      <div class="text-h6">Filtros</div>
    </q-card-section>
    <q-card-section>

      <div>
        <q-select
          v-model="yearModel"
          :options="yearOptions"
          label="Ano"
        />
      </div>

      <div>
        <q-select
          v-model="perspectiveModel"
          :options="perspetiveOptions"
          label="Perspectiva"
        />
      </div>

      <div>
        <q-select
          v-model="proccessModel"
          :options="processesOptions"
         label="Processo"
        />
      </div>

      <div>
        <q-select
          v-model="departamentModel"
          :options="departamentOptions"
         label="Setor"
        />
      </div>

      <div>
        <q-select
          v-model="responsibleModel"
          :options="responsibleOptions"
         label="Responsável"
        />
      </div>

      <div class="q-mt-md">
        <q-btn v-if="showClearFiltersButton" flat @click="clearFilters()">Limpar filtros</q-btn>
      </div>

    </q-card-section>

    <q-card-actions horizontal align="right">
      <q-btn class="bg-primary text-white" @click="saveFilter()">Salvar</q-btn>
      <q-btn flat @click="$emit('close')">Fechar</q-btn>
    </q-card-actions>
  </q-card>
</q-dialog>
</template>

<script setup lang="ts">
import { useFilterStore } from 'src/stores/filters';
import { computed, onMounted, ref } from 'vue';
import { Notify, useQuasar } from 'quasar';
import { useUserStore } from 'src/stores/userStore';
import { IPerspective, IProcess, User } from 'src/types';
import { findAllPerspectives, findAllProcesses } from 'src/services/ModuleService';
import { listUsers } from 'src/services/UserService';

const emit = defineEmits(['close']);
const show = ref(true);

const $q = useQuasar()

const isMobile = computed(() => $q.platform.is.mobile)

const store = useFilterStore()
const userStore = useUserStore();

const yearModel = ref(store.yearModel ? store.yearModel : '2024');
const yearOptions = ref(['2024', '2023'])

const loadingPerspective = ref(false);
const perspectiveModel = ref(store.perspectiveModel);
const perspetiveOptions = ref([] as string[])

const loadingProcesses = ref(false);
const proccessModel = ref(store.processModel);
const processesOptions = ref([] as string[]);

const departments = userStore.$state.user.departments.map(item => item.label);
const departamentModel = ref(store.departmentModel);
const departamentOptions = ref(departments)

const loadingUsers = ref(false);
const responsibleModel = ref(store.responsibleModel);
const responsibleOptions = ref([] as string[]);




function saveFilter() {
  store.setPerspectiveModel(perspectiveModel.value);
  store.setProcessModel(proccessModel.value)
  store.setDepartmentModel(departamentModel.value)
  store.setResponsibleModel(responsibleModel.value)
  store.setYearModel(yearModel.value);
  emit('close')
}

function clearFilters() {
  store.setPerspectiveModel('');
  store.setProcessModel('')
  store.setDepartmentModel('')
  store.setResponsibleModel('')
  proccessModel.value = '';
  departamentModel.value = '',
  responsibleModel.value = ''
  perspectiveModel.value = ''
}

const showClearFiltersButton = computed(() => {
  return perspectiveModel.value || proccessModel.value || departamentModel.value || responsibleModel.value
})

async function getAllPerspectives() {
  loadingPerspective.value = true;
  const { data, error }: {data: IPerspective[] | null, error: unknown | null} = await findAllPerspectives('ACTIVE');
  loadingPerspective.value = false;

  if(error) {
    Notify.create({
      message: 'Erro ao carregar perspectivas',
      color: 'red'
    })
  }

  if(data) {
    perspetiveOptions.value = data.map(item => item.name);
  }
}

async function getAllProcesses() {
  loadingProcesses.value = true;
  const { data, error }: {data: IProcess[] | null, error: unknown} = await findAllProcesses('ACTIVE');
  loadingProcesses.value = false;

  if(error) {
    Notify.create({
      message: 'Erro ao carregar processos',
      color: 'red'
    })
  }

  if(data) {
    processesOptions.value = data.map(item => item.name);
  }
}

async function listAllUsers() {
  loadingUsers.value = true;
  const { data, error }: {data: User[] | null, error: unknown} = await listUsers('ACTIVE');
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
    responsibleOptions.value = data.map(item => item.name);
  }
}

onMounted(() => {
  getAllPerspectives();
  getAllProcesses();
  listAllUsers();
})

</script>
