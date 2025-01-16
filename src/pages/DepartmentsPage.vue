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
        <q-inner-loading
          :showing="loading"
          style="height: 100px"
          color="primary"
        />

        <div class="flex q-gutter-md" v-if="!loading">
          <div v-for="item in departmentsFiltered" v-bind:key="item.name">
            <div style="width: 300px">
              <CardDepartment
                :department="item"
                @changedStatus="getDepartments()"
              />
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
import { onMounted, ref, watch } from 'vue';

const searchDepartment = ref('');
const departments = ref([] as IDepartment[]);
const departmentsFiltered = ref([] as IDepartment[]);
const showDialog = ref(false);
const departmentStatus = ref('ACTIVE');
const loading = ref(false);

interface IResponse {
  data: IDepartment[] | null;
  error: unknown | null;
}

function close() {
  showDialog.value = false;
  getDepartments();
}

async function getDepartments() {
  loading.value = true;
  const { data, error }: IResponse = await getAllDepartments(
    departmentStatus.value
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
    departments.value = data;
    departmentsFiltered.value = data;
  }
}

watch(departmentStatus, () => {
  getDepartments();
});

watch(searchDepartment, (value: string) => {
  departmentsFiltered.value = departments.value.filter((item) =>
    item.name.toLowerCase().includes(value.toLowerCase())
  );
});

onMounted(() => {
  getDepartments();
});
</script>
