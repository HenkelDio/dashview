<template>
  <q-page class="q-pa-md q-pt-xl">
    <div class="text-h5 page-title">Preferências</div>

    <q-card flat class="q-mt-xl">
      <q-card-section>
        <div class="flex items-center q-gutter-x-md">
          <q-avatar color="primary" text-color="white">W</q-avatar>
          <div>
            <div class="inter-bold text-h5 text-dark">
              Willian José Henkel de Deus
            </div>
            <div class="text-caption">Membro há uma semana</div>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <q-list separator>
          <q-item clickable v-ripple>
            <q-item-section>
              <div class="inter-medium">Nome</div>
            </q-item-section>

            <q-item-section>Willian José Henkel de Deus</q-item-section>
            <q-item-section>
              <q-btn
                style="width: 200px"
                label="Editar"
                flat
                color="primary"
                class="inter-bold"
              />
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <div class="inter-medium">E-mail</div>
            </q-item-section>

            <q-item-section>willianhenkel@gmail.com</q-item-section>
            <q-item-section>
              <q-btn
                style="width: 200px"
                label="Editar"
                flat
                color="primary"
                class="inter-bold"
              />
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <div class="inter-medium">Senha</div>
            </q-item-section>

            <q-item-section>**********</q-item-section>
            <q-item-section>
              <q-btn
                style="width: 200px"
                label="Redefinir senha"
                flat
                color="primary"
                class="inter-bold"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup></script>
