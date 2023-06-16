import { Clients } from '../models/clients.model';
import { middlewareAPI } from '../axios';

export class ClientsAPIService {
    $api;
    $apiPath = "CLIENTS"

    constructor() {
        this.$api = middlewareAPI
    }

    async getMyClients(userId:number):Promise<Clients[]> {
        const response = await this.$api.get(`${this.$apiPath}/${userId}`)
        const clientsAPI = response.data
        const clients:Clients[] = []

        for (const clientAPI of clientsAPI) {
            clients.push(clientAPI)
        }

        return clients
    }

    async create(dto) {
        const response = await this.$api.post(`${this.$apiPath}`, dto)
        return response.data
    }

    async update(dto) {
        const response = await this.$api.put(`${this.$apiPath}/${dto.id}`, dto)
        return response.data
    }
    
    async delete(dto) {
        const response = await this.$api.delete(`${this.$apiPath}/${dto.id}`, dto)
        return response.data
    }
}

export const clientsApi = new ClientsAPIService();