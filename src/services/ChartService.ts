import { api } from 'src/boot/axios';
import { IChartCreate, IFilterCharts } from 'src/types';

export const findAllChartsByDepartment = async (status: string, payload: IFilterCharts) => {
  const params = new URLSearchParams();

  params.append('status', status);

  if (payload.department) {
    params.append('department', payload.department);
  }
  if (payload.perspective) {
    params.append('perspective', payload.perspective);
  }
  if (payload.process) {
    params.append('process', payload.process);
  }
  if (payload.responsible) {
    params.append('responsible', payload.responsible);
  }
  if (payload.year) {
    params.append('year', payload.year);
  }

  try {
    // Concatena a query string ao endpoint
    const response = await api.get(`/charts/find-all-by-department?${params.toString()}`);
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
