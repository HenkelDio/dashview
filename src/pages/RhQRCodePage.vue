<template>
  <q-page class="q-pa-md q-pt-xl">
    <div class="text-h5 page-title q-mb-xl">QR Code - Formulário</div>

    <q-card flat class="q-mt-sm">
      <q-card-section class="flex flex-center column">
        <div class="text-h6">Canal do colaborador</div>
        <canvas ref="qrCanvas"></canvas>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn color="primary" @click="downloadQR" :unelevated="true"
          >Baixar QR Code</q-btn
        >
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import QRCode from 'qrcode';

const qrCanvas = ref<HTMLCanvasElement | null>(null);
const qrLink = 'https://dashview-iota.vercel.app/form?type=employeeChannel';

onMounted(() => {
  if (qrCanvas.value) {
    QRCode.toCanvas(qrCanvas.value, qrLink, { width: 256 }, (error) => {
      if (error) console.error(error);
    });
  }
});

const downloadQR = () => {
  if (qrCanvas.value) {
    const link = document.createElement('a');
    link.href = qrCanvas.value.toDataURL('image/png');
    link.download = 'qrcode.png';
    link.click();
  }
};
</script>
