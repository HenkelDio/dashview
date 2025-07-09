<template>
  <q-page class="q-pa-md">
    <q-btn
      dense
      icon="chevron_left"
      flat
      class="q-mb-lg"
      @click="$router.back()"
      >Voltar</q-btn
    >

    <div class="text-h5 page-title">Classificações</div>

    <q-card flat class="q-mt-xl">
      <q-card-section>
        <div class="flex justify-between">
          <div class="flex q-gutter-md">
            <q-btn-toggle
              v-model="classificationStatus"
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
              v-model="searchClassification"
              outlined
              dense
              placeholder="Buscar pelo nome"
            />
          </div>

          <q-btn
            no-caps
            label="Nova classificação"
            color="primary"
            class="inter-bold"
            size="1rem"
            unelevated
            @click="
              showDialog = true;
              classificationEdit.department.label = '';
            "
          />
        </div>
      </q-card-section>

      <q-card-section>
        <q-inner-loading
          :showing="loading"
          style="height: 100px"
          color="primary"
        />

        <q-table
          flat
          :rows="classificationFiltered"
          :columns="columns"
          row-key="description"
          table-header-class="inter-bold text-dark"
          rows-per-page-label="Resultados por página"
          :loading="loading"
          no-data-label="Nenhuma classificação encontrada"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td style="width: 40%">
                {{ props.row.description }}
              </q-td>

              <q-td style="width: 40%">
                {{ props.row.department ? props.row.department.label : '-' }}
              </q-td>

              <q-td style="width: 50%">
                <div
                  :style="{
                    width: '20px',
                    height: '20px',
                    borderRadius: '10px',
                    backgroundColor: props.row.color,
                  }"
                ></div>
              </q-td>

              <q-td key="actions">
                <q-btn
                  flat
                  round
                  dense
                  :icon="
                    props.row.status === 'ACTIVE'
                      ? 'edit'
                      : 'published_with_changes'
                  "
                  color="primary"
                  @click="
                    () => {
                      if (props.row.status === 'ACTIVE') {
                        showDialog = true;
                        classificationEdit = props.row;
                      } else {
                        changeStatus(props.row);
                      }
                    }
                  "
                />

                <q-btn
                  flat
                  round
                  dense
                  icon="delete"
                  color="negative"
                  @click="classificationToInactivate = props.row"
                  v-if="props.row.status === 'ACTIVE'"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>

        <GenericDialog
          v-if="classificationToInactivate"
          @close="() => (classificationToInactivate = null)"
          @confirm="changeStatus(classificationToInactivate)"
          title="Desativar classificação?"
          description="A classificação não poderá mais ser usada"
          confirm-label-button="Desativar"
          color-label-button="red"
          :loading="loadingDisableClassification"
        />
      </q-card-section>
    </q-card>

    <ClassificationDialog
      v-if="showDialog"
      @close="close"
      :departmentEdit="classificationEdit.department"
      :descriptionEdit="classificationEdit.description"
      :colorEdit="classificationEdit.color"
      :id="classificationEdit.id"
    />
  </q-page>
</template>

<script lang="ts" setup>
import { Notify } from 'quasar';
import { Column, IClassification } from 'src/types';
import { onMounted, ref, watch } from 'vue';
import {
  changeStatusClassification,
  getAllClassification,
} from '../services/classificationService';
import ClassificationDialog from 'src/components/Dialogs/ClassificationDialog.vue';
import GenericDialog from 'src/components/Dialogs/GenericDialog.vue';

const searchClassification = ref('');
const classificationFiltered = ref([] as IClassification[]);
const showDialog = ref(false);
const classificationStatus = ref('ACTIVE');
const loading = ref(false);
const classifications = ref([] as IClassification[]);
const classificationEdit = ref({} as IClassification);
const showInactivateDialog = ref(false);
const loadingDisableClassification = ref(false);
const classificationToInactivate = ref(null);

const columns = ref<Column[]>([
  {
    name: 'description',
    required: true,
    field: 'description',
    label: 'Descrição',
    sortable: false,
    align: 'left',
  },
  {
    name: 'department',
    field: 'department',
    label: 'DEPARTAMENTO',
    sortable: false,
    align: 'left',
  },
  {
    name: 'color',
    field: 'color',
    label: 'COR',
    sortable: false,
    align: 'left',
  },
  { name: 'actions', align: 'center', field: 'actions', label: '' },
]);

interface IResponse {
  data: IClassification[] | null;
  error: unknown | null;
}

function close() {
  showDialog.value = false;
  getClassifications();
}

async function changeStatus(row: IClassification) {
  loadingDisableClassification.value = true;
  const status = (row.status = row.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE');
  const { error } = await changeStatusClassification(row.id, status);
  loadingDisableClassification.value = false;

  if (error) {
    Notify.create({
      caption: 'Erro ao desabilitar classificação',
      color: 'red',
      group: true,
    });
    return;
  }

  showInactivateDialog.value = false;
  classificationStatus.value = status;
  getAllClassification(status);
}

async function getClassifications() {
  loading.value = true;
  const { data, error }: IResponse = await getAllClassification(
    classificationStatus.value
  );
  loading.value = false;

  if (error) {
    Notify.create({
      caption: 'Erro ao carregar departamentos',
      group: true,
      color: 'red',
    });
    return;
  }

  if (data) {
    classifications.value = data;
    classificationFiltered.value = data;
  }
}

watch(classificationStatus, () => {
  getClassifications();
});

watch(searchClassification, (value: string) => {
  classificationFiltered.value = classifications.value.filter((item) =>
    item.description.toLowerCase().includes(value.toLowerCase())
  );
});

onMounted(() => {
  getClassifications();
});
</script>
