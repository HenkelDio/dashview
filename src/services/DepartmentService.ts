import { api } from 'src/boot/axios';
import { IDepartmentCreate } from 'src/types';

export const getAllDepartments = async (status: string) => {
  try {
    const response = await api.get(`/departments/find-all?status=${status}`);
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};

export const createDepartment = async (payload: IDepartmentCreate) => {
  try {
    const response = await api.post('/departments', payload);
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
}

  export const changeStatusDepartment = async (status: string, name: string) => {
    const headers = {
      name
    }

    try {
      const response = await api.put(`/departments/change-status?status=${status}`, {}, {headers});
      return { data: response.data, error: null };
    } catch (e) {
      return { data: null, error: e };
  }
};
