<script setup>
import { defineComponent, ref } from 'vue';
import { useAuthStore } from "../stores/auth";
import { uselistStore } from "../stores/liste";
import { onMounted,} from 'vue';
import { VDataTable } from 'vuetify/labs/VDataTable'
import { storeToRefs } from 'pinia'
import { InvoicesApi } from '../services/invoices.service';
import { projectsApi } from '../services/projects.service';
import * as yup from 'yup'
import { useForm } from 'vee-validate';

const listStore = uselistStore();
const authStore = useAuthStore();
defineComponent({

})

const dialogDelete = ref(false)
const InvoiceToDelete = ref({})

const dialogEdit = ref(false)
const invoiceToEdit = ref({})
const editedIndex = ref(-1)

const projectList = ref([])

const search =ref('')
const itemsPerPage = 20
const headers = [
    { title: 'Project', align:'start', key:'project.name'},
    { title: 'status', align:'center', key :'status'},
    { title: 'Payment Method', align:'center', key :'paymentMethod'},
    {title : 'actions' , align:'center' , key:'actions'}
]

onMounted(async() => {
    const projects = await projectsApi.getMyProjects(authStore.userId)
    const projectSelect = []

    for (const project of projects) {
        projectSelect.push({
            title: project.name,
            value: project.id
        })
    }
    projectList.value.push(...projectSelect)

    listStore.loadData('invoices')
})

const deleteItem = (item) => {
    InvoiceToDelete.value = item
    dialogDelete.value = true
}

const closeDelete = () => {
    dialogDelete.value = false
}

const formatDate = (date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}


const editItem = (item) => {
    invoiceToEdit.value = item
    editedIndex.value = item.id
    project.value = item.project.id
    status.value = item.status
    paymentMethod.value = item.paymentMethod
    if (item.publishingDate) {
        publishingDate.value = formatDate(new Date(item.publishingDate))
    }
    if (item.paymentDeadline) {
        paymentDeadline.value = formatDate(new Date(item.paymentDeadline))
    }
    if (item.paymentDate) {
        paymentDate.value = formatDate(new Date(item.paymentDate))
    }
    note.value = item.note
    dialogEdit.value = true
}

const closeEdit = () => {
    dialogEdit.value = false
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

const { handleSubmit, errors, useFieldModel } = useForm({
    validationSchema:yup.object({
        project: yup.string().required(),
        status:yup.string().required(),
        publishingDate: yup.date().required(),
        paymentMethod:yup.string().required(),
        paymentDeadline:yup.date().required()
    })
});

const [
    project,
    status,
    publishingDate,
    paymentMethod,
    paymentDeadline,
    paymentDate,
    note,] = useFieldModel([
        "project",
        "status",
        "publishingDate",
        "paymentMethod",
        "paymentDeadline",
        "paymentDate",
        "note",
    ])

const statusList = [
    'Edited',
    'Send',
    'Payed',
]

const paymentMethodList = [
    'Bank check',
    'Payment',
    'PayPal',
    'Other',
]

const saveItemConfirm = handleSubmit(async values => {
    try {
        const id = authStore.userId
        console.log(values)
        const res = await InvoicesApi.update({
            id : editedIndex.value,
            projectId: values.project,
            status: values.status,
            publishingDate: values.publishingDate,
            paymentMethod: values.paymentMethod,
            paymentDeadline: values.paymentDeadline,
            paymentDate: values.paymentDate ?? null,
            note:values.note,
            userId: id
        })

        closeEdit()
        listStore.updateData('invoices')
        alert('invoice update')
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


        <v-dialog v-model="dialogEdit"
        max-width="500px">
    <v-card>
            <v-card-title>
              <span class="text-h5">Edit invoice</span>
            </v-card-title>

            <v-card-text>

                <v-container width="100%">
        <v-form @submit.prevent="saveItemConfirm">
            <v-row>
                <v-select label="Project" v-model="project"
                :items="projectList"
                :error-messages="errors.project"
                ></v-select>
            </v-row>
            <v-row>
                <v-select label="Status" v-model="status"
                :items="statusList"
                :error-messages="errors.status"
                ></v-select>
            </v-row>
            <v-col>
            <v-text-field
                type="date"
                v-model="publishingDate"
                label="Publishing date"
                variant="underlined"
                autocomplete="bday"
                :error-messages="errors.publishingDate"
                required
            ></v-text-field>
            </v-col>
            <v-row>
                <v-col>
                    <v-select label="Payment method" v-model="paymentMethod"
                    :items="paymentMethodList"
                    :error-messages="errors.paymentMethod"
                    ></v-select>
                </v-col>
                <v-col>
                    <v-text-field
                        type="date"
                        v-model="paymentDeadline"
                        label="Payment deadline"
                        variant="underlined"
                        :error-messages="errors.paymentDeadline"
                        required
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-col>
                    <v-text-field
                        type="date"
                        v-model="paymentDate"
                        label="Payment date"
                        variant="underlined"
                        required
                    ></v-text-field>
                </v-col>
                <v-col>
                    <v-textarea label="Label" variant="outlined" v-model="note"></v-textarea>
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