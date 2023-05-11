<script setup>
    import Componentheader from '../components/header.vue'
</script>

<template>
    <Componentheader/>
    <div class="container">
        <form>
            <div class="row">
                <div class="col">
                    <label for="nameInput" class="form-label">Name</label>
                    <input type="text" class="form-control" id="nameInput" aria-describedby="emailHelp">
                </div>
                <div class="col">
                    <label for="firstnameInput" class="form-label">Firstname</label>
                    <input type="text" class="form-control" id="firstnameInput" aria-describedby="emailHelp">
                </div>
            </div>
            <div class="form-group">
                <label for="birthdateInput" class="form-label">Birthdate</label>
                <input type="date" class="form-control" id="birthdateInput" aria-describedby="emailHelp">
            </div>
            <div class="form-group">
                <label for="addressInput" class="form-label">Address</label>
                <input type="text" class="form-control" id="addressInput" aria-describedby="emailHelp">
            </div>
            <div class="form-group">
                <label for="mailInput" class="form-label">Mail</label>
                <input type="email" class="form-control" id="mailInput" aria-describedby="emailHelp">
            </div>
            <div class="form-group">
                <label for="phoneInput" class="form-label">Phone number</label>
                <input type="tel" class="form-control" id="phoneInput" aria-describedby="emailHelp">
            </div>
            <div class="row">
                <div class="col">
                    <label for="atInput" class="form-label">AT</label>
                    <input type="text" class="form-control" id="atInput" aria-describedby="emailHelp">
                </div>
                <div class="col">
                    <label for="chargeRateInput" class="form-label">Charge rate</label>
                    <input type="text" class="form-control" id="chargeRateInput" aria-describedby="emailHelp">
                </div>
            </div>
            <div class="mb-3">
                <label for="passwordInput" class="form-label">Password</label>
                <input type="password" class="form-control" id="passwordInput">
            </div>
            <div class="mb-3">
                <label for="confirmpasswordInput" class="form-label">Confirm password</label>
                <input type="password" class="form-control" id="confirmpasswordInput">
            </div>
            <div class="d-grid gap-2">
                <button type="submit" class="btn btn-success">Create account</button>
            </div>
            <router-link to="/">Log In</router-link>
        </form>
    </div>
    
    <router-view></router-view>
</template>