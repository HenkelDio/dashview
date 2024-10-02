// boot file
import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { Router } from 'vue-router';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
    $publicApi: AxiosInstance;
  }
}

// Criação das instâncias do Axios
const api = axios.create({
  baseURL: 'https://www.mydashview.xyz',
});
const publicApi = axios.create({
  baseURL: 'https://www.mydashview.xyz',
});

// Interceptores de requisição
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RequestInterceptors(instance: AxiosInstance, store: any) {
  instance.interceptors.request.use(async (config) => {
    const token = store.state._value.user.user.token; // Ajuste conforme necessário

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });
}

function ResponseInterceptors(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  instance: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store: any,
  router: Router | { path: string }[]
) {
  instance.interceptors.response.use(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function (res: any) {
      return res;
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function (err: any) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('user');
        router.push({ path: '/' });
      }

      return Promise.reject(err);
    }
  );
}

// Função de boot
export default boot(({ app, store, router }) => {
  // Configura os interceptores
  RequestInterceptors(api, store);
  ResponseInterceptors(api, store, router);

  // Injeta as instâncias do Axios no Vue
  app.config.globalProperties.$api = api;
  app.config.globalProperties.$publicApi = publicApi;
});

// Exporta a instância publicApi
export { publicApi, api };
