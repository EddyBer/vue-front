<script setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup'
import { InvoicesApi } from '../services/invoices.service';
import { InvoicesLinesApi } from '../services/invoicesLine.service';
import { useAuthStore } from "../stores/auth";
import { uselistStore } from "../stores/liste";
import { useRouter } from 'vue-router';
import { ref, onMounted, watch } from 'vue';
import { VDataTable } from 'vuetify/labs/VDataTable'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore();
const listStore = uselistStore();
const router = useRouter();

const invoiceList = ref([])

const selectInvoice = ref('')
const dialogCreate  = ref(false)
const InvoiceId = ref()

const closeCreate = () => {
    dialogCreate.value = false
}

const OpenForm = (item) => {
    InvoiceId.value = item
    dialogCreate.value = true
}

const itemsPerPage = 20
const headers = [
    { title: 'Libelle', align:'start', key:'libelle'},
    { title: 'Price', align:'center', key :'price'},
    { title: 'Quantity', align:'center', key :'quantity'},
    {title : 'actions' , align:'center' , key:'actions'}
]

onMounted(async()=> {
    const invoices = await InvoicesApi.getMyInvoices(authStore.userId)
    const invoicesSelect = []

    for (const invoice of invoices) {
        invoicesSelect.push({
            title: ` ${invoice.project.name}  - ${invoice.id}`,
            value: invoice.id
        })
    }
    invoiceList.value.push(...invoicesSelect)
    selectInvoice.value = invoiceList.value[0].value
    listStore.loadData('invoiceLine',selectInvoice.value)
})

const { handleSubmit, errors, useFieldModel } = useForm({
    validationSchema: yup.object({
        libelle: yup.string().required(),
        quantity: yup.number().min(0).required(),
        price: yup.number().min(0).required()
    })
});

const [ libelle,
        quantity,
        price,] = useFieldModel([
            "libelle",
            "quantity",
            "price",
        ])

const addLine = handleSubmit(async values => {
    try {
        const id = authStore.userId
        const res = await InvoicesLinesApi.create({
            libelle: values.libelle,
            quantity: values.quantity,
            price: values.price,
            invoicesId : selectInvoice.value,
            userId: id
        })

        closeCreate()
        listStore.updateData('invoiceLine',selectInvoice.value)
        alert('line create')
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

const loadLine = (value) => {
    listStore.updateData('invoiceLine',value)
}

watch(selectInvoice, (newInvoice) => {
    loadLine(newInvoice)
})

const { invoicesLineData } = storeToRefs(listStore)

</script>

<template>
    <v-container width="100%">
        <v-select label="Invoices"
                v-model="selectInvoice"
                @input="lodaLine"
                :items="invoiceList">
        </v-select>

        <v-btn color="blue-darken-1" variant="outlined" @click="OpenForm(selectInvoice)">Add Line</v-btn>

    <v-data-table
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="invoicesLineData"
        item-value="name"
        class="elevation-1 h-100">
    <template v-slot:item.actions="">
        <v-icon
        size="small"
        class="me-2"
        @click="deletLine()"
      >mdi-delete</v-icon></template>
    </v-data-table>

    <v-dialog v-model="dialogCreate" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Add line</v-card-title>
            <v-card-text>
                <v-container>
                    <v-form  @submit.prevent="saveItemConfirm">
                        <v-col>
                    <v-text-field
                      v-model="libelle"
                      label="Libelle"
                      :error-messages="errors.libelle"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="quantity"
                      label="Quantity"
                      :error-messages="errors.quantity"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="price"
                      label="Price"
                      :error-messages="errors.price"
                    ></v-text-field>
                  </v-col>
                    </v-form>
                </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeCreate">Cancel</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="addLine">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
    </v-container>
</template>