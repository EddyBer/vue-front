<script setup>
import Componentheader from '../components/header.vue'
import { defineComponent } from 'vue';
import { useForm } from 'vee-validate';
import { authAPI } from "../services/auth.service";
import * as yup from 'yup'
import { useRouter } from 'vue-router';
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

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
        const login = await authAPI.login({
            email: values.email,
            password: values.password,
        })

        if (!login.data.accessToken || !login.data.refreshToken || !login.data.userId) {
          throw new Error(this.$t("login.invalid_login_response").toString());
        }

        authStore.login({
          accessToken: login.data.accessToken,
          refreshToken: login.data.refreshToken,
          userId: login.data.userId,
        });

        goToMainPage()
    } catch (error) {
        const messages = error.response.data.message
        alert(messages)
    }
});

</script>

<template>
    <Componentheader/>
    <v-card class="mx-auto my-auto px-6 py-8 rounded-lg elevation-24" max-width="344" >
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