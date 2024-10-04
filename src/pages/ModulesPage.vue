<template>
  <q-page class="q-pa-md q-pt-xl">
    <div class="text-h5 page-title">Módulos</div>
    <div class="q-mt-xl flex q-gutter-md">
      <q-card style="width: 300px">
        <q-card-section>
          <div class="flex items-center justify-between">
            <div class="inter-bold text-h6">Departamentos</div>
            <div
              style="
                width: 7px;
                height: 7px;
                background-color: blue;
                border-radius: 10px;
              "
            ></div>
          </div>
          <div class="text-caption text-grey-9">
            Adicione ou edite departamentos
          </div>
        </q-card-section>
        <q-card-actions>
          <q-btn
            color="primary"
            unelevated
            class="inter-medium"
            @click="$router.push({ path: '/departments' })"
            >Acessar</q-btn
          >
        </q-card-actions>
      </q-card>

      <!-- <q-card style="width: 300px">
        <q-card-section>
          <div class="flex items-center justify-between">
            <div class="inter-bold text-h6">Perspectivas</div>
            <div
              style="
                width: 7px;
                height: 7px;
                background-color: blue;
                border-radius: 10px;
              "
            ></div>
          </div>
          <div class="text-caption text-grey-9">
            Adicione ou edite perspectivas
          </div>
        </q-card-section>
        <q-card-actions>
          <q-btn color="primary" unelevated class="inter-medium">Acessar</q-btn>
        </q-card-actions>
      </q-card> -->
    </div>
  </q-page>
</template>

<script lang="ts" setup></script>
