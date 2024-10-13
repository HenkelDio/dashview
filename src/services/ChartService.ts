import { api } from 'src/boot/axios';
import { IChartCreate } from 'src/types';

export const findAllChartsByDepartment = async (status: string) => {
  try {
    const response = await api.get(`/charts/find-all-by-department?status=${status}`);
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};

export const createChart = async (payload: IChartCreate) => {
  try {
    const response = await api.post('/charts/create-chart', payload);
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
}

export const changeStatusChart = async (status: string, id: string) => {
  try {
    const response = await api.put(`/charts/change-status?status=${status}&id=${id}`);
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};

export const findChartById = async (id?: string) => {
  try {
    const response = await api.get(`/charts/find-by-id?id=${id}`);
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};

export const updateChart = async (payload: IChartCreate) => {
  try {
    const response = await api.put('/charts/update-chart', payload);
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
}
