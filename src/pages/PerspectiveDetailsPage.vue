<template>
  <q-page class="q-pa-md q-pt-xl">
    <q-btn
      dense
      icon="chevron_left"
      flat
      class="q-mb-lg"
      @click="$router.back()"
      >Voltar</q-btn
    >

    <q-inner-loading
      :showing="loading"
    />

    <div v-if="perspective.descriptions && !loading">
      <div class="text-h5 page-title">Detalhes da perspetiva</div>
      <div class="q-mt-md text-h6 q-mb-xl">{{perspective.name}}</div>

      <q-card flat class="q-mt-md" v-if="perspective.descriptions[0]">
        <q-card-section>
          <div class="text-h6 inter-medium">{{ perspective.descriptions[0] }}</div>
        </q-card-section>
      </q-card>
      <q-card flat class="q-mt-md" v-if="perspective.descriptions[1]">
        <q-card-section>
          <div class="text-h6 inter-medium">{{ perspective.descriptions[1] }}</div>
        </q-card-section>
      </q-card>
      <q-card flat class="q-mt-md" v-if="perspective.descriptions[2]">
        <q-card-section>
          <div class="text-h6 inter-medium">{{ perspective.descriptions[2] }}</div>
        </q-card-section>
      </q-card>
      <q-card flat class="q-mt-md" v-if="perspective.descriptions[3]">
        <q-card-section>
          <div class="text-h6 inter-medium">{{ perspective.descriptions[3] }}</div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { Notify } from 'quasar';
import { findPerspectiveById } from 'src/services/ModuleService';
import { IPerspective } from 'src/types';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const perspective = ref({} as IPerspective);

const route = useRoute();

const id = ref(route.query.id);
const loading = ref(false);

async function getPerspectiveById() {
  loading.value = true;
  const { data, error } = await findPerspectiveById(id.value?.toString());
  loading.value = false;

  if(error) {
    Notify.create({
      message: 'Erro ao buscar perspectiva',
      color: 'red'
    })
    return;
  }

  if(data) {
    perspective.value = data;
  }
}

onMounted(() => {
  getPerspectiveById();
})

</script>
