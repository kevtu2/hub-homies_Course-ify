import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: false,
        username: '',
        u_id: -1,
    }),
    getters: {

    },
    actions: {
        login(username: string, u_id: number) {
            this.isLoggedIn = true;
            this.username = username;
            this.u_id = u_id;
        },
        logout() {
            this.isLoggedIn = false;
            this.username = '';
            this.u_id = -1;
        },
    },
});