<template>
  <q-card style="width: 300px">
    <q-card-section>
      <q-badge rounded color="primary" v-if="props.new">Novo</q-badge>
      <div class="flex items-center justify-between">
        <div style="display: flex; align-items: center; gap: 5px">
          <div v-if="icon">
            <q-icon color="grey-9" :name="icon" size="1.5rem" />
          </div>
          <div class="inter-bold text-h6 grey-9">
            {{ props.title }}
          </div>
        </div>

        <!-- <q-badge rounded color="primary" /> -->
      </div>
      <div class="text-caption text-grey-9">
        {{ props.description }}
      </div>
    </q-card-section>
    <q-card-actions>
      <q-btn
        color="primary"
        unelevated
        class="inter-medium"
        @click="
          $router.push({
            path: props.link,
            query: query ? { type: query } : undefined,
          })
        "
        >Acessar</q-btn
      >
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface IProps {
  title: string;
  description?: string;
  link: string;
  new?: boolean;
  icon?: string;
}

const props = defineProps<IProps>();

const query = computed(() => {
  const param = props.link.split('?');
  if (param.length > 1) return param[1].split('=')[1];
  return null;
});
</script>
