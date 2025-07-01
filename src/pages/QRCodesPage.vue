<template>
  <q-page class="q-pa-md q-pt-xl">
    <div class="text-h5 page-title q-mb-xl">QR Code (5 Formulários)</div>

    <q-card flat class="q-mt-sm row">
      <q-card-section
        class="flex flex-center row justify-between"
        style="width: 100%"
      >
        <div class="flex flex-center row">
          <canvas ref="qrCanvas" style="width: 100px; height: 100px"></canvas>
          <div class="text-h6 inter-medium">FORMULÁRIO NPS</div>
        </div>
        <q-btn color="primary" @click="downloadQR" :unelevated="true"
          >Baixar QR Code</q-btn
        >
      </q-card-section>
    </q-card>

    <q-card flat class="q-mt-sm row">
      <q-card-section
        class="flex flex-center row justify-between"
        style="width: 100%"
      >
        <div class="flex flex-center row">
          <canvas ref="qrCanvasReception"></canvas>
          <div class="text-h6 inter-medium">[RECEPÇÃO] FORMULÁRIO NPS</div>
        </div>
        <q-btn color="primary" @click="downloadQRReception" :unelevated="true"
          >Baixar QR Code</q-btn
        >
      </q-card-section>
    </q-card>

    <q-card flat class="q-mt-sm row">
      <q-card-section
        class="flex flex-center row justify-between"
        style="width: 100%"
      >
        <div class="flex flex-center row">
          <canvas ref="qrCanvasRh"></canvas>
          <div class="text-h6 inter-medium">FORMULÁRIO RH</div>
        </div>
        <q-btn color="primary" @click="downloadQRRh" :unelevated="true"
          >Baixar QR Code</q-btn
        >
      </q-card-section>
    </q-card>

    <q-card flat class="q-mt-sm row">
      <q-card-section
        class="flex flex-center row justify-between"
        style="width: 100%"
      >
        <div class="flex flex-center row">
          <canvas ref="qrCanvasProspecting"></canvas>
          <div class="text-h6 inter-medium">
            FORMULÁRIO CLIENTES EM PROSPECÇÃO
          </div>
        </div>
        <q-btn color="primary" @click="downloadQRProspecting" :unelevated="true"
          >Baixar QR Code</q-btn
        >
      </q-card-section>
    </q-card>

    <q-card flat class="q-mt-sm row">
      <q-card-section
        class="flex flex-center row justify-between"
        style="width: 100%"
      >
        <div class="flex flex-center row">
          <canvas ref="qrCanvasNotification"></canvas>
          <div class="text-h6 inter-medium">
            FORMULÁRIO EXPERIÊNCIA/NOTIFICAÇÃO
          </div>
        </div>
        <q-btn
          color="primary"
          @click="downloadQRNotification"
          :unelevated="true"
          >Baixar QR Code</q-btn
        >
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import QRCode from 'qrcode';

const qrCanvas = ref<HTMLCanvasElement | null>(null);
const qrLink = 'https://dashview-iota.vercel.app/form';

const qrCanvasReception = ref<HTMLCanvasElement | null>(null);
const qrLinkReception = 'https://dashview-iota.vercel.app/form?type=onlyNew';

const qrCanvasRh = ref<HTMLCanvasElement | null>(null);
const qrLinkRh = 'https://dashview-iota.vercel.app/form?type=employeeChannel';

const qrCanvasProspecting = ref<HTMLCanvasElement | null>(null);
const qrLinkProspecting =
  'https://dashview-iota.vercel.app/form?type=prospecting';

const qrCanvasNotification = ref<HTMLCanvasElement | null>(null);
const qrLinkNotification =
  'https://dashview-iota.vercel.app/form?type=notification';

onMounted(() => {
  if (qrCanvas.value) {
    QRCode.toCanvas(qrCanvas.value, qrLink, { width: 100 }, (error) => {
      if (error) console.error(error);
    });
  }

  if (qrCanvasRh.value) {
    QRCode.toCanvas(qrCanvasRh.value, qrLinkRh, { width: 100 }, (error) => {
      if (error) console.error(error);
    });
  }

  if (qrCanvasNotification.value) {
    QRCode.toCanvas(
      qrCanvasNotification.value,
      qrLinkNotification,
      { width: 100 },
      (error) => {
        if (error) console.error(error);
      }
    );
  }

  if (qrCanvasProspecting.value) {
    QRCode.toCanvas(
      qrCanvasProspecting.value,
      qrLinkProspecting,
      { width: 100 },
      (error) => {
        if (error) console.error(error);
      }
    );
  }

  if (qrCanvasReception.value) {
    QRCode.toCanvas(
      qrCanvasReception.value,
      qrLinkReception,
      { width: 100 },
      (error) => {
        if (error) console.error(error);
      }
    );
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

const downloadQRReception = () => {
  if (qrCanvasReception.value) {
    const link = document.createElement('a');
    link.href = qrCanvasReception.value.toDataURL('image/png');
    link.download = 'qrcode.png';
    link.click();
  }
};

const downloadQRRh = () => {
  if (qrCanvasRh.value) {
    const link = document.createElement('a');
    link.href = qrCanvasRh.value.toDataURL('image/png');
    link.download = 'qrcode.png';
    link.click();
  }
};

const downloadQRProspecting = () => {
  if (qrCanvasProspecting.value) {
    const link = document.createElement('a');
    link.href = qrCanvasProspecting.value.toDataURL('image/png');
    link.download = 'qrcode.png';
    link.click();
  }
};

const downloadQRNotification = () => {
  if (qrCanvasNotification.value) {
    const link = document.createElement('a');
    link.href = qrCanvasNotification.value.toDataURL('image/png');
    link.download = 'qrcode.png';
    link.click();
  }
};
</script>
