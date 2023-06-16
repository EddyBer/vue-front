<script setup>
import { defineComponent, ref} from 'vue';
import { clientsApi} from '../services/clients.service'
import { useAuthStore } from "../stores/auth";
import { onMounted, onBeforeMount, onActivated , onUpdated } from 'vue';
import { VDataTable } from 'vuetify/labs/VDataTable'

const authStore = useAuthStore();

defineComponent({

})

const search =ref('')
const itemsPerPage = 20
const headers = [
    { title: 'Designation', align:'start', key:'name'},
    { title: 'address', align:'center', key :'adress'},
    { title: 'phone', align:'center', key :'phone'},
    { title: 'email', align:'center', key :'email'},
    { title: 'SIRET', align:'center', key :'SIRET'}
]
const clientList = ref([])
onMounted(async() => {
    try {
        const clients = await clientsApi.getMyClients(authStore.userId)
        if (clients) {
            clientList.value.push(...clients)
            console.log(clientList)
        } else {
            throw  "Erreur lors de la récupération de vos clients"
        }
     } catch (error) {
        alert(error)
     }
})
</script>

<template>
    <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    <v-data-table
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="clientList"
        item-value="name"
        class="elevation-1 h-100"
        :search="search"
    ></v-data-table>
</template>