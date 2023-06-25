<script setup>
import { defineComponent, ref } from 'vue';
import { useAuthStore } from "../stores/auth";
import { uselistStore } from "../stores/liste";
import { onMounted,} from 'vue';
import { VDataTable } from 'vuetify/labs/VDataTable'
import { storeToRefs } from 'pinia'
import { InvoicesApi } from '../services/invoices.service';

const listStore = uselistStore();
const authStore = useAuthStore();
defineComponent({

})

const dialogDelete = ref(false)
const InvoiceToDelete = ref({})

const search =ref('')
const itemsPerPage = 20
const headers = [
    { title: 'Project', align:'start', key:'project.name'},
    { title: 'status', align:'center', key :'status'},
    { title: 'Payment Method', align:'center', key :'paymentMethod'},
    {title : 'actions' , align:'center' , key:'actions'}
]

onMounted(async() => {
    listStore.loadData('invoices')
})

const deleteItem = (item) => {
    InvoiceToDelete.value = item
    dialogDelete.value = true
}

const closeDelete = () => {
    dialogDelete.value = false
}

const deleteItemConfirm = async () => {
    try {
        const res = await InvoicesApi.delete(InvoiceToDelete.value)

        closeDelete()
        listStore.updateData('invoices')
        alert('project deleted')
    } catch (error) {
        const DisplayMessage = []
        const messages = error.response.data.message
        messages.forEach(message => {
            DisplayMessage.push(`${message.param} : ${message.msg}`)
        });
        closeDelete()
        alert(DisplayMessage)
    }
}

const { invoicesData } = storeToRefs(listStore)

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
        :items="invoicesData"
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
            <v-card-title class="text-h5">Are you sure you want to delete this project ?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
</template>