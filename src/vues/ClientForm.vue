<script setup>

import { useForm } from 'vee-validate';
import * as yup from 'yup'
import { clientsApi } from '../services/clients.service';
import { useAuthStore } from "../stores/auth";
import { uselistStore } from "../stores/liste";
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const authStore = useAuthStore();
const listStore = uselistStore();
const router = useRouter();

const { handleSubmit, errors, useFieldModel } = useForm({
    validationSchema: yup.object({
        type: yup.string().required(),
        name: yup.string().required(),
        firstname: yup.string().when("type", {
            is: '1',
            then: (schema) => schema.required(),
        }),
        Contactname: yup.string().when("type", {
            is: '2',
            then: (schema) => schema.required(),
        }),
        address: yup.string().required(),
        email: yup.string().required(),
        phone:yup.string().required().matches(/^\d{3,15}$/, "Invalid phone number"),
        SIRET: yup.string().required().matches(/^\d{14}$/, "Invalid SIRET")
    })
});

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

const [
    type,
    name,
    firstname,
    Contactname,
    address,
    email,
    phone,
    SIRET,] = useFieldModel([
        "type",
        "name",
        "firstname",
        "Contactname",
        "address",
        "email",
        "phone",
        "SIRET",
    ])

type.value = select[0].value

const onSubmit = handleSubmit(async values => {
    try {
        const id = authStore.userId

        await clientsApi.create({
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
        listStore.updateData('clients')
        console.log('Client created')
        location.reload()
    } catch (error) {
        const message = error.response.data.message[0].msg
    }
})


</script>

<template>
    <v-container width="100%">
        <v-form @submit.prevent="onSubmit" ref="clientForm">
            <v-row>
                <v-select label="Select" v-model="type"
                :items="select"
                ></v-select>
                <v-col>
                    <v-text-field v-model="name" label="Name" variant="underlined" required autocomplete="family-name"
                        :error-messages="errors.name"></v-text-field>
                </v-col>
                <v-col>
                    <v-text-field v-if="type == '1'" v-model="firstname" label="Firstname" variant="underlined"
                        autocomplete="given-name" :error-messages="errors.firstname"></v-text-field>
                    <v-text-field v-if="type == '2'" v-model="Contactname" label="Contactname" variant="underlined"
                        autocomplete="given-name" :error-messages="errors.Contactname"></v-text-field>
                </v-col>
            </v-row>
            <v-col>
                <v-text-field v-model="address" label="Address" variant="underlined" required
                    :error-messages="errors.address"></v-text-field>
            </v-col>
            <v-col>
                <v-text-field v-model="email" label="Email" variant="underlined" required
                    :error-messages="errors.email"></v-text-field>
            </v-col>
            <v-col>
                <v-row>
                    <v-col>
                        <v-text-field v-model="phone" label="Phone number" variant="underlined" required
                            :error-messages="errors.phone"></v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field v-model="SIRET" label="SIRET" variant="underlined" required
                            :error-messages="errors.SIRET"></v-text-field>
                    </v-col>
                </v-row>
            </v-col>
            <v-btn rounded="xl" type="submit" color="success">
                Create client
            </v-btn>
        </v-form>
    </v-container>
</template>