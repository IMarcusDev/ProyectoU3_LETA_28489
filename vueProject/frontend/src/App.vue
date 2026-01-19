<script setup>

import {ref} from 'vue'

import TransactionForm from './components/TransactionForm.vue';
import TransactionTable from './components/TransactionTable.vue';
import TimeChart from './components/charts/TimeChart.vue';
import CostChart from './components/charts/CostChart.vue';
import SizeChart from './components/charts/SizeChart.vue';

const transactions = ref([]);

const addTransaction = (transaction) => {
  transactions.value.push(transaction);
};
</script>

<template>
  <div class="container-fluid my-4 px-4">
    <h3 class="mb-4 text-center">
      <i class="fa-solid fa-chart-line"></i>
      Dashboard de Análisis Criptográfico
    </h3>

    <TransactionForm @created="addTransaction" />

    <div v-if="transactions.length" class="row g-4 mb-4">
      <div class="col-12 col-xl-4">
      <TimeChart :transaction="transactions.at(-1)" />
      </div>
      <div class="col-12 col-xl-4">
        <SizeChart :transaction="transactions.at(-1)" />
      </div>
      <div class="col-12 col-xl-4">
        <CostChart :transaction="transactions.at(-1)" />
      </div>
    </div>
    <TransactionTable :transactions="transactions" />
  </div>
</template>
