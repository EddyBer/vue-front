<script setup>
import { ref, defineComponent } from 'vue';
import InvoiceForm from '../vues/InvoiceForm.vue';
import InvoicesListVue from '../vues/InvoicesList.vue';
const tab = ref('')

defineComponent({
    InvoiceForm,
    InvoicesListVue,
})

</script>

<template>

  <v-card class="d-flex flex-column h-100">
      <v-tabs
        v-model="tab"
        bg-color="primary"
        class=" w-100 flex-shrink-0">
        <v-tab value="list">List</v-tab>
        <v-tab value="create">Create</v-tab>
      </v-tabs>
  
      <v-card-text class="d-flex w-100 pa-0 flex-grow-1">
        <v-window class="w-100 h-100 overflow-auto" v-model="tab">
          <v-window-item value="list" class="flex-grow-1">
            <InvoicesListVue/>
          </v-window-item>
          <v-window-item value="create" class="flex-grow-1">
              <InvoiceForm/>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
</template>