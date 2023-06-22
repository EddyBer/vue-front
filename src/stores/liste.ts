import { defineStore } from "pinia";
import { clientsApi} from '../services/clients.service'
import { projectsApi} from '../services/projects.service'
import { InvoicesApi } from '../services/invoices.service'
import { useAuthStore } from "../stores/auth";
import { Projects } from "../models/projects.model";
import { Clients } from "../models/clients.model";
import { Invoices } from "../models/invoices.model";

export interface ListState {
    listName: string;
    clientData: Clients[];
    projectData: Projects[];
    invoicesData : Invoices[]
}

export const uselistStore = defineStore('list', {
    state: ():ListState => ({
        listName: '',
        clientData: [],
        projectData:[],
        invoicesData: []
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
                case 'invoices' :
                try {
                    const invoices = await InvoicesApi.getMyInvoices(parseInt(authStore.userId))
                    if (invoices) {
                        this.invoicesData = invoices
                    } else {
                        throw  "Erreur lors de la récupération de vos factures"
                    }
                } catch (error) {
                    alert(error)
                }
                break
            }
        },
        async updateData(list :string) {
           await this.loadData(list)
        }
    },
    persist:true,
})