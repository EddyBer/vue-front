<script setup>

import { useForm } from 'vee-validate';
import * as yup from 'yup'
import { clientsApi } from '../services/clients.service';
import { projectsApi } from '../services/projects.service';
import { useAuthStore } from "../stores/auth";
import { uselistStore } from "../stores/liste";
import { ref, onMounted} from 'vue';

const authStore = useAuthStore();
const listStore = uselistStore();

const { handleSubmit, errors, useFieldModel } = useForm({
    validationSchema: yup.object({
        name: yup.string().required(),
        status:yup.string().required(),
        clientId:yup.number().required()
    })
});

const statusList = [
    "prospect",
    "quotation sent",
    "quotation accepted",
    "Start",
    "Finish",
    "Cancel"
]

const clientList = ref([])

const [
    name,
    status,
    clientId,] = useFieldModel([
        "name",
        "status",
        "clientId",
    ])

onMounted(async()=> {
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

const onSubmit = handleSubmit(async values => {
    try {
        const id = authStore.userId

        await projectsApi.create({
            name: values.name,
            status: values.status,
            clientId: values.clientId,
            userId:id
        })

        listStore.updateData('projects')
        alert('project Created')
        location.reload()
    } catch (error) {
        const message = error.response.data.message[0].msg
    }
})


</script>

<template>
    <v-container width="100%">
        <v-form @submit.prevent="onSubmit">
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
                <v-select label="Client" v-model="clientId"
                :items="clientList"
                :error-messages="errors.clientId"
                ></v-select>
            </v-col>
            <v-btn rounded="xl" type="submit" color="success">
                Create client
            </v-btn>
        </v-form>
    </v-container>
</template>