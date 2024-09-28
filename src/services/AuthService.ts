import { publicApi } from 'src/boot/axios';

export const definePassword = async (
  password: string,
  token: string | undefined
) => {
  const body = {
    password,
  };

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await publicApi.post('/auth/define-password', body, {
      headers,
    });
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};

export const login = async (email: string, password: string) => {
  const body = {
    email,
    password,
  };

  try {
    const response = await publicApi.post('/auth/login', body);
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};
