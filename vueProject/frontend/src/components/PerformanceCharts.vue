<script setup>
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  transaction: {
    type: Object,
    required: true
  }
})

const timeChartRef = ref(null)
const sizeChartRef = ref(null)
const costChartRef = ref(null)

let timeChart = null
let sizeChart = null
let costChart = null

const chartConfig = {
  time: {
    labels: ['SHA-256', 'KECCAK-256', 'AES-256', 'RSA'],
    data: () => [
      props.transaction.sha256Time * 1000,
      props.transaction.keccak256Time * 1000,
      props.transaction.aes256Time * 1000,
      props.transaction.rsaTime * 1000
    ],
    colors: ['#3b82f6', '#8b5cf6', '#10b981', '#ef4444'],
    unit: 'ms'
  },
  size: {
    labels: ['SHA-256', 'KECCAK-256', 'AES-256', 'RSA'],
    data: () => [
      props.transaction.sha256OutputSize,
      props.transaction.keccak256OutputSize,
      props.transaction.aes256OutputSize,
      props.transaction.rsaOutputSize
    ],
    colors: ['#3b82f6', '#8b5cf6', '#10b981', '#ef4444'],
    unit: 'bytes'
  },
  cost: {
    labels: ['SHA-256', 'KECCAK-256', 'AES-256', 'RSA'],
    data: () => [
      props.transaction.sha256BasePrice * 1e9,
      props.transaction.keccak256BasePrice * 1e9,
      props.transaction.aes256BasePrice * 1e9,
      props.transaction.rsaBasePrice * 1e9
    ],
    colors: ['#3b82f6', '#8b5cf6', '#10b981', '#ef4444'],
    unit: 'Gwei'
  }
}

const createChart = (canvasRef, config) => {
  if (!canvasRef.value) return null

  return new Chart(canvasRef.value, {
    type: 'bar',
    data: {
      labels: config.labels,
      datasets: [{
        data: config.data(),
        backgroundColor: config.colors,
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 13
          },
          callbacks: {
            label: (context) => {
              return `${context.parsed.y.toFixed(4)} ${config.unit}`
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: '#f1f5f9',
            drawBorder: false
          },
          ticks: {
            color: '#64748b',
            font: {
              size: 11
            },
            callback: function(value) {
              return value.toFixed(2)
            }
          }
        },
        x: {
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            color: '#1e293b',
            font: {
              size: 12,
              weight: '600'
            }
          }
        }
      },
      animation: {
        duration: 1000,
        easing: 'easeInOutQuart'
      }
    }
  })
}

const renderCharts = () => {
  if (timeChart) timeChart.destroy()
  if (sizeChart) sizeChart.destroy()
  if (costChart) costChart.destroy()

  timeChart = createChart(timeChartRef, chartConfig.time)
  sizeChart = createChart(sizeChartRef, chartConfig.size)
  costChart = createChart(costChartRef, chartConfig.cost)
}

onMounted(renderCharts)
watch(() => props.transaction, renderCharts, { deep: true })
</script>

<template>
  <div class="charts-container">
    <div class="chart-card">
      <div class="chart-header">
        <svg class="chart-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 class="chart-title">Tiempo de Ejecución</h3>
          <p class="chart-subtitle">Comparación de velocidad de procesamiento</p>
        </div>
      </div>
      <div class="chart-wrapper">
        <canvas ref="timeChartRef"></canvas>
      </div>
    </div>

    <div class="chart-card">
      <div class="chart-header">
        <svg class="chart-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
        </svg>
        <div>
          <h3 class="chart-title">Tamaño de Salida</h3>
          <p class="chart-subtitle">Bytes generados por algoritmo</p>
        </div>
      </div>
      <div class="chart-wrapper">
        <canvas ref="sizeChartRef"></canvas>
      </div>
    </div>

    <div class="chart-card">
      <div class="chart-header">
        <svg class="chart-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 class="chart-title">Costo en Layer 2</h3>
          <p class="chart-subtitle">Estimación de gas en Gwei</p>
        </div>
      </div>
      <div class="chart-wrapper">
        <canvas ref="costChartRef"></canvas>
      </div>
    </div>
  </div>
</template>

<style scoped>
.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: chartFadeIn 0.6s ease-out;
  animation-fill-mode: backwards;
}

@keyframes chartFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.chart-card:nth-child(1) { animation-delay: 0.1s; }
.chart-card:nth-child(2) { animation-delay: 0.2s; }
.chart-card:nth-child(3) { animation-delay: 0.3s; }

.chart-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.chart-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.chart-icon {
  width: 40px;
  height: 40px;
  padding: 8px;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  flex-shrink: 0;
}

.chart-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.chart-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.chart-wrapper {
  height: 280px;
  position: relative;
}

/* Responsive */
@media (max-width: 768px) {
  .charts-container {
    grid-template-columns: 1fr;
  }

  .chart-wrapper {
    height: 240px;
  }
}
</style>