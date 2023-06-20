<script setup lang="ts">
import { defineComponent } from 'vue'
import InvoiceForm from '../vues/InvoiceForm.vue'
import Dashboard from '../vues/Dashboard.vue'
import clientsHeader from './clientsHeader.vue'
import Projects from '../vues/Projects.vue'
import ProfileForm from '../vues/ProfileForm.vue'
import ProjectsHeader from './ProjectsHeader.vue'
import invoicesHeader from './invoicesHeader.vue'

defineComponent({
    clientsHeader,
    InvoiceForm,
    Dashboard,
    Projects,
    ProfileForm,
    ProjectsHeader,
    invoicesHeader,
})

const items = [
    {
        title: 'Dashboard',
        value: 1,
        link:'/home'
    },
    {
        title: 'Clients',
        value: 2,
        link:'/clients'
    },
    {
        title:'Projects',
        value: 3,
        link:'/projects'
    },
    {
        title: 'Invoices',
        value: 4,
        link:'/invoices'
    },
    {
        title:'My profile',
        value: 5,
        link:'/profile'
    }
];

const props = defineProps({
    template: String
})

</script>

<template>
    <v-card style="height: 100%;">
      <v-layout style="height: 100%;">
        <v-app-bar>
            <v-app-bar-title>
                My CRM
            </v-app-bar-title>
            <v-btn
            variant="elevated"
            rounded="lg"
            color="warning"
            to="/logout">
                Logout
            </v-btn>
        </v-app-bar>
  
        <v-navigation-drawer permanent >
            <v-list>
                <v-list-item
                active-color="primary"
                v-for="(item, i) in items" 
                :key="i" 
                :to="item.link" 
                link>
                    <v-list-item-title>{{item.title}}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <!-- <v-main style="min-height: 300px;"> -->
        <v-main class="d-flex w-100">
            <div class="w-100 h-100" v-if="template == 'clients'">
                <clientsHeader/>
            </div>

            <div class="w-100 h-100" v-else-if="template === 'invoices'"> 
                <invoicesHeader/>
            </div>

            <div  v-else-if="template === 'dashboard'"> 
                <Dashboard/>
            </div>
            <div class="w-100 h-100"  v-else-if="template === 'projects'">
                <ProjectsHeader/>
            </div>
            <div class="w-100 h-100 overflow-auto" v-else-if="template === 'profile'">
                <ProfileForm/>
            </div>
        </v-main>
      </v-layout>
    </v-card>
    <router-view />
</template>