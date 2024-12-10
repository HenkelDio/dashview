import { api, publicApi } from 'src/boot/axios';

export const getForm = async () => {
  try {
    const response = await publicApi.get('/public/form/get-form');
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};

export const sendNPS = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/nps/send-nps', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};

export const getNPS = async () => {
  try {
    const response = await api.get('/nps/get-nps');
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};
