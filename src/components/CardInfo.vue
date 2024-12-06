<template>
  <div>
    <q-card flat>
      <q-card-section>
        <div class="flex justify-between">
          <div class="flex column">
            <div class="inter-bold text-h6" style="margin-bottom: 2px">
              {{ props.value }}
            </div>
            <div class="inter" v-if="!action">{{ props.description }}</div>
            <div class="inter" v-if="action">
              {{ props.description }}
            </div>
          </div>
          <div>
            <q-icon :name="icon" :color="colorIcon" size="3rem" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
interface IProps {
  value: string;
  description: string;
  icon: string;
  colorIcon: string;
  action?: boolean;
}

const props = defineProps<IProps>();
</script>
