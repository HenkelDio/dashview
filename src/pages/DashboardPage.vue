<template>
  <q-page class="q-pa-md q-pt-xl">
    <div class="flex justify-between items-top q-mb-xl q-mt-md">
      <div class="text-h5 page-title">Dashboard</div>
      <div v-if="userStore.$state.user.role === 'admin'">
        <q-toggle
          v-model="adminMode"
          label="MODO ADMINISTRADOR"
          class="inter-bold q-mr-md"
        />
        <q-btn
          flat
          @click="showDialogFilter = true"
          class="inter-bold text-dark"
          :disable="adminMode"
        >
          Filtros
        </q-btn>
      </div>
    </div>

    <div class="flex q-gutter-x-md">
      <div
        :style="{ width: isMobile ? '100%' : '280px', marginBottom: '20px' }"
      >
        <CardInfo
          value="15"
          description="Indicadores em andamento"
          icon="insert_chart"
          colorIcon="blue"
        />
      </div>
      <div
        :style="{ width: isMobile ? '100%' : '280px', marginBottom: '20px' }"
      >
        <CardInfo
          value="20"
          description="Usuários cadastrados"
          icon="account_circle"
          colorIcon="green"
        />
      </div>
    </div>

    <div style="margin-bottom: 10px" v-if="adminMode">
      <AdminCharts />
    </div>

    <div v-if="!adminMode">
      <div
        class="flex q-gutter-y-md"
        v-for="(indicator, index) in filteredIndicators"
        :key="index"
      >
        <BarChart :indicator="indicator" class="q-mb-md" />
      </div>
    </div>

    <FilterDialog v-if="showDialogFilter" @close="closeFilterDialog()" />
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import AdminCharts from 'src/components/AdminCharts.vue';
import BarChart from 'src/components/BarChart.vue';
import CardInfo from 'src/components/CardInfo.vue';
import FilterDialog from 'src/components/FilterDialog.vue';
import { indicators } from 'src/content/mock';
import { useFilterStore } from 'src/stores/filters';
import { useUserStore } from 'src/stores/userStore';
import { computed, ref } from 'vue';

const store = useFilterStore();
const userStore = useUserStore();

const showDialogFilter = ref(false);
const adminMode = ref(userStore.$state.user.role === 'admin');

function closeFilterDialog() {
  showDialogFilter.value = false;
}

const $q = useQuasar();
const isMobile = computed(() => $q.platform.is.mobile);

const filteredIndicators = computed(() => {
  return indicators.filter((indicator) => {
    // Comparar os valores do store com os campos do indicador
    const matchType = !store.typeModel || indicator.type === store.typeModel;
    const matchProcess =
      !store.processModel || indicator.process === store.processModel;
    const matchDepartment =
      !store.departmentModel || indicator.departament === store.departmentModel;
    const matchResponsible =
      !store.responsibleModel ||
      indicator.responsable === store.responsibleModel;

    // Retorna apenas os indicadores que atendem a todos os critérios
    return matchType && matchProcess && matchDepartment && matchResponsible;
  });
});
</script>
