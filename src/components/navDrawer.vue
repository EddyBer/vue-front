<script setup>
import { defineComponent } from 'vue';

defineComponent({
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
        title: 'Invoices',
        value: 3,
        link:'/invoices'
    }
];

</script>

<template>
    <v-card style="height: 100%;">
      <v-layout style="height: 100%;">
        <v-app-bar title="My CRM"></v-app-bar>
  
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

        <v-main style="min-height: 300px;">
        </v-main>
      </v-layout>
    </v-card>
    <router-view />
</template>