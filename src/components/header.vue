<script setup>
    import IconSupport from './icons/IconSupport.vue';
</script>

<template>
    <v-app-bar
    class="px-5"
    :elevation="2" 
    rounded >
        <IconSupport/>
        <v-app-bar-title>
            My CRM
        </v-app-bar-title>
    </v-app-bar>
</template>