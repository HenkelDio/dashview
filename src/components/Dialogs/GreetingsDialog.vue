<template>
  <q-dialog v-model="show" persistent>
    <q-card style="width: 400px">
      <q-card-section>
        <div>
          <Vue3Lottie :animationData="greetings" :height="200" :width="200"/>
        </div>

        <div class="text-h5 inter-bold text-center">
          Seja bem-vindo(a) {{props.name}}!
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Fechar" @click="disableFirstLogin()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import greetings from '../../assets/greetings.json';
import { Vue3Lottie } from 'vue3-lottie';
import { setNotFirstLogin } from 'src/services/UserService';
import { useUserStore } from 'src/stores/userStore';

interface IProps {
  name: string
}

const props = defineProps<IProps>();

const userStore = useUserStore();

const show = ref(true);

const emit = defineEmits(['close']);

async function disableFirstLogin() {
  const { error } = await setNotFirstLogin();
  if(error) {
    console.error('error', error)
  }

  userStore.setUserNotFirstLogin()

  emit('close');
}
</script>
