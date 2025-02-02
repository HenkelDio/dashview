import { api, publicApi } from 'src/boot/axios';

export const getForm = async () => {
  try {
    const response = await publicApi.get('/public/form/get-form');
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const saveAnswer = async (payload: any, token: string | undefined) => {
  try {
    let url = '/public/form/save-answer';
    if (token) {
      url = `${url}?token=${token}`;
    }

    const response = await publicApi.post(url, payload);
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

export const getNPS = async (startDate: number, endDate: number) => {
  const headers = {
    startDate,
    endDate,
  };

  try {
    const response = await api.get('/nps/get-nps', { headers });
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};

export const countAnswers = async (
  startDate: number,
  endDate: number,
  departmentId: string
) => {
  const headers = {
    startDate,
    endDate,
    departmentId,
  };

  try {
    const response = await api.get('/nps/count-answers', { headers });
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};

export const countFeedbackReturns = async () => {
  try {
    const response = await api.get('/nps/count-feedback-returns');
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};

export const getAnswers = async (
  sortBy: string,
  npsId: string,
  startDate: number,
  endDate: number
) => {
  const headers = {
    startDate,
    endDate,
  };

  try {
    const response = await api.get(
      `/nps/get-answers?sortBy=${sortBy}&npsId=${npsId}`,
      { headers }
    );
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};

export const loadScoreDepartments = async (
  startDate: number,
  endDate: number
) => {
  const headers = {
    startDate,
    endDate,
  };

  try {
    const response = await api.get('/nps/get-score-departments', { headers });
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};

export const getAllAnswers = async (
  startDate: number,
  endDate: number,
  departmentId: string,
  pageNumber: number
) => {
  const headers = {
    startDate,
    endDate,
    departmentId,
  };

  try {
    const response = await api.get(
      `/nps/get-all-answers?pageNumber=${pageNumber}`,
      { headers }
    );
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};

export const setRequestAnswered = async (answerId: string) => {
  const headers = {
    answerId,
  };

  try {
    const response = await api.put(
      '/nps/set-request-answered',
      {},
      { headers }
    );
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};
