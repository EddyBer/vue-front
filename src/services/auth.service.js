import  axios from 'axios'

export class AuthAPIService {
    $api
    $apiPath = "auth"

    constructor() {
        this.$api = axios.create({
            baseURL: 'http://136.244.118.252:3000/',
        });
    }
    async login(dto) {
        const response = await this.$api.post(`${this.$apiPath}/login`, dto)
        return response
    }
}

export const authAPI = new AuthAPIService();