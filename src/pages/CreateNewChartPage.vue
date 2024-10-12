<template>
  <q-page class="q-pa-md q-pt-xl">
    <q-btn
      dense
      icon="chevron_left"
      flat
      class="q-mb-lg"
      @click="$router.back()"
      >Voltar</q-btn
    >
    <div class="text-h5 page-title">Criar novo gráfico</div>

    <q-card flat class="q-mt-xl">
      <q-card-section>
        <div class="text-h6 inter-bold q-mb-sm">Título do gráfico</div>
        <q-input v-model="chart.title" outlined label="Novo gráfico" />
      </q-card-section>
    </q-card>

    <q-card flat class="q-mt-md">
      <q-card-section>
        <div class="text-h6 inter-bold q-mb-sm">Detalhes</div>
        <div class="flex column q-gutter-y-md">
          <q-select
            outlined
            label="Perspectiva"
            v-model="chart.perspective"
          />
          <q-select
            outlined
            label="Processo"
            v-model="chart.process"
          />
          <q-select
            outlined
            label="Setor"
            v-model="chart.department"
          />
          <q-select
            outlined
            label="Responsável"
            v-model="chart.responsible"
          />
          <q-select
            outlined
            label="Periodicidade"
            v-model="chart.periodicity"
          />
          <q-input v-model="chart.objective" outlined label="Objetivo" />
          <q-input v-model="chart.formula" outlined label="Fórmula" />
        </div>
      </q-card-section>
    </q-card>

    <q-card flat class="q-mt-md">
      <q-card-section>
        <div class="text-h6 inter-bold">Tipo de gráfico</div>
        <div class="flex row q-gutter-x-md">
          <div>
          <div class="q-gutter-sm q-mb-sm">
          <!-- <q-radio
            v-model="chart.type"
            checked-icon="task_alt"
            unchecked-icon="panorama_fish_eye"
            val="setor"
            label="Setores"
          >
          </q-radio> -->
          <q-radio
            v-model="chart.type"
            checked-icon="task_alt"
            unchecked-icon="panorama_fish_eye"
            val="bar"
            label="Barra"
          />
        </div>
        <div
          style="background-color: #ededeb; width: 100px; border-radius: 8px"
          class="flex justify-center"
        >
          <q-icon
            :name="chart.type === 'bar' ? 'equalizer' : 'pie_chart'"
            size="5rem"
            style="opacity: 0.8"
          />
        </div>
        </div>

        </div>
      </q-card-section>
    </q-card>


    <div v-for="(item, index) in chart.chartData" :key="index">
      <q-card flat class="q-mt-md">
      <q-card-section>
        <div class="text-h6 inter-bold q-mb-sm">Dados do gráfico {{index + 1}}</div>

        <div class="flex q-gutter-sm column">
          <q-input v-model="chart.chartData[0].label" outlined label="Rótulo principal" dense class="col-2"/>
          <q-input
            outlined
            label="Cor das barras"
            v-model="chart.chartData[0].backgroundColor"
            dense
          >
            <template v-slot:append>
              <div :style="{ backgroundColor: chart.chartData[0].backgroundColor, height: '20px', width: '20px', borderRadius: '5px' }"></div>
              <q-icon name="colorize" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-color v-model="chart.chartData[0].backgroundColor" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <div class="flex q-gutter-md q-pa-sm">
            <div v-for="(item, index) in chart.chartData[0].data" :key="index">
            <div>
              <q-input v-model="chart.chartData[0].labels[index]" outlined label="Rótulo" dense style="width: 110px;" />
              <q-input v-model="chart.chartData[0].data[index]" outlined label="Valor" dense style="width: 110px;" />
            </div>
          </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
    </div>

    <q-card flat class="q-mt-md">
      <q-card-section class="flex justify-center">
        <q-btn icon="add_circle" flat @click="addSection()">
          <q-tooltip>
            Adicionar mais uma seção de dados
          </q-tooltip>
        </q-btn>
      </q-card-section>
    </q-card>

    <div class="text-right">
      <q-btn color="primary" unelevated class="inter-medium q-mt-md" style="width: 200px;">
        Salvar gráfico
      </q-btn>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue';


const chart = ref({
  title: '',
  type: 'bar',
  perspective: '',
  process: '',
  department: '',
  responsible: '',
  periodicity: '',
  objective: '',
  formula: '',
  chartData: [
    {
      label: 'Dados',
      labels: ['Rótulo 1', 'Rótulo 2', 'Rótulo 3', 'Rótulo 4', 'Rótulo 5', 'Rótulo 6', 'Rótulo 7', 'Rótulo 8', 'Rótulo 9', 'Rótulo 10', 'Rótulo 11', 'Rótulo 12'],
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      backgroundColor: '#422878'
    }
  ]
})


function addSection() {
  chart.value.chartData.push(
    {
      label: 'Dados',
      labels: ['Rótulo 1', 'Rótulo 2', 'Rótulo 3', 'Rótulo 4', 'Rótulo 5', 'Rótulo 6', 'Rótulo 7', 'Rótulo 8', 'Rótulo 9', 'Rótulo 10', 'Rótulo 11', 'Rótulo 12'],
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      backgroundColor: '#422878'
    }
  )
}

</script>
