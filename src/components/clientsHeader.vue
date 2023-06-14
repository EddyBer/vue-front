<script setup>
import { ref, defineComponent } from 'vue';
import ClientForm from '../vues/ClientForm.vue';

const tab = ref('')

defineComponent({
    ClientForm
})

</script>

<template>

    <v-card>
        <v-tabs
          v-model="tab"
          bg-color="primary"
          class=" w-100">
          <v-tab :value="list">List</v-tab>
          <v-tab :value="create">Create</v-tab>
          <!-- <v-tab value="three">Item Three</v-tab> -->
        </v-tabs>
    
        <v-card-text class="d-flex w-100">
          <v-window v-model="tab">
            <v-window-item :value="list">

            </v-window-item>
    
            <v-window-item :value="create">
                <ClientForm/>
            </v-window-item>
    
            <v-window-item :value="three">
              Three
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
</template>