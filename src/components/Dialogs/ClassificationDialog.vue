<template>
  <q-dialog v-model="show" persistent>
    <q-card style="width: 500px">
      <q-card-section>
        <div class="inter-medium" style="font-size: 1.5rem">
          Adicionar nova classificação
        </div>
      </q-card-section>
      <q-card-section>
        <div class="flex column q-gutter-y-md">
          <q-input label="Descrição" v-model="description" outlined />
          <q-select
            :options="departmentOptions"
            label="Departamento"
            v-model="department"
            :loading="loadingDepartament"
            emit-value
            map-options
            outlined
          />
          <q-select
            v-model="color"
            :options="colors"
            label="Cor"
            outlined
            emit-value
            map-options
            dense
            option-label="label"
            option-value="value"
            :option-slot="true"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar>
                  <div
                    :style="{
                      backgroundColor: scope.opt.value,
                      width: '24px',
                      height: '24px',
                      borderRadius: '4px',
                    }"
                  />
                </q-item-section>
                <q-item-section>
                  {{ scope.opt.label }}
                </q-item-section>
              </q-item>
            </template>

            <template v-slot:selected>
              <q-item>
                <q-item-section avatar>
                  <div
                    :style="{
                      backgroundColor: color || 'transparent',
                      width: '24px',
                      height: '24px',
                      borderRadius: '4px',
                    }"
                  />
                </q-item-section>
                <q-item-section>
                  {{ selectedLabel }}
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          color="primary"
          unelevated
          label="Salvar"
          :disable="!description || !department || !color"
          @click="isEdit ? handleUpdateClassification() : addClassification()"
          :loading="loading"
        />
        <q-btn flat label="Fechar" @click="emit('close')" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { Notify } from 'quasar';
import {
  createClassification,
  updateClassification,
} from 'src/services/classificationService';
import { getAllDepartments } from 'src/services/DepartmentService';
import { IDepartment } from 'src/types';
import { computed, onMounted, ref } from 'vue';

const show = ref(true);
const description = ref('');
const department = ref('');
const loading = ref(false);
const loadingDepartament = ref(false);
const departmentOptions = ref([] as IDepartment[]);
const color = ref(null as string | null);

const colors = [
  { label: 'Vermelho', value: '#f44336' },
  { label: 'Verde', value: '#4caf50' },
  { label: 'Azul', value: '#2196f3' },
  { label: 'Amarelo', value: '#ffeb3b' },
  { label: 'Roxo', value: '#9c27b0' },
  { label: 'Laranja', value: '#ff9800' },
  { label: 'Ciano', value: '#00bcd4' },
  { label: 'Rosa', value: '#e91e63' },
  { label: 'Marrom', value: '#795548' },
  { label: 'Cinza', value: '#9e9e9e' },
  { label: 'Preto', value: '#000000' },
  { label: 'Verde Claro', value: '#8bc34a' },
  { label: 'Azul Claro', value: '#03a9f4' },
  { label: 'Rosa Claro', value: '#f48fb1' },
  { label: 'Laranja Claro', value: '#ffb74d' },
  { label: 'Vinho', value: '#7b1fa2' },
  { label: 'Turquesa', value: '#1de9b6' },
  { label: 'Dourado', value: '#ffca28' },
  { label: 'Cinza Escuro', value: '#616161' },
  { label: 'Verde Água', value: '#009688' },
  { label: 'Roxo Claro', value: '#ba68c8' },
  { label: 'Azul Marinho', value: '#303f9f' },
  { label: 'Vermelho Escuro', value: '#b71c1c' },
  { label: 'Bege', value: '#f5f5dc' },
  { label: 'Lavanda', value: '#e6e6fa' },
  { label: 'Salmão', value: '#ff8a65' },
  { label: 'Mostarda', value: '#f9a825' },
  { label: 'Verde Oliva', value: '#827717' },
];

const selectedLabel = computed(() => {
  const found = colors.find((c) => c.value === color.value);
  return found ? found.label : '';
});

async function getDepartments() {
  loadingDepartament.value = true;
  const { data, error } = await getAllDepartments('ACTIVE');
  loadingDepartament.value = false;

  if (error) {
    Notify.create({
      message: 'Erro ao carregar departamentos',
      color: 'red',
    });
    return;
  }

  if (data) {
    departmentOptions.value = data.map((item: IDepartment) => {
      return {
        label: item.label,
        value: item.id,
      };
    });
  }
}

const handleUpdateClassification = async () => {
  const payload = {
    description: description.value,
    department: {
      id: department.value,
    },
    id: props.id,
    color: color.value,
  };

  const { error } = await updateClassification(payload);

  if (error) {
    Notify.create({
      caption: 'Erro ao atualizar classificação',
      color: 'red',
      group: true,
    });
    return;
  }

  Notify.create({
    caption: 'Classificação atualizar com sucesso!',
    color: 'green',
    group: true,
  });

  description.value = '';
  department.value = '';

  emit('close');
};

const addClassification = async () => {
  const payload = {
    description: description.value,
    department: {
      id: department.value,
    },
    color: color.value,
  };

  const { error } = await createClassification(payload);

  if (error) {
    Notify.create({
      caption: 'Erro ao criar classificação',
      color: 'red',
      group: true,
    });
    return;
  }

  Notify.create({
    caption: 'Classificação criada com sucesso!',
    color: 'green',
    group: true,
  });

  description.value = '';
  department.value = '';

  emit('close');
};

const emit = defineEmits(['close']);

interface IProps {
  descriptionEdit?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  departmentEdit?: IDepartment;
  id?: string;
  colorEdit?: string;
}
const props = defineProps<IProps>();

const isEdit = computed(() => {
  return props.descriptionEdit && props.departmentEdit?.label;
});

onMounted(() => {
  getDepartments();

  if (isEdit.value) {
    description.value = props.descriptionEdit ?? '';
    department.value = props.departmentEdit?.id ?? '';

    color.value = props.colorEdit ?? null;
  }
});
</script>
