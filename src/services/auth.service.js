import  axios from 'axios'

export class AuthAPIService {
    $api
    $apiPath = "auth"

    constructor() {
        this.$api = axios.create({
            baseURL: 'http://127.0.0.1:3000/',
        });
    }
    async login(dto) {
        const response = await this.$api.post(`${this.$apiPath}/login`, dto)
        return response
    }
}

export const authAPI = new AuthAPIService();