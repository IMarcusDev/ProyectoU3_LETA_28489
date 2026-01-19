<script setup lang="ts">
import type { Transaction } from "../types/Transaction"

defineProps<{
  transactions: Transaction[]
}>()
</script>


<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <h5 class="card-title mb-3">
        <i class="fa-solid fa-table-cells me-2 text-primary"></i>
        Resultados
      </h5>

      <div class="table-responsive">
        <table class="table table-striped table-bordered align-middle">
          <thead class="table-light">
            <tr>
              <th>Texto</th>
              <th>SHA256 (ms)</th>
              <th>KECCAK256 (ms)</th>
              <th>AES256 (ms)</th>
              <th>RSA (ms)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(t, i) in transactions" :key="i">
              <td class="text-truncate" style="max-width: 150px">
                {{ t.text }}
              </td>
              <td>{{ t.sha256Time.toFixed(6) }}</td>
              <td>{{ t.keccak256Time.toFixed(6) }}</td>
              <td>{{ t.aes256Time.toFixed(6) }}</td>
              <td>{{ t.rsaTime.toFixed(6) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
