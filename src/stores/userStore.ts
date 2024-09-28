import { defineStore } from 'pinia';
import { User } from 'src/types';

export const useUserStore = defineStore('user', {
  state: () => {
    const storedUser = localStorage.getItem('user');
    return {
      user: storedUser ? JSON.parse(storedUser) : ({} as User),
    };
  },
  getters: {},
  actions: {
    setUser(user: User) {
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user)); // Armazena o usuário no localStorage
    },
    clearUser() {
      this.user = {} as User;
      localStorage.removeItem('user'); // Remove o usuário do localStorage
    },
  },
});
