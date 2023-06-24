<script setup>
import { defineComponent, ref} from 'vue';
import { clientsApi} from '../services/clients.service'
import { useAuthStore } from "../stores/auth";
import { uselistStore } from "../stores/liste";
import { onMounted, onBeforeMount, onActivated , onUpdated } from 'vue';
import { VDataTable } from 'vuetify/labs/VDataTable';
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate';
import * as yup from 'yup'

const authStore = useAuthStore();
const listStore = uselistStore();

const dialogDelete = ref(false)
const dialogEdit = ref(false)
const clientToDelete = ref({})
const clientToEdit = ref({})

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

const closeEdit = () => {
    dialogEdit.value = false
}
const editItem = (item) => {
        clientToEdit.value = item
        editedIndex.value = item.id
        name.value = item.name
        firstname.value = item.firstname
        contactname.value = item.Contactname
        adress.value = item.adress
        phone.value = item.phone
        email.value = item.email
        SIRET.value = item.SIRET
        type.value = select[item.type - 1].value
        dialogEdit.value = true
}

const deleteItem = (item) => {
    clientToDelete.value = item
    dialogDelete.value = true
}

const deleteItemConfirm = async () => {
    try {
        const res = await clientsApi.delete(clientToDelete.value)

            closeDelete()
            listStore.updateData('clients')
            alert('client deleted')
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

const select = [
    {
        title:'Privé',
        value: '1'
    },
    {
        title:'Entreprise',
        value: '2'
    }
]

const editedIndex = ref(-1)

const { handleSubmit, errors, useFieldModel } = useForm({
    validationSchema: yup.object({
        type: yup.string().required(),
        name: yup.string().required(),
        firstname: yup.string().when("type", {
            is: '1',
            then: (schema) => schema.required(),
        }),
        contactname: yup.string().when("type", {
            is: '2',
            then: (schema) => schema.required(),
        }),
        adress: yup.string().required(),
        email: yup.string().required(),
        phone:yup.string().required().matches(/^\d{3,15}$/, "Invalid phone number"),
        SIRET: yup.string().required().matches(/^\d{14}$/, "Invalid SIRET")
    })
});

const saveItemConfirm = handleSubmit(async values => {
    try {
        const id = authStore.userId
        const res = await clientsApi.update({
            id : editedIndex.value,
            name: values.name,
            Contactname: values.Contactname,
            firstname: values.firstname,
            adress: values.address,
            phone: values.phone,
            email: values.email,
            type: values.type,
            SIRET: values.SIRET,
            userId: id
        })

        closeEdit()
        listStore.updateData('clients')
        alert('client update')
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

const [ name,
        contactname,
        firstname,
        adress,
        phone,
        email,
        type,
        SIRET] = useFieldModel([
            "name",
            "contactname",
            "firstname",
            "adress",
            "phone",
            "email",
            "type",
            "SIRET",
        ])

const { clientData } = storeToRefs(listStore)
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
        :items="clientData"
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
      >mdi-delete</v-icon>
    </template>
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

    <v-dialog
          v-model="dialogEdit"
          max-width="500px"
        >
    <v-card>
            <v-card-title>
              <span class="text-h5">Edit client</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-form  @submit.prevent="saveItemConfirm"  ref="clientForm">
                <v-row>
                    <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                  <v-select label="Select" v-model="type"
                    :items="select">
                  </v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="name"
                      label="Name"
                      :error-messages="errors.name"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-if="type == '1'"
                      v-model="firstname"
                      label="Firstaname"
                      :error-messages="errors.firstname"
                    ></v-text-field>
                    <v-text-field
                      v-if="type == '2'"
                      v-model="contactname"
                      label="Contactname"
                      :error-messages="errors.contactname"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="adress"
                      label="Address"
                      :error-messages="errors.adress"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="phone"
                      label="Phone number"
                      :error-messages="errors.phone"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="email"
                      label="Email"
                      :error-messages="errors.email"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="SIRET"
                      label="SIRET"
                      :error-messages="errors.SIRET"
                    ></v-text-field>
                  </v-col>
                </v-row>
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