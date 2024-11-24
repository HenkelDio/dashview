<template>
  <q-page class="q-pa-md q-pt-md">
    <div class="flex justify-between items-top q-mt-md">
      <div class="text-h5 page-title" style="margin-bottom: 10px">
        Dashboard
      </div>
      <div v-if="userStore.$state.user.role === 'admin'">
        <q-btn
          flat
          @click="showDialogFilter = true"
          class="inter-bold text-dark"
        >
          Filtros
        </q-btn>
      </div>
    </div>

    <div class="q-mb-xl" style="margin-left: 3px">
      <div class="text-h6 inter-medium">FATURAMENTO</div>
      <div class="text-caption inter-medium">
        {{ store.$state.yearModel || '2024' }}
      </div>
    </div>

    <div style="margin-bottom: 10px" v-if="dashboardType === 'Painel PE'">
      <AdminCharts />
    </div>

    <div
      style="margin-bottom: 10px"
      v-if="store.$state.typeModel === 'Recursos Naturais'"
    >
      <NaturalResourcesCharts />
    </div>

    <div
      style="margin-bottom: 10px"
      v-if="store.$state.typeModel === 'Receitas e Despesas'"
    >
      <FinanceCharts />
    </div>

    <FilterDialogAdmin v-if="showDialogFilter" @close="closeFilterDialog()" />
  </q-page>
</template>

<script setup lang="ts">
import AdminCharts from 'src/components/AdminCharts/AdminCharts.vue';
import FinanceCharts from 'src/components/AdminCharts/FinanceCharts.vue';
import NaturalResourcesCharts from 'src/components/AdminCharts/NaturalResourcesCharts.vue';
import FilterDialogAdmin from 'src/components/Dialogs/FilterDialogAdmin.vue';
import { countUsers } from 'src/services/UserService';
import { useFilterStore } from 'src/stores/filters';
import { useUserStore } from 'src/stores/userStore';
import { computed, onMounted, ref } from 'vue';

const store = useFilterStore();
const userStore = useUserStore();

const showDialogFilter = ref(false);
const usersQuantity = ref('0');
const dashboardType = computed(() => store.$state.typeModel || 'Painel PE');

function closeFilterDialog() {
  showDialogFilter.value = false;
}

async function getUsersQuantity() {
  const { data, error } = await countUsers();

  if (error) {
    console.log(error);
  }

  usersQuantity.value = data.toString();
}

onMounted(() => {
  getUsersQuantity();
});
</script>
