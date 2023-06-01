import  axios from 'axios'
import { User } from '@/models/user.model';

export class UsersAPIService {
    $api;
    $apiPath = "USER"

    constructor() {
        this.$api = axios.create({
            baseURL: 'http://127.0.0.1:3000/',
        });
    }

    async getUsers() {
        const response      = await this.$api.get(this.$apiPath);
        const usersAPI      = response.data
        const users = [];

        for(const userAPI of usersAPI) {
            users.push(User.fromAPIResponse(userAPI));
        }

        return users;
    }

    async getUser(dto) {
        const response = await this.$api.get(`${this.$apiPath}/${dto.id}`);
        const userAPI  = response.data
        return User.fromAPIResponse(userAPI);
    }

    async resetToken(dto) {
        const response = await this.$api.put(`${this.$apiPath}/resetToken/${dto.id}`);
        const successResponse = response.data
        return successResponse.success;
    }

    async delete(dto ) {
        const response = await this.$api.delete(`${this.$apiPath}/${dto.id}`);
        const successResponse = response.data
        return successResponse.success;
    }

    async create(dto) {
        const response = await this.$api.post(`${this.$apiPath}`, dto);
        return response.data
    }

    async update(dto) {
        const response = await this.$api.put(`${this.$apiPath}/${dto.id}`, dto);
        const userAPI  = response.data
        return User.fromAPIResponse(userAPI);
    }
}

export const usersAPI = new UsersAPIService();