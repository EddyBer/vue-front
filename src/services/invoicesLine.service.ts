import { InvoicesLines } from '../models/invoicesLines.model';
import { middlewareAPI } from '../axios';

export class InvoicesLineAPIService {
    $api;
    $apiPath = "LINES"

    constructor() {
        this.$api = middlewareAPI
    }

    async getMyInvoicesLine(invoiceId:number):Promise<InvoicesLines[]> {
        const response = await this.$api.get(`${this.$apiPath}/${invoiceId}`)
        const invoicesLineAPI = response.data
        const inovicesLines:InvoicesLines[] = []

        for (const clientAPI of invoicesLineAPI) {
            inovicesLines.push(clientAPI)
        }

        return inovicesLines
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


export const InvoicesLinesApi = new InvoicesLineAPIService();