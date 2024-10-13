import { defineStore } from 'pinia';
import { User } from 'src/types';

export const useUserStore = defineStore('user', {
  state: () => {
    const storedUser = localStorage.getItem('user');
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    return {
      isAuthenticated: isAuthenticated ? true : false,
      user: storedUser ? JSON.parse(storedUser) as User : ({} as User),
    };
  },
  getters: {},
  actions: {
    setUser(user: User) {
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', JSON.stringify('true'));
    },
    setUserNotFirstLogin() {
      this.user.permissions.firstLogin = false;
      this.user = this.user;
      localStorage.setItem('user', JSON.stringify(this.user));
    },
    clearUser() {
      this.user = {} as User;
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      this.isAuthenticated = false;
    },
  },
});
