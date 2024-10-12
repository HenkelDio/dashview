<template>
  <q-page class="q-pa-md q-pt-xl">
    <div class="text-h5 page-title">Perspectivas</div>

    <q-card flat class="q-mt-xl">
      <q-card-section>
        <div class="flex justify-between">
          <div class="flex q-gutter-md">
            <q-btn-toggle
              v-model="perspectiveStatus"
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
            label="Adicionar perspectiva"
            color="primary"
            class="inter-bold"
            size="1rem"
            unelevated
            @click="showDialog = true"
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
                @click="$router.push({path: `/preferences-details`, query: {id: props.row.id }})"
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
              @close="() => (showDisableDialog = false)"
              @confirm="changeStatusPerspective(props.row.id, props.row.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')"
              title="Desativar perspectiva?"
              description=""
              confirm-label-button="Desativar"
              color-label-button="red"
              :loading="loadingDisablePerspective"
            />
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <PerspectiveDialog
      v-if="showDialog"
      @close="showDialog = false, getAllPerspectives()"
    />
  </q-page>
</template>

<script lang="ts" setup>
import { Notify } from 'quasar';
import { changeStatus, findAllPerspectives } from 'src/services/ModuleService';
import { Column, IPerspective, STATUS } from 'src/types';
import { onMounted, ref, watch } from 'vue';
import moment from 'moment';
import 'moment/dist/locale/pt-br'
import PerspectiveDialog from 'src/components/Dialogs/PerspectiveDialog.vue';
import GenericDialog from 'src/components/Dialogs/GenericDialog.vue';

interface IPerspectiveTable {
  id: string,
  name: string,
  descriptions: string[],
  createdBy: string
  createdOn: string,
  status: STATUS
}

const loading = ref(false);
const rows = ref([] as IPerspectiveTable[]);
const showDisableDialog = ref(false);
const searchParam = ref('');
const filteredRows = ref([] as IPerspectiveTable[]);
const perspectiveStatus = ref('ACTIVE');
const showDialog = ref(false);
const loadingDisablePerspective = ref(false);

const columns = ref<Column[]>([
  {
    name: 'name',
    required: true,
    field: 'name',
    label: 'PERSPECTIVA',
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

async function getAllPerspectives() {
  loading.value = true;
  const { data, error } = await findAllPerspectives(perspectiveStatus.value);
  loading.value = false;

  if(error) {
    Notify.create({
      message: 'Erro ao carregar perspectivas',
      color: 'red'
    })
  }

  if(data) {
    const currentRows: IPerspectiveTable[] = data.map((perspective: IPerspective) => {
      return {
        id: perspective.id,
        name: perspective.name,
        descriptions: perspective.descriptions,
        createdBy: perspective.createdBy.name,
        createdOn: formatDate(perspective.createdOn),
        status: perspective.status,
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

async function changeStatusPerspective(id: string, status: string) {
  loadingDisablePerspective.value = true;
  const { error } = await changeStatus(id, status, 'perspective');
  loadingDisablePerspective.value = false;

  if(error) {
    Notify.create({
      message: 'Erro ao desativar perspectivas',
      color: 'red'
    })
    return;
  }

  getAllPerspectives();
}

function handleShowDialog(status: string, id: string,) {
  if(status === 'ACTIVE') {
    showDisableDialog.value = true
  } else {
    changeStatusPerspective(id, 'ACTIVE');
  }
}

watch(searchParam, (value: string) => {
  filteredRows.value = rows.value.filter((item) =>
    item.name.toLowerCase().includes(value.toLowerCase())
  );
});

watch(perspectiveStatus, () => {
  showDisableDialog.value = false;
  getAllPerspectives()
});

onMounted(() => {
  getAllPerspectives()
})

</script>
