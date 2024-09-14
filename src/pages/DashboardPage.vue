<template>
  <q-page class="q-pa-md">
    <div class="flex justify-between items-top q-mb-lg">
      <div class="text-h5">Dashboard</div>
      <div>
        <q-btn flat @click="showDialogFilter = true">
          Filtros
        </q-btn>
      </div>
    </div>
    <div class="flex q-gutter-y-md" v-for="(indicator, index) in filteredIndicators" :key="index">
      <BarChart :indicator="indicator" class="q-mb-md"/>
    </div>


    <FilterDialog v-if="showDialogFilter" @close="closeFilterDialog()" />

  </q-page>
</template>

<script setup lang="ts">
import BarChart from 'src/components/BarChart.vue';
import FilterDialog from 'src/components/FilterDialog.vue';
import { indicators } from 'src/content/mock';
import { useFilterStore } from 'src/stores/filters';
import { computed, ref } from 'vue';

const store = useFilterStore();

const showDialogFilter = ref(false);

function closeFilterDialog() {
  showDialogFilter.value = false;
}

const filteredIndicators = computed(() => {
  return indicators.filter(indicator => {
    // Comparar os valores do store com os campos do indicador
    const matchType = !store.typeModel || indicator.type === store.typeModel
    const matchProcess = !store.processModel || indicator.process === store.processModel
    const matchDepartment = !store.departmentModel || indicator.departament === store.departmentModel
    const matchResponsible = !store.responsibleModel || indicator.responsable === store.responsibleModel

    // Retorna apenas os indicadores que atendem a todos os critérios
    return matchType && matchProcess && matchDepartment && matchResponsible
  })
})

</script>
