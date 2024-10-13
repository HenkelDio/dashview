import { api } from 'src/boot/axios';
import { User } from 'src/types';

export const listUsers = async (status: string) => {
  try {
    const response = await api.get(`/users/find-all?status=${status}`);
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};

export const createNewUser = async (payload: User) => {
  try {
    const response = await api.post('/users/create-user', payload);
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};

export const updateUser = async (payload: User) => {
  try {
    const response = await api.put('/users/update-user', payload);
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};

export const deleteUser = async (document: string) => {
  try {
    const response = await api.delete(
      `/users/delete-user?document=${document}`
    );
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};

export const disableUser = async (document: string) => {
  try {
    const response = await api.delete(
      `/users/disable-user?document=${document}`
    );
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};

export const reactivateUser = async (document: string) => {
  try {
    const response = await api.post(
      `/users/reactivate-user?document=${document}`
    );
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};

export const updateUserName = async (document: string, name: string) => {
  const payload = {
    name,
  };

  try {
    const response = await api.put(
      `/users/update-user-name?document=${document}`,
      payload
    );
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};

export const getUserByDocument = async (document: string) => {
  try {
    const response = await api.get(`/users?document=${document}`);
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};

export const resetUserPassword = async (document: string) => {
  try {
    const response = await api.put(
      `/users/reset-password?document=${document}`
    );
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};

export const countUsers = async () => {
  try {
    const response = await api.get('/users/count-users');
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};

export const setNotFirstLogin = async () => {
  try {
    const response = await api.put('/users/set-not-first-login');
    return { data: response.data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};
