<script setup lang="ts">
import { ref, onMounted, watch } from "vue"
import Chart from "chart.js/auto"
import type { Transaction } from "../../types/Transaction"

const props = defineProps<{
  transaction: Transaction
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

const renderChart = () => {
  if (!canvasRef.value) return
  if (chart) chart.destroy()

  chart = new Chart(canvasRef.value, {
    type: "bar",
    data: {
      labels: ["SHA-256", "KECCAK-256", "AES-256", "RSA"],
      datasets: [
        {
          label: "Costo (ETH)",
          data: [
            props.transaction.sha256BasePrice,
            props.transaction.keccak256BasePrice,
            props.transaction.aes256BasePrice,
            props.transaction.rsaBasePrice
          ],
          backgroundColor: "#ffc107"
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  })
}

onMounted(renderChart)

watch(
  () => props.transaction,
  renderChart,
  { deep: true }
)
</script>

<template>
  <div class="card shadow-sm h-100">
    <div class="card-body">
      <h6 class="card-title">
        <i class="fa-solid fa-coins me-2"></i>
        Costo Estimado L2
      </h6>
      <canvas ref="canvasRef"></canvas>
    </div>
  </div>
</template>
