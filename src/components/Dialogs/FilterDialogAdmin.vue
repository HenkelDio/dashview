<template>
  <q-dialog v-model="show" persistent>
    <q-card :style="{ width: isMobile ? '100%' : '500px' }">
      <q-card-section>
        <div class="text-h6">Filtros</div>
      </q-card-section>
      <q-card-section>
        <div>
          <q-select v-model="typeModel" :options="typeOptions" label="Tipo" />
        </div>

        <div>
          <q-select v-model="year" :options="yearOptions" label="Ano" />
        </div>
      </q-card-section>

      <q-card-actions horizontal align="right">
        <q-btn class="bg-primary text-white" @click="saveFilter()"
          >APLICAR</q-btn
        >
        <q-btn flat @click="$emit('close')">Fechar</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useFilterStore } from 'src/stores/filters';
import { computed, ref } from 'vue';
import { useQuasar } from 'quasar';

const emit = defineEmits(['close']);
const show = ref(true);

const $q = useQuasar();

const isMobile = computed(() => $q.platform.is.mobile);

const store = useFilterStore();

const typeModel = ref(store.typeModel || 'Painel PE');
const typeOptions = ref([
  'Painel PE',
  'Recursos Naturais',
  'Receitas e Despesas',
]);

const year = ref(store.yearModel || '2024');
const yearOptions = ref(['2024']);

function saveFilter() {
  store.setTypeModel(typeModel.value);
  store.setYearModel(year.value);
  emit('close');
}
</script>
