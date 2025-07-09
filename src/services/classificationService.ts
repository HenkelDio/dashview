import { api } from 'src/boot/axios';

export const getAllClassification = async (status: string) => {
  try {
    const response = await api.get(`/classification/list?status=${status}`);
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};

export const createClassification = async (payload: {
  description: string;
  department: { id: string };
  color: null | string;
}) => {
  try {
    const response = await api.post('/classification/create', payload);
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};

export const updateClassification = async (payload: {
  description: string;
  department: { id: string | undefined };
  id: string | undefined;
  color: null | string;
}) => {
  try {
    const response = await api.put('/classification/update', payload);
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};

export const changeStatusClassification = async (
  id: string,
  status: string
) => {
  try {
    const response = await api.put(
      `/classification/change-status?id=${id}&status=${status}`
    );
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};

export const saveAnswerClassification = async (payload: {
  answerId: string | undefined;
  classificationId: string | null;
}) => {
  try {
    const response = await api.put(
      '/classification/save-answer-classification',
      payload
    );
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};
