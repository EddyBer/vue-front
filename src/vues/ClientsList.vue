<script setup>
import { defineComponent, ref} from 'vue';
import { clientsApi} from '../services/clients.service'
import { useAuthStore } from "../stores/auth";
import { uselistStore } from "../stores/liste";
import { onMounted, onBeforeMount, onActivated , onUpdated } from 'vue';
import { VDataTable } from 'vuetify/labs/VDataTable'

const authStore = useAuthStore();
const listStore = uselistStore();

const dialogDelete = ref(false)
const clientToDelete = ref({})

defineComponent({

})

const search =ref('')
const itemsPerPage = 20
const headers = [
    { title: 'Designation', align:'start', key:'name'},
    { title: 'address', align:'center', key :'adress'},
    { title: 'phone', align:'center', key :'phone'},
    { title: 'email', align:'center', key :'email'},
    { title: 'SIRET', align:'center', key :'SIRET'},
    {title : 'actions' , align:'center' , key:'actions'}
]

onMounted(async() => {
    listStore.loadData('clients')
})

const closeDelete = () => {
    dialogDelete.value = false
}

const deleteItem = (item) => {
    clientToDelete.value = item
    dialogDelete.value = true
}

const deleteItemConfirm = async () => {
    const res = await clientsApi.delete(clientToDelete.value)
    if (res > 0) {
        closeDelete()
    } else {
        alert('Erreur lors de la supression')
    }
}

const clientList = ref(listStore.clientData)
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
    >
    <template v-slot:item.actions="{ item }">
        <v-icon
        size="small"
        class="me-2"
        @click="deleteItem(item.raw)"
      >mdi-delete</v-icon></template>
    </v-data-table>

    <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this client?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
</template>