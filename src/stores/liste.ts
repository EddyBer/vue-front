import { defineStore } from "pinia";
import { clientsApi} from '../services/clients.service'
import { projectsApi} from '../services/projects.service'
import { useAuthStore } from "../stores/auth";

export interface ListState {
    listName: string;
    data: Object[];
}

export const uselistStore = defineStore('list', {
    state: ():ListState => ({
        listName: '',
        clientData: [],
        projectData:[]
    }),
    actions: {
        async loadData(list :string) {
            const authStore = useAuthStore();
            this.listName = list
            switch (list) {
                case 'clients' :
                    try {
                        const clients = await clientsApi.getMyClients(parseInt(authStore.userId))
                        if (clients) {
                            this.clientData = clients
                        } else {
                            throw  "Erreur lors de la récupération de vos clients"
                        }
                    } catch (error) {
                        alert(error)
                    }
                    break;
                case 'projects' :
                    try {
                        const projects = await projectsApi.getMyProjects(parseInt(authStore.userId))
                        if (projects) {
                            this.projectData = projects
                        } else {
                            throw  "Erreur lors de la récupération de vos clients"
                        }
                    } catch (error) {
                        alert(error)
                    }
                    break
            }
        },
        async updateData(list :string) {
           await this.loadData(list)
           console.log(this.data)
        }
    },  
    persist:true,
})