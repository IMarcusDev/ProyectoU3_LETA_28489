<script setup>
import {ref, onMounted} from "vue";
import TransactionForm from "../components/TransactionForm.vue";
import TransactionTable from "../components/TransactionTable.vue";
import {getTransactions} from "../api/transactions";

const transactions = ref([]);

const load = async () => {
  const response = await getTransactions();
  transactions.value = response.data;
};

onMounted(load);

const onCreated = (transaction) => {
  transactions.value.push(transaction);
};
</script>

<template>
    <h1>Comparación de Algoritmos Criptográficos</h1>
    <TransactionForm @created="onCreated"/>
    <TransactionTable :transactions="transactions"/>
</template>

