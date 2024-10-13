<template>
  <q-page class="q-pa-md q-pt-xl">
    <div class="text-h5 page-title">Processos</div>

    <q-card flat class="q-mt-xl">
      <q-card-section>
        <div class="flex justify-between">
          <div class="flex q-gutter-md">
            <q-btn-toggle
              v-model="processStatus"
              color="grey-4"
              toggle-color="grey-5"
              no-caps
              toggle-text-color="grey-10"
              unelevated
              text-color="grey-9"
              class="inter-bold"
              emit-value
              :options="[
                { label: 'Ativos', value: 'ACTIVE' },
                { label: 'Inativos', value: 'INACTIVE' },
              ]"
            />
            <q-input
              v-model="searchParam"
              outlined
              dense
              placeholder="Buscar pelo nome"
            />
          </div>

          <q-btn
            no-caps
            label="Adicionar processo"
            color="primary"
            class="inter-bold"
            size="1rem"
            unelevated
            @click="processId = '', showDialog = true"
          />
        </div>
      </q-card-section>

      <q-card-section>
        <q-table
          flat
          :rows="filteredRows"
          :columns="columns"
          row-key="name"
          table-header-class="inter-bold text-dark"
          rows-per-page-label="Resultados por página"
          loading-label="Carregando..."
          :loading="loading"
          no-data-label="Sem dados disponíveis"
        >
        <template v-slot:body-cell-createdBy="props">
            <div class="flex items-center q-py-sm q-pl-xl">
              <q-avatar
                style="cursor: default;"
                size="32px"
                class="q-mr-sm text-white"
                :color="props.row.status === 'ACTIVE' ? 'primary' : 'dark'"
                >{{ props.row.createdBy.charAt(0) }}
                <q-tooltip>
                  {{props.row.createdBy}}
                </q-tooltip>
                </q-avatar
              >
            </div>
            <q-separator />
          </template>
          <template v-slot:body-cell-actions="props">
            <div>
              <q-btn
                v-if="props.row.status === 'ACTIVE'"
                flat
                round
                dense
                icon="edit"
                color="primary"
                @click="showDialogEdit(props.row.id)"
              />
              <q-btn
                flat
                round
                dense
                :icon="
                  props.row.status === 'ACTIVE'
                    ? 'delete'
                    : 'published_with_changes'
                "
                :color="props.row.status === 'ACTIVE' ? 'negative' : 'primary'"
                @click="handleShowDialog(props.row.status, props.row.id)"
              />
            </div>

            <GenericDialog
              v-if="showDisableDialog"
              @close="() => showDisableDialog = false"
              @confirm="changeStatusProcess(props.row.id, props.row.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')"
              title="Desativar processo?"
              description=""
              confirm-label-button="Desativar"
              color-label-button="red"
              :loading="loadingDisablePerspective"
            />
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <ProcessDialog
      v-if="showDialog"
      @close="showDialog = false, getAllProcesses()"
      :id="processId"
    />
  </q-page>
</template>

<script lang="ts" setup>
import { Notify } from 'quasar';
import { changeStatus, findAllProcesses } from 'src/services/ModuleService';
import { Column, IProcess, STATUS } from 'src/types';
import { onMounted, ref, watch } from 'vue';
import moment from 'moment';
import 'moment/dist/locale/pt-br'
import GenericDialog from 'src/components/Dialogs/GenericDialog.vue';
import ProcessDialog from 'src/components/Dialogs/ProcessDialog.vue';

interface IProcessTable {
  id: string,
  name: string,
  createdBy: string
  createdOn: string,
  status: STATUS
}

const loading = ref(false);
const rows = ref([] as IProcessTable[]);
const showDisableDialog = ref(false);
const searchParam = ref('');
const filteredRows = ref([] as IProcessTable[]);
const processStatus = ref('ACTIVE');
const showDialog = ref(false);
const loadingDisablePerspective = ref(false);
const processId = ref('');

const columns = ref<Column[]>([
  {
    name: 'name',
    required: true,
    field: 'name',
    label: 'PROCESSO',
    sortable: false,
    align: 'left',
  },
  {
    name: 'createdBy',
    field: 'createdBy',
    label: 'CRIADO POR',
    sortable: false,
    align: 'left',
  },
  {
    name: 'createdOn',
    label: 'CRIADO EM',
    field: 'createdOn',
    sortable: true,
    align: 'left',
  },
  { name: 'actions', align: 'center', field: 'actions', label: '' },
]);

async function getAllProcesses() {
  loading.value = true;
  const { data, error } = await findAllProcesses(processStatus.value);
  loading.value = false;

  if(error) {
    Notify.create({
      message: 'Erro ao carregar processos',
      color: 'red'
    })
  }

  if(data) {
    const currentRows: IProcessTable[] = data.map((process: IProcess) => {
      return {
        id: process.id,
        name: process.name,
        createdBy: process.createdBy.name,
        createdOn: formatDate(process.createdOn),
        status: process.status,
      };
    });

    rows.value = currentRows;
    filteredRows.value = currentRows;
  }
}

function formatDate(timestamp: number): string {
    moment.locale('pt-br');
    return moment(timestamp).fromNow();
}

async function changeStatusProcess(id: string, status: string) {
  loadingDisablePerspective.value = true;
  const { error } = await changeStatus(id, status, 'process');
  loadingDisablePerspective.value = false;

  if(error) {
    Notify.create({
      message: 'Erro ao desativar perspectivas',
      color: 'red'
    })
    return;
  }
  showDisableDialog.value = false;
  getAllProcesses();
}

function handleShowDialog(status: string, id: string,) {
  if(status === 'ACTIVE') {
    showDisableDialog.value = true
  } else {
    changeStatusProcess(id, 'ACTIVE');
  }
}

function showDialogEdit(id: string) {
  showDialog.value = true;
  processId.value = id;
}

watch(searchParam, (value: string) => {
  filteredRows.value = rows.value.filter((item) =>
    item.name.toLowerCase().includes(value.toLowerCase())
  );
});

watch(processStatus, () => {
  showDisableDialog.value = false;
  getAllProcesses()
});

onMounted(() => {
  getAllProcesses()
})

</script>
