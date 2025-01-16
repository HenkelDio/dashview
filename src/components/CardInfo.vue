<template>
  <div>
    <q-card flat>
      <q-card-section>
        <div class="flex justify-between">
          <div class="flex column">
            <div
              class="inter-bold text-h6"
              style="margin-bottom: 2px"
              v-if="!loading"
            >
              {{ props.value }}
            </div>
            <div>
              <q-inner-loading
                :showing="loading"
                style="height: 100px"
                color="primary"
              />
            </div>

            <div class="inter" v-if="!link">{{ props.description }}</div>
            <div
              class="inter action"
              v-if="link"
              style="text-decoration: underline; cursor: pointer"
              @click="$router.push('/answers')"
            >
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
  value: string | number;
  description: string;
  icon: string;
  colorIcon: string;
  link?: boolean;
  loading: boolean;
}

const props = defineProps<IProps>();
</script>

<style lang="scss">
.action:hover {
  font-weight: 600;
}
</style>
