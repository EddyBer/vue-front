import { middlewareAPI } from '../axios';

export class UsersAPIService {
    $api;
    $apiPath = "USER"

    constructor() {
        this.$api = middlewareAPI
    }

    async getUser(id) {
        const response = await this.$api.get(`${this.$apiPath}/${id}`);
        return response;
    }

    async resetToken(dto) {
        const response = await this.$api.put(`${this.$apiPath}/resetToken/${dto.id}`);
        const successResponse = response.data
        return successResponse.success;
    }

    async delete(dto ) {
        const response = await this.$api.delete(`${this.$apiPath}/${dto.id}`);
        return response.data
      
    }

    async create(dto) {
        const response = await this.$api.post(`${this.$apiPath}`, dto);
        return response.data
    }

    async update(dto) {
        const response = await this.$api.put(`${this.$apiPath}/${dto.id}`, dto);
        return response.data
    }
}

export const usersAPI = new UsersAPIService();