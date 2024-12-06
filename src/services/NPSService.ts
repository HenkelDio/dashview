import { publicApi } from 'src/boot/axios';

export const getForm = async () => {
  try {
    const response = await publicApi.get('/public/form/get-form');
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};
