<template>
  <div>
    <q-card>
      <q-card-section>
        <div class="text-caption inter-light">Departamento</div>
        <div class="inter-bold">{{ label }}</div>
      </q-card-section>
      <q-card-actions>
        <q-btn flat round dense icon="delete" color="negative" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
interface IProps {
  label: string;
}

const props = defineProps<IProps>();
const label = props.label;
</script>
