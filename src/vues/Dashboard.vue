<script setup>
import { Bar, Line } from 'vue-chartjs'
import { defineComponent, onMounted, ref } from 'vue';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale , PointElement, LineElement, } from 'chart.js'
import { InvoicesApi } from '../services/invoices.service';
import { useAuthStore } from "../stores/auth";

defineComponent({
    Bar,
})

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement)
const authStore = useAuthStore();

const loaded = ref(false)

const chartOptions = {
     responsive: true
}
const currentYear = new Date().getFullYear()
const maxSalesRevenue = ref(0)

const MyData = ref({
     CA:0,
     WaitingPayement:0,
     SumOfEditedInvoice:0
})

const allSalesRevenue = ref({})

const monstlyPayesSalesRevenueOfTheYear = ref([
     0,0,0,0,0,0,0,0,0,0,0,0,
])

const CumulatemonstlyPayesSalesRevenueOfTheYear = ref([
     0,0,0,0,0,0,0,0,0,0,0,0,
])

const monstlyPayesSalesRevenueOfLastTheYear = ref([
     0,0,0,0,0,0,0,0,0,0,0,0,
])

const CumulatemonstlyPayesSalesRevenueOfLastTheYear = ref([
     0,0,0,0,0,0,0,0,0,0,0,0,
])

const lineData = ref({
     labels : [ 'January','February','March','April','Mai','June','July','August','September','October','November','December',],
     datasets : [ 
          {
          label: 'Last year',
          backgroundColor: '#206ce6',
          data: [0,0,0,0,0,0,0,0,0,0,0,0,] },
          {
          label: 'Current year',
          backgroundColor: '#f87979',
          data: [0,0,0,0,0,0,0,0,0,0,0,0,] },
          ]
})

const lineOption = {
     responsive: true,
     borderColor: '#333232',
     borderWidth:5
}

const chartData = ref({
     labels : [ 'January','February','March','April','Mai','June','July','August','September','October','November','December',],
     datasets : [ 
          {
          label: 'Last year',
          backgroundColor: '#206ce6',
          data: [0,0,0,0,0,0,0,0,0,0,0,0,] },
          {
          label: 'Current year',
          backgroundColor: '#f87979',
          data: [0,0,0,0,0,0,0,0,0,0,0,0,] },
           ]
})

onMounted(async()=> {
     const data = await InvoicesApi.getMyInvoices(parseInt(authStore.userId))

     data.forEach(invoice => {
          switch (invoice.status) {
               case 'Edited' :
                    if (new Date(invoice.publishingDate) >= new Date(new Date().getFullYear(), 0, 1) && new Date(invoice.publishingDate) <= new Date(new Date().getFullYear(), 11, 31)) {
                         invoice.lines.forEach(line => {
                              MyData.value.SumOfEditedInvoice += line.price * line.quantity
                         });
                    }
                    break;
               case 'Send' :
                    if (new Date(invoice.publishingDate) >= new Date(new Date().getFullYear(), 0, 1) && new Date(invoice.publishingDate) <= new Date(new Date().getFullYear(), 11, 31)) {
                         invoice.lines.forEach(line => {
                              MyData.value.WaitingPayement += line.price * line.quantity
                         });
                    }
                    break;
               case 'Payed' :
                    if (new Date(invoice.publishingDate) >= new Date(new Date().getFullYear(), 0, 1) && new Date(invoice.publishingDate) <= new Date(new Date().getFullYear(), 11, 31)) {
                         const month = new Date(invoice.paymentDate).getMonth()
                              invoice.lines.forEach(line => {
                                   monstlyPayesSalesRevenueOfTheYear.value[month] += line.price * line.quantity
                              });
                    }

                    if (new Date(invoice.publishingDate) >= new Date(new Date().getFullYear() -1, 0, 1) && new Date(invoice.publishingDate) <= new Date(new Date().getFullYear() -1, 11, 31)) {
                         const month = new Date(invoice.paymentDate).getMonth()
                              invoice.lines.forEach(line => {
                                   monstlyPayesSalesRevenueOfLastTheYear.value[month] += line.price * line.quantity
                              });
                    }
                    break;
          }

          const year = new Date(invoice.publishingDate).getFullYear()

          if (allSalesRevenue.value[year]) {
               invoice.lines.forEach(line => {
                    allSalesRevenue.value[year] += line.price * line.quantity
               });
          } else {
               let sales = 0 
               invoice.lines.forEach(line => {
                         sales +=  line.price * line.quantity
                    allSalesRevenue.value[year] = sales
               });
          }
     })

     for (const month in monstlyPayesSalesRevenueOfLastTheYear.value) {
          if (month > 0) {
               CumulatemonstlyPayesSalesRevenueOfLastTheYear.value[month] = monstlyPayesSalesRevenueOfLastTheYear.value[month] + CumulatemonstlyPayesSalesRevenueOfLastTheYear.value[month - 1]
          } else {
               CumulatemonstlyPayesSalesRevenueOfLastTheYear.value[month] = monstlyPayesSalesRevenueOfLastTheYear.value[month]
          }
     }

     for (const month in monstlyPayesSalesRevenueOfTheYear.value) {
          if (month > 0) {
               CumulatemonstlyPayesSalesRevenueOfTheYear.value[month] = monstlyPayesSalesRevenueOfTheYear.value[month] + CumulatemonstlyPayesSalesRevenueOfTheYear.value[month - 1]
          } else {
               CumulatemonstlyPayesSalesRevenueOfTheYear.value[month] = monstlyPayesSalesRevenueOfTheYear.value[month]
          }
     }

     const MyCa = Object.values(allSalesRevenue.value)
     if (Math.max(...MyCa) > 0) {
          maxSalesRevenue.value = Math.max(...MyCa)
     } else {
          maxSalesRevenue.value = 0
     }

     lineData.value.datasets[1].data = CumulatemonstlyPayesSalesRevenueOfTheYear.value
     lineData.value.datasets[0].data = CumulatemonstlyPayesSalesRevenueOfLastTheYear.value

     chartData.value.datasets[1].data = monstlyPayesSalesRevenueOfTheYear.value
     chartData.value.datasets[0].data = monstlyPayesSalesRevenueOfLastTheYear.value
     loaded.value = true
})

</script>

<template>
     <v-container width="100%" class="h-100 d-flex flex-column overflow-auto">
          <v-row align="center"  width="100%" class="d-flex flex-row justify-space-between" >
          <v-card title="Yearly sales revenues" variant="outlined" class="d-flex flex-column pa-2">
               <v-row align="center">
               <v-col class="text-right">
                    <v-icon
                    color="success"
                    icon="mdi-currency-usd"
                    size="88"
                    ></v-icon>
               </v-col>
               <v-col class="text-h2">
                    {{ allSalesRevenue[currentYear] }}
               </v-col>
               </v-row>
          </v-card>

          <v-card title="Waiting payment" variant="outlined" class="d-flex flex-column pa-2">
               <v-row align="center">
               <v-col>
                    <v-icon
                    color="warning"
                    icon="mdi-timer-sand"
                    size="88"
                    ></v-icon>
               </v-col>
               <v-col class="text-h2">
                    {{ MyData.WaitingPayement }}
               </v-col>
               </v-row>
          </v-card>

          <v-card title="Not sended invoices" variant="outlined" class="d-flex flex-column pa-2">
               <v-row align="center">
               <v-col>
                    <v-icon
                    color="error"
                    icon="mdi-email-alert"
                    size="88"
                    ></v-icon>
               </v-col>
               <v-col class="text-h2">
                    {{ MyData.SumOfEditedInvoice }}
               </v-col>
               </v-row>
          </v-card>

          <v-card title="Best sales revenue" variant="outlined" class="d-flex flex-column pa-2">
               <v-row align="center">
               <v-col>
                    <v-icon
                    color="success"
                    icon="mdi-piggy-bank"
                    size="88"
                    ></v-icon>
               </v-col>
               <v-col class="text-h2">
                    {{ maxSalesRevenue }}
               </v-col>
               </v-row>
          </v-card>

          <v-card title="Sales revenue to do" variant="outlined" class="d-flex flex-column pa-2">
               <v-row align="center">
               <v-col>
                    <v-icon
                    color="warning"
                    icon="mdi-cash"
                    size="88"
                    ></v-icon>
               </v-col>
               <v-col class="text-h2">
                    {{ maxSalesRevenue - allSalesRevenue[currentYear] }}
               </v-col>
               </v-row>
          </v-card>
     </v-row>

     <v-row align="center"  width="100%" class="d-flex pa-2">
     <div class="text-h2">Sales revenue factured by month</div>
     <Bar class="w-100"
          v-if="loaded"
          :options="chartOptions"
          :data="chartData"/>
     </v-row>

     <v-row align="center"  width="100%" class="d-flex pa-2">
     <div class="text-h2"> Cumullate sales revenue factured by month</div>
     <Line
          class="w-100"
          v-if="loaded"
          :data="lineData" 
          :options="lineOption" />
     </v-row>
     </v-container>
</template>