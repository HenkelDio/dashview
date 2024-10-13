<template>
   <q-card style="width: 300px">
      <q-card-section>
        <div class="flex items-center justify-between">
          <div class="inter-bold text-h6">{{props.title}}</div>
          <q-badge rounded color="primary" label="Novo" />
        </div>
        <div class="text-caption text-grey-9">
            {{props.description}}
        </div>
       </q-card-section>
      <q-card-actions>
        <q-btn
          color="primary"
          unelevated
          class="inter-medium"
          @click="$router.push({ path: props.link })"
          >Acessar</q-btn
        >
      </q-card-actions>
    </q-card>
</template>

<script setup lang="ts">

interface IProps {
  title: string,
  description: string,
  link: string
}

const props = defineProps<IProps>();



</script>
