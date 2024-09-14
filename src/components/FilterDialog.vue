<template>
<q-dialog v-model="show" persistent>
  <q-card :style="{width: isMobile ? '100%' : '500px'}">
    <q-card-section>
      <div class="text-h6">Filtros</div>
    </q-card-section>
    <q-card-section>

      <div>
        <q-select
          v-model="typeModel"
          :options="typeOptions"
          label="Tipo"
        />
      </div>

      <div>
        <q-select
          v-model="proccessModel"
          :options="proccessOptions"
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
import { indicators } from 'src/content/mock';
import { useFilterStore } from 'src/stores/filters';
import { computed, ref } from 'vue';
import { useQuasar } from 'quasar';

const emit = defineEmits(['close']);
const show = ref(true);

const $q = useQuasar()

const isMobile = computed(() => $q.platform.is.mobile)

const store = useFilterStore()

const typeModel = ref(store.typeModel);
const typeOptions = ref([
  ...new Set(indicators.map(item => item.type))
])

const proccessModel = ref(store.processModel);
const proccessOptions = ref([
...new Set(indicators.map(item => item.process))
])

const departamentModel = ref(store.departmentModel);
const departamentOptions = ref([
...new Set(indicators.map(item => item.departament))
])

const responsibleModel = ref(store.responsibleModel);
const responsibleOptions = ref([
...new Set(indicators.map(item => item.responsable))
])



function saveFilter() {
  store.setTypeModel(typeModel.value);
  store.setProcessModel(proccessModel.value)
  store.setDepartmentModel(departamentModel.value)
  store.setResponsibleModel(responsibleModel.value)
  emit('close')
}

function clearFilters() {
  store.setTypeModel('');
  store.setProcessModel('')
  store.setDepartmentModel('')
  store.setResponsibleModel('')
  typeModel.value = '';
  proccessModel.value = '';
  departamentModel.value = '',
  responsibleModel.value = ''
}

const showClearFiltersButton = computed(() => {
  return typeModel.value || proccessModel.value || departamentModel.value || responsibleModel.value
})

</script>
