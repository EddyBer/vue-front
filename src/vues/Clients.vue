<script setup>
import { defineComponent } from 'vue';
import navDrawer from '../components/navDrawer.vue'
import ClientForm from './ClientForm.vue';

defineComponent({
    navDrawer,
    ClientForm
})

</script>

<template>
    <navDrawer template="clients"></navDrawer>
  </template>