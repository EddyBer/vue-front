import axios, { Axios, AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import * as _Vue from 'vue';
import { Router } from './router/index'
import { useAuthStore } from './stores/auth';

const middlewareAPI = axios.create({
    baseURL: 'http://127.0.0.1:3000/',
})

middlewareAPI.interceptors.request.use(function (config: InternalAxiosRequestConfig) {
    const authStore = useAuthStore();
    // Si on a un accessToken
    if (authStore.accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${authStore.accessToken}`
    }
    return config;
}, function (error: AxiosError) {
    return Promise.reject(error);
});

middlewareAPI.interceptors.response.use(function (response: AxiosResponse) {
    return response;
}, function (error: AxiosError<{ message?: string }>) {
    if (!error.response) {
        return;
    }

    const authStore = useAuthStore();

    // Si il y a une erreur, on vérifie qu'on a un refreshToken sous la main
    const refreshToken = authStore.refreshToken

    if (error.response.status != 401) {
        return Promise.reject(error);
    }

    const data = error.response.data;
    if(data.message === 'Unauthorized' && refreshToken !== null && error.response.config.url != 'auth/refreshToken') {
        // Si l'erreur est un code 401 (unauthorized), que le refreshtoken est renseigné et que la dernière erreur ne provient pas de la route refreshtoken
        //  Alors on tente de mettre à jour l'access token
        return _Vue.inject<Axios>('axios')?.post('auth/refreshToken', {
            refreshToken
        }).then((response: AxiosResponse) => {
            // L'appel s'est bien passé, on stocke le nouveau access_token
            authStore.refreshAccessToken(response.data.accessToken);
            // On relance l'appel qui a planté car access_token expiré !
            return _Vue.inject<Axios>('axios')?.request(error.config!);
        }).catch((error: AxiosError) => {
            // Si cet appel plante, on a déconnecté l'utilisateur pour une raison de faille de sécurité
            //  on déconnecte et on renvoi sur la page de login
            authStore.logout();
            Router.push('/login');
            return Promise.reject(error);
        });
    } else {
        return Promise.reject(error);
    }
});

export function isAxiosError(candidate: any): candidate is AxiosError<any> {
  return candidate.isAxiosError === true;
}

export { middlewareAPI }

_Vue.provide('axios',middlewareAPI)
