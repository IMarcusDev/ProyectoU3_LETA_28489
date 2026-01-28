<script setup>
import { computed } from 'vue'

const props = defineProps({
  transaction: {
    type: Object,
    required: true
  }
})

const algorithms = computed(() => [
  {
    name: 'SHA-256',
    type: 'Hashing',
    description: 'Función hash criptográfica de 256 bits',
    time: props.transaction.sha256Time * 1000,
    outputSize: props.transaction.sha256OutputSize,
    price: props.transaction.sha256BasePrice,
    color: 'blue',
    icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z',
    gradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
  },
  {
    name: 'KECCAK-256',
    type: 'Hashing',
    description: 'Base del SHA-3, usado en Ethereum',
    time: props.transaction.keccak256Time * 1000,
    outputSize: props.transaction.keccak256OutputSize,
    price: props.transaction.keccak256BasePrice,
    color: 'purple',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)'
  },
  {
    name: 'AES-256',
    type: 'Cifrado Simétrico',
    description: 'Advanced Encryption Standard de 256 bits',
    time: props.transaction.aes256Time * 1000,
    outputSize: props.transaction.aes256OutputSize,
    price: props.transaction.aes256BasePrice,
    color: 'green',
    icon: 'M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z',
    gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
  },
  {
    name: 'RSA',
    type: 'Cifrado Asimétrico',
    description: 'Criptografía de clave pública (2048 bits)',
    time: props.transaction.rsaTime * 1000,
    outputSize: props.transaction.rsaOutputSize,
    price: props.transaction.rsaBasePrice,
    color: 'red',
    icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z',
    gradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
  }
])

const getColorClasses = (color) => {
  const colors = {
    blue: {
      bg: '#eff6ff',
      border: '#bfdbfe',
      text: '#1e40af',
      icon: '#0284c7'
    },
    purple: {
      bg: '#f5f3ff',
      border: '#ddd6fe',
      text: '#6d28d9',
      icon: '#7c3aed'
    },
    green: {
      bg: '#f0fdf4',
      border: '#bbf7d0',
      text: '#15803d',
      icon: '#059669'
    },
    red: {
      bg: '#fef2f2',
      border: '#fecaca',
      text: '#991b1b',
      icon: '#dc2626'
    }
  }
  return colors[color]
}

const formatTime = (ms) => {
  return ms < 1 ? `${(ms * 1000).toFixed(2)} μs` : `${ms.toFixed(3)} ms`
}

const formatPrice = (eth) => {
  return `${(eth * 1e9).toFixed(4)} Gwei`
}
</script>

<template>
  <div class="crypto-cards-grid">
    <div 
      v-for="algo in algorithms" 
      :key="algo.name" 
      class="crypto-card"
    >
      <!-- Card Header -->
      <div class="card-header">
        <div 
          class="card-icon-wrapper"
          :style="{ background: getColorClasses(algo.color).bg, borderColor: getColorClasses(algo.color).border }"
        >
          <svg 
            class="card-icon" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            :style="{ color: getColorClasses(algo.color).icon }"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="algo.icon" />
          </svg>
        </div>
        <div class="card-title-section">
          <h3 class="card-title">{{ algo.name }}</h3>
          <span 
            class="card-badge"
            :style="{ 
              backgroundColor: getColorClasses(algo.color).bg,
              color: getColorClasses(algo.color).text,
              borderColor: getColorClasses(algo.color).border
            }"
          >
            {{ algo.type }}
          </span>
        </div>
      </div>

      <!-- Card Description -->
      <p class="card-description">{{ algo.description }}</p>

      <!-- Card Metrics -->
      <div class="card-metrics">
        <div class="metric-row">
          <div class="metric">
            <span class="metric-label">Tiempo</span>
            <span class="metric-value" :style="{ color: getColorClasses(algo.color).icon }">
              {{ formatTime(algo.time) }}
            </span>
          </div>
          <div class="metric">
            <span class="metric-label">Tamaño</span>
            <span class="metric-value">{{ algo.outputSize }} bytes</span>
          </div>
        </div>
        <div class="metric-full">
          <span class="metric-label">Costo L2 (Estimado)</span>
          <span class="metric-value">{{ formatPrice(algo.price) }}</span>
        </div>
      </div>

      <!-- Visual indicator -->
      <div class="card-indicator" :style="{ background: algo.gradient }"></div>
    </div>
  </div>
</template>

<style scoped>
.crypto-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.crypto-card {
  position: relative;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  animation: cardSlideUp 0.5s ease-out;
  animation-fill-mode: backwards;
}

@keyframes cardSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.crypto-card:nth-child(1) { animation-delay: 0.05s; }
.crypto-card:nth-child(2) { animation-delay: 0.1s; }
.crypto-card:nth-child(3) { animation-delay: 0.15s; }
.crypto-card:nth-child(4) { animation-delay: 0.2s; }

.crypto-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: #cbd5e1;
}

.card-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
}

.card-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.card-icon-wrapper {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  border: 1px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.3s;
}

.crypto-card:hover .card-icon-wrapper {
  transform: scale(1.05);
}

.card-icon {
  width: 28px;
  height: 28px;
}

.card-title-section {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.01em;
}

.card-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  border: 1px solid;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.025em;
  text-transform: uppercase;
}

.card-description {
  color: #64748b;
  font-size: 0.9375rem;
  line-height: 1.5;
  margin: 0 0 1.25rem 0;
}

.card-metrics {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.metric-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 0.875rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #f1f5f9;
  transition: background 0.2s;
}

.metric:hover {
  background: #f1f5f9;
}

.metric-full {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #f1f5f9;
  transition: background 0.2s;
}

.metric-full:hover {
  background: #f1f5f9;
}

.metric-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.metric-value {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  font-variant-numeric: tabular-nums;
}

/* Responsive */
@media (max-width: 768px) {
  .crypto-cards-grid {
    grid-template-columns: 1fr;
  }

  .card-title {
    font-size: 1.125rem;
  }

  .metric-row {
    grid-template-columns: 1fr;
  }
}
</style>