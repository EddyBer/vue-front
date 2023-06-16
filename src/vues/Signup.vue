<template>
    <Componentheader />
    <div class="d-flex align-center flex-column">
    <v-card 
    title="Sign up"
    width="50%"
    class=" rounded-lg my-16 mx-auto">
    <v-container>
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
            <v-col>
                <v-text-field
                    type="password"
                    v-model="password"
                    label="Password"
                    variant="underlined"
                    required
                    :error-messages="errors.password"
                ></v-text-field>
            </v-col>
            <v-col>
                <v-text-field
                    type="password"
                    v-model="confirmpassword"
                    label="Confirm password"
                    variant="underlined"
                    required
                    :error-messages="errors.confirmpassword"
                ></v-text-field>
            </v-col>
            <v-btn
                rounded="xl"
                type="submit"
                color="success">
                Create account
            </v-btn>
            <router-link to="/">
                <v-btn
                variant="plain">
                Log In
                </v-btn>
            </router-link>
        </v-form>
    </v-container>
    </v-card>
    </div>
</template>

<script setup>
import Componentheader from '../components/header.vue'
import { usersAPI } from "../services/users.service";
import { useForm } from 'vee-validate';
import * as yup from 'yup'
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const { handleSubmit, errors, useFieldModel } = useForm({
    validationSchema:yup.object({
        password: yup.string().required().min(10).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{10,}$/,"Invalid password"),
        confirmpassword: yup.string().required()
                .oneOf([yup.ref('password')], 'Passwords do not match'),
        email: yup.string().required().email(),
        name: yup.string().required(),
        firstname: yup.string().required(),
        birthdate: yup.date().required(),
        address: yup.string().required(),
        phone: yup.string().required(),
    }),initialValues:{
        at:0,
        chargeRate:0
    }
});

const [
    name,
    firstname,
    birthdate,
    address,
    email,
    phone,
    at,
    chargeRate,
    password,
    confirmpassword,] = useFieldModel([
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

const goBack = () => {
    router.push({ path: "/" });
}

const onSubmit = handleSubmit(async values => {
    try {
        await usersAPI.create({
            name: values.name,
            firstname: values.firstname,
            birthdate: values.birthdate,
            adress: values.address,
            email: values.email,
            phone: values.phone,
            AT: values.at,
            chargesRate: values.chargeRate,
            password: values.password
        })

        alert('user Created')

        goBack()
    } catch (error) {
        const message = error.response.data.message[0].msg
    }
});

defineComponent({
    Componentheader,
})

</script>