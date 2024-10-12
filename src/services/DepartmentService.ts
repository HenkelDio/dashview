import { api } from 'src/boot/axios';
import { IDepartment } from 'src/types';

export const getAllDepartments = async () => {
  try {
    const response = await api.get('/departments/find-all');
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};

export const createDepartment = async (payload: IDepartment) => {
  try {
    const response = await api.post('/departments', payload);
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
}

  export const changeStatusDepartment = async (status: string, name: string) => {
    try {
      const response = await api.put(`/departments/change-status?status=${status}&name=${name}`);
      return { data: response.data, error: null };
    } catch (e) {
      return { data: null, error: e };
  }
};
