import { api } from 'src/boot/axios';
import { IPerspectiveCreate } from 'src/types';

export const findAllPerspectives = async (status: string) => {
  try {
    const response = await api.get(`/modules/perspective/find-all?status=${status}`);
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};

export const findPerspectiveById = async (id?: string) => {
  try {
    const response = await api.get(`/modules/perspective/find-by-id?id=${id}`);
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};

export const createPerspective = async (payload: IPerspectiveCreate) => {
  try {
    const response = await api.post('/modules/perspective/create', payload);
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
}

export const changeStatus = async (id: string, status: string, type: string) => {

  const headers = {
    id,
    type
  }

  try {
    const response = await api.put(`/modules/change-status?status=${status}`, {}, {headers});
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
}
