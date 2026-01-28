<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  transactions: {
    type: Array,
    required: true
  }
})

const scatterChartRef = ref(null)
const radarChartRef = ref(null)
const efficiencyChartRef = ref(null)
const trendChartRef = ref(null)

let scatterChart = null
let radarChart = null
let efficiencyChart = null
let trendChart = null

// Análisis estadístico de todos los datos
const statistics = computed(() => {
  if (props.transactions.length === 0) return null

  const algorithms = ['sha256', 'keccak256', 'aes256', 'rsa']
  const stats = {}

  algorithms.forEach(algo => {
    const times = props.transactions.map(t => t[`${algo}Time`] * 1000)
    const sizes = props.transactions.map(t => t[`${algo}OutputSize`])
    const costs = props.transactions.map(t => t[`${algo}BasePrice`] * 1e9)

    stats[algo] = {
      time: {
        mean: times.reduce((a, b) => a + b, 0) / times.length,
        min: Math.min(...times),
        max: Math.max(...times),
        stdDev: calculateStdDev(times)
      },
      size: {
        mean: sizes.reduce((a, b) => a + b, 0) / sizes.length,
        consistent: sizes.every(s => s === sizes[0])
      },
      cost: {
        mean: costs.reduce((a, b) => a + b, 0) / costs.length,
        min: Math.min(...costs),
        max: Math.max(...costs)
      }
    }
  })

  return stats
})

// Calcular desviación estándar
const calculateStdDev = (values) => {
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const squareDiffs = values.map(value => Math.pow(value - mean, 2))
  const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length
  return Math.sqrt(avgSquareDiff)
}

// Calcular eficiencia (relación tiempo/tamaño)
const efficiencyMetrics = computed(() => {
  if (!statistics.value) return null

  return {
    sha256: statistics.value.sha256.time.mean / statistics.value.sha256.size.mean,
    keccak256: statistics.value.keccak256.time.mean / statistics.value.keccak256.size.mean,
    aes256: statistics.value.aes256.time.mean / statistics.value.aes256.size.mean,
    rsa: statistics.value.rsa.time.mean / statistics.value.rsa.size.mean
  }
})

// 1. GRÁFICO DE DISPERSIÓN: Tiempo vs Tamaño de Entrada
const createScatterChart = () => {
  if (!scatterChartRef.value || props.transactions.length === 0) return
  if (scatterChart) scatterChart.destroy()

  const datasets = [
    {
      label: 'SHA-256',
      data: props.transactions.map(t => ({ x: t.inputSize, y: t.sha256Time * 1000 })),
      backgroundColor: 'rgba(2, 132, 199, 0.6)',
      borderColor: '#0284c7',
      pointRadius: 6,
      pointHoverRadius: 8
    },
    {
      label: 'KECCAK-256',
      data: props.transactions.map(t => ({ x: t.inputSize, y: t.keccak256Time * 1000 })),
      backgroundColor: 'rgba(124, 58, 237, 0.6)',
      borderColor: '#7c3aed',
      pointRadius: 6,
      pointHoverRadius: 8
    },
    {
      label: 'AES-256',
      data: props.transactions.map(t => ({ x: t.inputSize, y: t.aes256Time * 1000 })),
      backgroundColor: 'rgba(5, 150, 105, 0.6)',
      borderColor: '#059669',
      pointRadius: 6,
      pointHoverRadius: 8
    },
    {
      label: 'RSA',
      data: props.transactions.map(t => ({ x: t.inputSize, y: t.rsaTime * 1000 })),
      backgroundColor: 'rgba(220, 38, 38, 0.6)',
      borderColor: '#dc2626',
      pointRadius: 6,
      pointHoverRadius: 8
    }
  ]

  scatterChart = new Chart(scatterChartRef.value, {
    type: 'scatter',
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Correlación: Tiempo de Ejecución vs Tamaño de Entrada',
          font: { size: 14, weight: 'bold' },
          color: '#1e293b'
        },
        legend: {
          position: 'bottom',
          labels: { 
            font: { size: 11 },
            padding: 15,
            usePointStyle: true
          }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              return `${context.dataset.label}: ${context.parsed.y.toFixed(3)} ms (${context.parsed.x} bytes)`
            }
          }
        }
      },
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          title: {
            display: true,
            text: 'Tamaño de Entrada (bytes)',
            font: { weight: 'bold' }
          },
          grid: { color: '#f1f5f9' }
        },
        y: {
          title: {
            display: true,
            text: 'Tiempo de Ejecución (ms)',
            font: { weight: 'bold' }
          },
          grid: { color: '#f1f5f9' }
        }
      }
    }
  })
}

// 2. GRÁFICO RADAR: Comparación Multidimensional
const createRadarChart = () => {
  if (!radarChartRef.value || !statistics.value) return
  if (radarChart) radarChart.destroy()

  // Normalizar valores para comparación justa (0-100)
  const normalize = (value, min, max) => ((value - min) / (max - min)) * 100

  const allTimes = [
    statistics.value.sha256.time.mean,
    statistics.value.keccak256.time.mean,
    statistics.value.aes256.time.mean,
    statistics.value.rsa.time.mean
  ]
  const minTime = Math.min(...allTimes)
  const maxTime = Math.max(...allTimes)

  const allCosts = [
    statistics.value.sha256.cost.mean,
    statistics.value.keccak256.cost.mean,
    statistics.value.aes256.cost.mean,
    statistics.value.rsa.cost.mean
  ]
  const minCost = Math.min(...allCosts)
  const maxCost = Math.max(...allCosts)

  radarChart = new Chart(radarChartRef.value, {
    type: 'radar',
    data: {
      labels: ['Velocidad', 'Eficiencia', 'Costo L2', 'Consistencia', 'Tamaño'],
      datasets: [
        {
          label: 'SHA-256',
          data: [
            100 - normalize(statistics.value.sha256.time.mean, minTime, maxTime), // Invertido (más es mejor)
            80, // Eficiencia relativa
            100 - normalize(statistics.value.sha256.cost.mean, minCost, maxCost), // Invertido
            95, // Consistencia
            70 // Tamaño fijo
          ],
          backgroundColor: 'rgba(2, 132, 199, 0.2)',
          borderColor: '#0284c7',
          borderWidth: 2,
          pointBackgroundColor: '#0284c7'
        },
        {
          label: 'KECCAK-256',
          data: [
            100 - normalize(statistics.value.keccak256.time.mean, minTime, maxTime),
            75,
            100 - normalize(statistics.value.keccak256.cost.mean, minCost, maxCost),
            95,
            70
          ],
          backgroundColor: 'rgba(124, 58, 237, 0.2)',
          borderColor: '#7c3aed',
          borderWidth: 2,
          pointBackgroundColor: '#7c3aed'
        },
        {
          label: 'AES-256',
          data: [
            100 - normalize(statistics.value.aes256.time.mean, minTime, maxTime),
            70,
            100 - normalize(statistics.value.aes256.cost.mean, minCost, maxCost),
            90,
            60
          ],
          backgroundColor: 'rgba(5, 150, 105, 0.2)',
          borderColor: '#059669',
          borderWidth: 2,
          pointBackgroundColor: '#059669'
        },
        {
          label: 'RSA',
          data: [
            100 - normalize(statistics.value.rsa.time.mean, minTime, maxTime),
            40,
            100 - normalize(statistics.value.rsa.cost.mean, minCost, maxCost),
            85,
            95
          ],
          backgroundColor: 'rgba(220, 38, 38, 0.2)',
          borderColor: '#dc2626',
          borderWidth: 2,
          pointBackgroundColor: '#dc2626'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Análisis Multidimensional de Rendimiento',
          font: { size: 14, weight: 'bold' },
          color: '#1e293b'
        },
        legend: {
          position: 'bottom',
          labels: { font: { size: 11 }, padding: 15 }
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 20,
            font: { size: 10 }
          },
          pointLabels: {
            font: { size: 11, weight: 'bold' }
          },
          grid: { color: '#e5e7eb' }
        }
      }
    }
  })
}

// 3. GRÁFICO DE BARRAS APILADAS: Desglose de Costos
const createEfficiencyChart = () => {
  if (!efficiencyChartRef.value || !statistics.value) return
  if (efficiencyChart) efficiencyChart.destroy()

  efficiencyChart = new Chart(efficiencyChartRef.value, {
    type: 'bar',
    data: {
      labels: ['SHA-256', 'KECCAK-256', 'AES-256', 'RSA'],
      datasets: [
        {
          label: 'Tiempo Medio (ms)',
          data: [
            statistics.value.sha256.time.mean,
            statistics.value.keccak256.time.mean,
            statistics.value.aes256.time.mean,
            statistics.value.rsa.time.mean
          ],
          backgroundColor: '#0284c7',
          borderRadius: 6,
          borderSkipped: false
        },
        {
          label: 'Desviación Estándar (ms)',
          data: [
            statistics.value.sha256.time.stdDev,
            statistics.value.keccak256.time.stdDev,
            statistics.value.aes256.time.stdDev,
            statistics.value.rsa.time.stdDev
          ],
          backgroundColor: '#94a3b8',
          borderRadius: 6,
          borderSkipped: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Tiempo Medio ± Desviación Estándar',
          font: { size: 14, weight: 'bold' },
          color: '#1e293b'
        },
        legend: {
          position: 'bottom',
          labels: { font: { size: 11 }, padding: 15 }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              return `${context.dataset.label}: ${context.parsed.y.toFixed(4)} ms`
            }
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          grid: { display: false }
        },
        y: {
          stacked: true,
          title: {
            display: true,
            text: 'Tiempo (ms)',
            font: { weight: 'bold' }
          },
          grid: { color: '#f1f5f9' }
        }
      }
    }
  })
}

// 4. GRÁFICO DE LÍNEAS: Tendencia Temporal
const createTrendChart = () => {
  if (!trendChartRef.value || props.transactions.length === 0) return
  if (trendChart) trendChart.destroy()

  const labels = props.transactions.map((_, i) => `Ejecución ${i + 1}`)

  trendChart = new Chart(trendChartRef.value, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'SHA-256',
          data: props.transactions.map(t => t.sha256Time * 1000),
          borderColor: '#0284c7',
          backgroundColor: 'rgba(2, 132, 199, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        },
        {
          label: 'KECCAK-256',
          data: props.transactions.map(t => t.keccak256Time * 1000),
          borderColor: '#7c3aed',
          backgroundColor: 'rgba(124, 58, 237, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        },
        {
          label: 'AES-256',
          data: props.transactions.map(t => t.aes256Time * 1000),
          borderColor: '#059669',
          backgroundColor: 'rgba(5, 150, 105, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        },
        {
          label: 'RSA',
          data: props.transactions.map(t => t.rsaTime * 1000),
          borderColor: '#dc2626',
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Tendencia de Rendimiento a lo Largo del Tiempo',
          font: { size: 14, weight: 'bold' },
          color: '#1e293b'
        },
        legend: {
          position: 'bottom',
          labels: { font: { size: 11 }, padding: 15 }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Número de Ejecución',
            font: { weight: 'bold' }
          },
          grid: { display: false }
        },
        y: {
          title: {
            display: true,
            text: 'Tiempo (ms)',
            font: { weight: 'bold' }
          },
          grid: { color: '#f1f5f9' }
        }
      }
    }
  })
}

const renderCharts = () => {
  createScatterChart()
  createRadarChart()
  createEfficiencyChart()
  createTrendChart()
}

onMounted(() => {
  if (props.transactions.length > 0) {
    renderCharts()
  }
})

watch(() => props.transactions.length, () => {
  renderCharts()
}, { deep: true })
</script>

<template>
  <div class="advanced-analytics">
    <div class="analytics-header">
      <div class="header-icon-wrapper">
        <svg class="header-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <div>
          <h3 class="analytics-title">Análisis Estadístico Avanzado</h3>
          <p class="analytics-subtitle">Visualizaciones académicas para análisis comparativo</p>
        </div>
      </div>
    </div>

    <!-- Tabla de Estadísticas -->
    <div v-if="statistics" class="stats-table-container">
      <h4 class="table-title">Estadísticas Descriptivas</h4>
      <div class="stats-table">
        <table>
          <thead>
            <tr>
              <th>Algoritmo</th>
              <th>Tiempo Medio (ms)</th>
              <th>Desv. Estándar</th>
              <th>Min - Max (ms)</th>
              <th>Costo Medio (Gwei)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="algo-name" style="color: #0284c7;">SHA-256</td>
              <td>{{ statistics.sha256.time.mean.toFixed(4) }}</td>
              <td>{{ statistics.sha256.time.stdDev.toFixed(4) }}</td>
              <td>{{ statistics.sha256.time.min.toFixed(4) }} - {{ statistics.sha256.time.max.toFixed(4) }}</td>
              <td>{{ statistics.sha256.cost.mean.toFixed(4) }}</td>
            </tr>
            <tr>
              <td class="algo-name" style="color: #7c3aed;">KECCAK-256</td>
              <td>{{ statistics.keccak256.time.mean.toFixed(4) }}</td>
              <td>{{ statistics.keccak256.time.stdDev.toFixed(4) }}</td>
              <td>{{ statistics.keccak256.time.min.toFixed(4) }} - {{ statistics.keccak256.time.max.toFixed(4) }}</td>
              <td>{{ statistics.keccak256.cost.mean.toFixed(4) }}</td>
            </tr>
            <tr>
              <td class="algo-name" style="color: #059669;">AES-256</td>
              <td>{{ statistics.aes256.time.mean.toFixed(4) }}</td>
              <td>{{ statistics.aes256.time.stdDev.toFixed(4) }}</td>
              <td>{{ statistics.aes256.time.min.toFixed(4) }} - {{ statistics.aes256.time.max.toFixed(4) }}</td>
              <td>{{ statistics.aes256.cost.mean.toFixed(4) }}</td>
            </tr>
            <tr>
              <td class="algo-name" style="color: #dc2626;">RSA</td>
              <td>{{ statistics.rsa.time.mean.toFixed(4) }}</td>
              <td>{{ statistics.rsa.time.stdDev.toFixed(4) }}</td>
              <td>{{ statistics.rsa.time.min.toFixed(4) }} - {{ statistics.rsa.time.max.toFixed(4) }}</td>
              <td>{{ statistics.rsa.cost.mean.toFixed(4) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Gráficos -->
    <div class="charts-grid">
      <!-- Scatter Plot -->
      <div class="chart-card large">
        <canvas ref="scatterChartRef"></canvas>
      </div>

      <!-- Radar Chart -->
      <div class="chart-card">
        <canvas ref="radarChartRef"></canvas>
      </div>

      <!-- Efficiency Chart -->
      <div class="chart-card">
        <canvas ref="efficiencyChartRef"></canvas>
      </div>

      <!-- Trend Chart -->
      <div class="chart-card large">
        <canvas ref="trendChartRef"></canvas>
      </div>
    </div>
  </div>
</template>

<style scoped>
.advanced-analytics {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.analytics-header {
  margin-bottom: 0.5rem;
}

.header-icon-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.header-icon {
  width: 40px;
  height: 40px;
  padding: 8px;
  background: linear-gradient(135deg, #dbeafe 0%, #bae6fd 100%);
  border-radius: 10px;
  color: #0369a1;
  flex-shrink: 0;
}

.analytics-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
  letter-spacing: -0.01em;
}

.analytics-subtitle {
  font-size: 0.9375rem;
  color: #64748b;
  margin: 0;
}

.stats-table-container {
  padding: 1.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
}

.table-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 1rem 0;
}

.stats-table {
  overflow-x: auto;
}

.stats-table table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.stats-table th {
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #475569;
  background: #f8fafc;
  border-bottom: 2px solid #e5e7eb;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.stats-table td {
  padding: 0.875rem 0.75rem;
  border-bottom: 1px solid #f1f5f9;
  font-variant-numeric: tabular-nums;
}

.algo-name {
  font-weight: 700;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.chart-card {
  padding: 1.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  height: 400px;
}

.chart-card.large {
  grid-column: span 2;
}

canvas {
  max-height: 100%;
}

@media (max-width: 1200px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }

  .chart-card.large {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .chart-card {
    height: 350px;
  }
}
</style>