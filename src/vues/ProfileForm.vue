<script setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup'
import { onMounted } from 'vue';
import { useAuthStore } from "../stores/auth";
import { usersAPI } from '../services/users.service';

const authStore = useAuthStore();


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

onMounted(async() => {
    try {
        const user = await usersAPI.getUser(authStore.userId)

        if (user) {
            const data = user.data
            name.value = data.name
            firstname.value = data.firstname
            let date = new Date(data.birthdate)
            date = formatDate(date)
            birthdate.value = date
            address.value = data.adress
            email.value = data.email
            phone.value = data.phone
            at.value = data.AT
            chargeRate.value = data.chargesRate
        } else {
            throw  "Erreur lors de la récupération de vos données"
        }
        
     } catch (error) {
        alert(error)
     }
    
})

const { handleSubmit, errors, useFieldModel } = useForm({
    validationSchema:yup.object({
        email: yup.string().required().email(),
        name: yup.string().required(),
        firstname: yup.string().required(),
        birthdate: yup.date().required(),
        address: yup.string().required(),
        phone: yup.string().required(),
    })
});

const [
    name,
    firstname,
    birthdate,
    address,
    email,
    phone,
    at,
    chargeRate,] = useFieldModel([
    "name",
    "firstname",
    "birthdate",
    "address",
    "email",
    "phone",
    "at",
    "chargeRate",
    "password",
    "confirmpassword",
])

</script>

<template>
    <v-container width="100%">
        <v-form @submit.prevent="onSubmit">
            <v-row>
                <v-col>
                <v-text-field
                    v-model="name"
                    label="Name"
                    variant="underlined"
                    required
                    autocomplete="family-name"
                    :error-messages="errors.name"
                ></v-text-field>
                </v-col>
                <v-col>
                <v-text-field
                    v-model="firstname"
                    label="Firstname"
                    variant="underlined"
                    required
                    autocomplete="given-name"
                    :error-messages="errors.firstname"
                ></v-text-field>
                </v-col>
            </v-row>
            <v-col>
            <v-text-field
                type="date"
                v-model="birthdate"
                label="Birthdate"
                variant="underlined"
                autocomplete="bday"
                required
            ></v-text-field>
            </v-col>
            <v-col>
                <v-text-field
                    v-model="address"
                    label="Address"
                    variant="underlined"
                    required
                    :error-messages="errors.address"
                ></v-text-field>
            </v-col>
            <v-col>
                <v-text-field
                    v-model="email"
                    label="Email"
                    variant="underlined"
                    required
                    :error-messages="errors.email"
                ></v-text-field>
            </v-col>
            <v-col>
                <v-text-field
                    v-model="phone"
                    label="Phone number"
                    variant="underlined"
                    required
                    :error-messages="errors.phone"
                ></v-text-field>
            </v-col>
            <v-row>
                <v-col>
                <v-text-field
                    v-model="at"
                    label="AT"
                    variant="underlined"
                    required
                    :error-messages="errors.at"
                ></v-text-field>
                </v-col>
                <v-col>
                <v-text-field 
                    v-model="chargeRate"
                    label="Charge Rate"
                    variant="underlined"
                    required
                    :error-messages="errors.chargeRate"
                ></v-text-field>
                </v-col>
            </v-row>
            <v-btn
                rounded="xl"
                type="submit"
                color="success">
                Update profile
            </v-btn>
        </v-form>
    </v-container>
</template>