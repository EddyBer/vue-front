<script setup>
import { defineComponent, ref} from 'vue';
import { useAuthStore } from "../stores/auth";
import { uselistStore } from "../stores/liste";
import { onMounted,} from 'vue';
import { VDataTable } from 'vuetify/labs/VDataTable'

const authStore = useAuthStore();
const listStore = uselistStore();

defineComponent({

})

const search =ref('')
const itemsPerPage = 20
const headers = [
    { title: 'Name', align:'start', key:'name'},
    { title: 'status', align:'center', key :'status'},
]

onMounted(async() => {
    listStore.loadData('projects')
})

const projectList = ref(listStore.projectData)
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
        :items="projectList"
        item-value="name"
        class="elevation-1 h-100"
        :search="search"
    >
    </v-data-table>
</template>