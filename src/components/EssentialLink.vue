<template>
  <q-item clickable tag="a" :href="link" class="text-dark">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" color="grey-7" />
    </q-item-section>

    <q-item-section>
      <q-item-label class="inter-medium">{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
defineOptions({
  name: 'EssentialLink',
});

export interface EssentialLinkProps {
  title: string;
  caption?: string;
  link?: string;
  icon?: string;
}

withDefaults(defineProps<EssentialLinkProps>(), {
  caption: '',
  link: '#',
  icon: '',
});
</script>
