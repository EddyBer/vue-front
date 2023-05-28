<script setup>
import Componentheader from '../components/header.vue'
import { defineComponent } from 'vue';

defineComponent({
    Componentheader,
})

</script>

<template>
    <Componentheader/>
    <div class="container">
        <form>
            <div class="form-group">
                <label for="emailInput" class="form-label">Email</label>
                <input type="email" class="form-control" id="emailInput" aria-describedby="emailHelp">
            </div>
            <div class="mb-3">
                <label for="passwordInput" class="form-label">Password</label>
                <input type="password" class="form-control" id="passwordInput">
            </div>
            <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary">Login</button>
            </div>
            <!-- <a href="#" class="stretched-link">Create account</a> -->
            <router-link to="/signup">Create account</router-link>
        </form>
    </div>
    
    <router-view></router-view>
</template>