import { defineStore } from "pinia";
import { AppAuth } from '../models/app-auth.model';

export interface AuthState {
    accessToken: string;
    refreshToken: string;
    userId: string;
}

export const useAuthStore = defineStore('auth', {
    state: ():AuthState => ({
        accessToken: '',
        refreshToken: '',
        userId: '',
    }),
    actions: {
        login(payload: AppAuth) {
            if (payload.accessToken && payload.refreshToken && payload.userId) {
                this.accessToken    = payload.accessToken;
                this.refreshToken   = payload.refreshToken;
                this.userId         = payload.userId;
            }
        },
        logout() {
            this.$reset();
        },
        refreshAccessToken(accessToken: string) {
            this.accessToken = accessToken;
        }
    },
    persist:true
})