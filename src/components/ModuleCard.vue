<template>
  <q-card style="width: 300px">
    <q-card-section
      :style="hasPermission(props.permission) ? 'opacity: 1' : 'opacity: 0.5'"
    >
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
        icon="info"
        v-if="!hasPermission(props.permission)"
        color="grey-8"
        flat
        size="0.8rem"
      >
        <q-tooltip>
          Você não tem permissão para acessar este módulo.
        </q-tooltip>
      </q-btn>
      <q-btn
        color="primary"
        unelevated
        class="inter-medium"
        v-if="hasPermission(props.permission)"
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
import { useUserStore } from 'src/stores/userStore';
import { computed } from 'vue';

interface IProps {
  title: string;
  description?: string;
  link: string;
  new?: boolean;
  icon?: string;
  permission?: string;
}

const userStore = useUserStore();

const props = defineProps<IProps>();

const query = computed(() => {
  const param = props.link.split('?');
  if (param.length > 1) return param[1].split('=')[1];
  return null;
});

function hasPermission(permission?: string): boolean {
  if (!permission) return true;
  const permissions = userStore.$state.user.permissions || {};
  return (permissions as Record<string, boolean>)[permission] === true;
}
</script>
