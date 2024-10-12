<template>
  <q-page class="q-pa-md q-pt-xl">
    <div class="text-h5 page-title">Departamentos</div>

    <q-card flat class="q-mt-xl">
      <q-card-section>
        <div class="flex justify-between">
          <div class="flex q-gutter-md">
            <q-btn-toggle
              v-model="departmentStatus"
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
              v-model="searchDepartment"
              outlined
              dense
              placeholder="Buscar pelo nome"
            />
          </div>

          <q-btn
            no-caps
            label="Adicionar departamento"
            color="primary"
            class="inter-bold"
            size="1rem"
            unelevated
            @click="showDialog = true"
          />
        </div>
      </q-card-section>

      <q-card-section>
        <div class="flex q-gutter-md">
          <div v-for="(item, index) in departments" v-bind:key="index">
            <div style="width: 300px">
              <CardDepartment :label="item.label" />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <DepartmentDialog v-if="showDialog" @close="close" />
  </q-page>
</template>

<script lang="ts" setup>
import { Notify } from 'quasar';
import CardDepartment from 'src/components/CardDepartment.vue';
import DepartmentDialog from 'src/components/Dialogs/DepartmentDialog.vue';
import { getAllDepartments } from 'src/services/DepartmentService';
import { IDepartment } from 'src/types';
import { onMounted, ref } from 'vue';

const searchDepartment = ref('');
const departments = ref([] as IDepartment[]);
const showDialog = ref(false);
const departmentStatus = ref('ACTIVE');

interface IResponse {
  data: IDepartment[] | null;
  error: unknown | null;
}

function close() {
  showDialog.value = false;
  getDepartments();
}

async function getDepartments() {
  const { data, error }: IResponse = await getAllDepartments();

  if (error) {
    Notify.create({
      caption: 'Erro ao carregar departamentos',
      group: true,
      color: 'red',
    });
    return;
  }

  if (data) {
    departments.value = data;
  }
}

onMounted(() => {
  getDepartments();
});
</script>
