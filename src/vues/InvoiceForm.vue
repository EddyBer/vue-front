<script setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup'
import { InvoicesApi } from '../services/invoices.service';
import { projectsApi } from '../services/projects.service';
import { useAuthStore } from "../stores/auth";
import { uselistStore } from "../stores/liste";
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

const authStore = useAuthStore();
const listStore = uselistStore();
const router = useRouter();

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

paymentMethod.value = paymentMethodList[0]

const projectList = ref([])


onMounted(async()=> {
    const projects = await projectsApi.getMyProjects(authStore.userId)
    const projectSelect = []

    for (const project of projects) {
        projectSelect.push({
            title: project.name,
            value: project.id
        })
    }
    projectList.value.push(...projectSelect)
})

status.value = statusList[0]

const onSubmit = handleSubmit(async values => {
    try {
        const id = authStore.userId

        await InvoicesApi.create({
            projectId: values.project,
            status: values.status,
            publishingDate: values.publishingDate,
            paymentMethod: values.paymentMethod,
            paymentDeadline: values.paymentDeadline,
            paymentDate: values.paymentDate ?? null,
            userId: id
        })
        listStore.updateData('invoices')
        location.reload()
    } catch (error) {
        const message = error.response.data.message[0].msg
    }
})

</script>

<template>
    <v-container width="100%">
        <v-form @submit.prevent="onSubmit" id="invoiceForm">
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
            <v-btn rounded="xl" type="submit" color="success">
                Create invoice
            </v-btn>
        </v-form>
    </v-container>
</template>