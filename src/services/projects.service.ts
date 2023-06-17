import { Projects } from '../models/projects.model';
import { middlewareAPI } from '../axios';

export class ProjectsAPIService {
    $api;
    $apiPath = "PROJECTS"

    constructor() {
        this.$api = middlewareAPI
    }

    async getMyProjects(userId:number):Promise<Projects[]> {
        const response = await this.$api.get(`${this.$apiPath}/${userId}`)
        const projectsAPI = response.data
        const projects:Projects[] = []

        for (const clientAPI of projectsAPI) {
            projects.push(clientAPI)
        }
        
        return projects
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

export const projectsApi = new ProjectsAPIService();