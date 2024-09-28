import { api } from 'src/boot/axios';

export const listUsers = async () => {
  try {
    const response = await api.get('/users/find-all');
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};
