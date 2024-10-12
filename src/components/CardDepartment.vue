<template>
  <div>
    <q-card>
      <q-card-section>
        <div class="text-caption inter-light">Departamento</div>
        <div class="inter-bold">{{ label }}</div>
      </q-card-section>
      <q-card-actions>
        <q-btn flat dense :label="buttonLabel" :color="colorButton" class="inter-bold" @click="showDialog()" :loading="loading" />
      </q-card-actions>
    </q-card>

    <GenericDialog
      v-if="show"
      title="Inativar departamento?"
      description="Os usuários deste departamento não terão acesso às informações."
      confirm-label-button="Sim"
      color-label-button="red"
      :loading="loading"
      @confirm="changeStatus()"
      @close="show = false"
    />
  </div>
</template>

<script lang="ts" setup>
import { IDepartment } from 'src/types';
import {changeStatusDepartment} from '../services/DepartmentService';
import { Notify } from 'quasar';
import { computed, ref } from 'vue';
import GenericDialog from './Dialogs/GenericDialog.vue';
interface IProps {
  department: IDepartment
}

const props = defineProps<IProps>();
const label = props.department.label;
const name = props.department.name;
const status = props.department.status;

const loading = ref(false);
const show = ref(false);

const emit = defineEmits(['changedStatus'])

function showDialog() {
  if(status === 'INACTIVE') {
    changeStatus();
  } else {
    show.value = true;
  }
}

async function changeStatus() {
  loading.value = true
  const {error} = await changeStatusDepartment(statusParam.value, name)
  loading.value = false

  if(error){
    Notify.create({
      message: 'Erro ao inativar departamento',
      color: 'red'
    })
    return;
  }

  emit('changedStatus');
}

const buttonLabel = computed(() => {
  return status === 'ACTIVE' ? 'INATIVAR' : 'ATIVAR'
})

const colorButton = computed(() => {
  return status === 'ACTIVE' ? 'negative' : 'positive'
})

const statusParam = computed(() => {
  return status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
})

</script>
