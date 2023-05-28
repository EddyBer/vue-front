<template>
    <Componentheader />
    <div class="container">
        <form @submit="onSubmit" >
            <div class="row">
                <div class="col">
                    <label for="name" class="form-label">Name</label>
                    <input v-model="name" class="form-control" name="name" id="name">
                    <span class="text-danger"> {{ errors.name }}</span>
                </div>
                <div class="col">
                    <label for="firstname" class="form-label">Firstname</label>
                    <input  v-model="firstname" class="form-control" name="firstname"  id="firstname">
                    <span class="text-danger"> {{ errors.firstname }}</span>
                </div>
            </div>
            <div class="form-group">
                <label for="birthdate" class="form-label">Birthdate</label>
                <input  v-model="birthdate" type="date" class="form-control" name="birthdate" id="birthdate">
                <span class="text-danger"> {{ errors.birthdate }}</span>
            </div>
            <div class="form-group">
                <label for="address" class="form-label">Address</label>
                <input  v-model="address" class="form-control" name="address" id="address">
                <span class="text-danger"> {{ errors.address }}</span>
            </div>
            <div class="form-group">
                <label for="email" class="form-label">Mail</label>
                <input v-model="email" class="form-control" name="email" id="email">
                <span class="text-danger"> {{ errors.email }}</span>
            </div>
            <div class="form-group">
                <label for="phone" class="form-label">Phone number</label>
                <input v-model="phone" class="form-control" name="phone" id="phone">
                <span class="text-danger"> {{ errors.phone }}</span>
            </div>
            <div class="row">
                <div class="col">
                    <label for="at" class="form-label">AT</label>
                    <input v-model="at" class="form-control" name="at" id="at">
                </div>
                <div class="col">
                    <label for="chargeRate" class="form-label">Charge rate</label>
                    <input v-model="chargeRate" class="form-control" name="chargeRate" id="chargeRate">
                </div>
            </div>
            <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input v-model="password" type="password" class="form-control" name="password" id="password">
                    <span class="text-danger"> {{ errors.password }}</span>
            </div>
            <div class="mb-3">
                <label for="confirmpassword" class="form-label">Confirm password</label>
                <input v-model="confirmpassword" type="password" class="form-control" name="confirmpassword" id="confirmpassword">
                <span class="text-danger"> {{ errors.confirmpassword }}</span>
            </div>
            <div class="d-grid gap-2">
                <button type="submit" class="btn btn-success">Create account</button>
            </div>
            <router-link to="/">Log In</router-link>
        </form>
    </div>

    <ComponentToast/>
</template>

<script setup>
import Componentheader from '../components/header.vue'
import ComponentToast from '../components/toast.vue'
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

const makeToast = (message) => { 
        this.$bvToast.toast(`${message}`, {
          title: 'BootstrapVue Toast',
          autoHideDelay: 5000,
          appendToast: true
        })
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
    } catch (errror) {
        const message = errror.response.data.message[0].msg
        makeToast(message)
    }
});

defineComponent({
    Componentheader,
})

</script>