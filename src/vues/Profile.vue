<script setup>
import { defineComponent } from 'vue';
import navDrawer from '../components/navDrawer.vue'
import ProfileForm from './ProfileForm.vue';
defineComponent({
    navDrawer,
})

</script>

<template>
    <navDrawer template="profile"/>
</template>