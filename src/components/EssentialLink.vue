<template>
  <div>
    <div v-if="children.length > 0">
      <q-list>
        <q-expansion-item expand-separator :caption="caption">
          <template v-slot:header>
            <q-item-section avatar>
              <q-icon color="grey-7" :name="icon" />
            </q-item-section>

            <q-item-section>
              <q-item-label class="inter-medium">{{ title }}</q-item-label>
              <q-item-label caption>{{ caption }}</q-item-label>
            </q-item-section>
          </template>
          <q-list class="q-mb-md">
            <div v-for="child in children" :key="child.title" class="q-pl-md">
              <EssentialLink
                v-bind="child"
                v-if="hasPermission(child.permission)"
              />
            </div>
          </q-list>
        </q-expansion-item>
      </q-list>
    </div>

    <q-item
      clickable
      tag="a"
      :href="link"
      class="text-dark"
      v-if="children.length === 0"
    >
      <q-item-section v-if="icon" avatar>
        <q-icon :name="icon" color="grey-7" />
      </q-item-section>

      <q-item-section>
        <q-item-label class="inter-medium">{{ title }}</q-item-label>
        <q-item-label caption>{{ caption }}</q-item-label>
      </q-item-section>
    </q-item>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from 'src/stores/userStore';

defineOptions({
  name: 'EssentialLink',
});

const userStore = useUserStore();

function hasPermission(permission?: string): boolean {
  if (!permission) return true;
  const permissions = userStore.$state.user.permissions || {};
  console.log('permissions', permissions);
  return (permissions as Record<string, boolean>)[permission] === true;
}

export interface EssentialLinkProps {
  title: string;
  caption?: string;
  link?: string;
  icon?: string;
  security?: string;
  children?: EssentialLinkProps[];
  permission?: string;
}

withDefaults(defineProps<EssentialLinkProps>(), {
  caption: '',
  link: '#',
  icon: '',
  children: () => [],
});
</script>
