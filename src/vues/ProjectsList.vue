<script setup>
import { defineComponent, ref} from 'vue';
import { useAuthStore } from "../stores/auth";
import { uselistStore } from "../stores/liste";
import { clientsApi} from '../services/clients.service'
import { onMounted,} from 'vue';
import { VDataTable } from 'vuetify/labs/VDataTable'
import { storeToRefs } from 'pinia'
import { projectsApi } from '../services/projects.service';
import { useForm } from 'vee-validate';
import * as yup from 'yup'

const authStore = useAuthStore();
const listStore = uselistStore();

defineComponent({

})
const dialogDelete = ref(false)
const ProjecetToDelete = ref({})
const dialogEdit = ref(false)
const clientToEdit = ref({})

const search =ref('')
const itemsPerPage = 20
const headers = [
    { title: 'Name', align:'start', key:'name'},
    { title: 'status', align:'center', key :'status'},
    {title : 'actions' , align:'center' , key:'actions'}
]

onMounted(async() => {
    listStore.loadData('projects')

    const clients = await clientsApi.getMyClients(authStore.userId)
    const clientSelect = []

    for (const client of clients) {
        clientSelect.push({
            title: client.name,
            value: client.id
        })
    }
    clientList.value.push(...clientSelect)
})

const deleteItem = (item) => {
    ProjecetToDelete.value = item
    dialogDelete.value = true
}

const closeDelete = () => {
    dialogDelete.value = false
}

const deleteItemConfirm = async () => {
    try {
        const res = await projectsApi.delete(ProjecetToDelete.value)

        closeDelete()
        listStore.updateData('projects')
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

const editedIndex = ref(-1)

const editItem = (item) => {
    clientToEdit.value = item
    editedIndex.value = item.id
    name.value = item.name
    status.value = item.status
    client.value = clientList.value[item.clientId - 1].title

    dialogEdit.value = true
}

const closeEdit = () => {
    dialogEdit.value = false
}

const { handleSubmit, errors, useFieldModel } = useForm({
    validationSchema: yup.object({
        name: yup.string().required(),
        status: yup.string().required(),
        client:yup.string().required(),
    })
});

const clientList = ref([])

const saveItemConfirm = handleSubmit(async values => {
    try {
        const id = authStore.userId
        const res = await projectsApi.update({
            id : editedIndex.value,
            name: values.name,
            status : values.status,
            client : values.client,
            userId: id
        })

        closeEdit()
        listStore.updateData('projects')
        alert('project update')
    } catch (error) {
        const DisplayMessage = []
        const messages = error.response.data.message
        messages.forEach(message => {
            DisplayMessage.push(`${message.param} : ${message.msg}`)
        });
        closeEdit()
        alert(DisplayMessage)
    }
})

const statusList = [
    "prospect",
    "quotation sent",
    "quotation accepted",
    "Start",
    "Finish",
    "Cancel"
]


const [
    name,
    status,
    client,
] = useFieldModel([
    'name',
    'status',
    'client'
])

const { projectData } = storeToRefs(listStore)
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
        :items="projectData"
        item-value="name"
        class="elevation-1 h-100"
        :search="search"
    >
    <template v-slot:item.actions="{ item }">
        <v-icon
        size="small"
        class="me-2"
        @click="editItem(item.raw)"
        >mdi-pencil</v-icon>
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


        <v-dialog
          v-model="dialogEdit"
          max-width="500px"
        >
    <v-card>
            <v-card-title>
              <span class="text-h5">Edit project</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-form  @submit.prevent="saveItemConfirm"  ref="clientForm">
                    <v-col>
                <v-text-field v-model="name" label="Name" variant="underlined" required autocomplete="family-name"
                    :error-messages="errors.name"></v-text-field>
            </v-col>
            <v-col>
                <v-select label="Status" v-model="status"
                :items="statusList"
                :error-messages="errors.status"
                ></v-select>
            </v-col>
            <v-col>
                <v-select label="Client" v-model="client"
                :items="clientList"
                :error-messages="errors.client"
                ></v-select>
            </v-col>
                <v-btn
                color="blue-darken-1"
                variant="outlined"
                type="submit">
                Save
              </v-btn>
            </v-form>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue-darken-1"
                variant="outlined"
                @click="closeEdit"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
</template>