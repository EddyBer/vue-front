import { Invoices } from '../models/invoices.model';
import { middlewareAPI } from '../axios';

export class InvoicesAPIService {
    $api;
    $apiPath = "INVOICES"

    constructor() {
        this.$api = middlewareAPI
    }

    async getMyInvoices(userId:number):Promise<Invoices[]> {
        const response = await this.$api.get(`${this.$apiPath}/${userId}`)
        const invoicesAPI = response.data
        const inovices:Invoices[] = []

        for (const clientAPI of invoicesAPI) {
            inovices.push(clientAPI)
        }

        return inovices
    }

    async getLastInvoice(): Promise<Invoices> {
        return await this.$api.get(`${this.$apiPath}/last`)
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

export const InvoicesApi = new InvoicesAPIService();