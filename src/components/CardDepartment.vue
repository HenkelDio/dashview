<template>
  <div>
    <q-card>
      <q-card-section>
        <div class="text-caption inter-light">Departamento</div>
        <div class="inter-bold">{{ label }}</div>
      </q-card-section>
      <q-card-actions>
        <q-btn flat round dense icon="delete" color="negative" @click="changeStatus" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
import {changeStatusDepartment} from '../services/DepartmentService';
import { Notify } from 'quasar';
interface IProps {
  label: string;
  name: string;
}

const props = defineProps<IProps>();
const label = props.label;
const name = props.name;

async function changeStatus() {
  const {error} = await changeStatusDepartment('INACTIVE', name)

  if(error){
    Notify.create({
      message: 'Erro ao inativar departamento',
      color: 'red'
    })
    return;
  }

  Notify.create({
      message: 'Departamento inativado com sucesso',
      color: 'green'
    })
}

</script>
