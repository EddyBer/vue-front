<script setup>
import Componentheader from '../components/header.vue'
import { defineComponent } from 'vue';
import { useForm } from 'vee-validate';
import { authAPI } from "../services/auth.service";
import * as yup from 'yup'
import { useRouter } from 'vue-router';

const router = useRouter();

const { handleSubmit, errors, useFieldModel } = useForm({
  validationSchema:yup.object({
    password: yup.string().required(),
    email: yup.string().required().email(),
  })
});

const [
  email,
  password,] = useFieldModel([
  "email",
  "password"
]);

defineComponent({
    Componentheader,
})

const goToMainPage = () => {
    router.push({ path: "/home" });
}

const onSubmit = handleSubmit(async values => {
    try {
        await authAPI.login({
            email: values.email,
            password: values.password,
        })

        goToMainPage()
    } catch (error) {
        //const message = errror.response.data.message[0].msg
        alert(error)
    }
});

</script>

<template>
    <Componentheader/>
    <v-card class="mx-auto px-6 py-8 mt-16" max-width="344" >
    <v-container>
        <v-form @submit.prevent="onSubmit">
            <v-text-field
            v-model="email"
            label="Email"
            variant="underlined"
            required
            :error-messages="errors.email"
          ></v-text-field>
          <v-text-field
            type="password"
            v-model="password"
            label="Password"
            variant="underlined"
            required
            :error-messages="errors.password"
          ></v-text-field>
          <v-btn
          block
          color="success"
          size="large"
          type="submit"
          variant="elevated"
        >
          Log In
        </v-btn>
            <router-link to="/signup">
                <v-btn
                variant="plain">
                Create account
                </v-btn>
            </router-link>
        </v-form>
    </v-container>
</v-card>
</template>