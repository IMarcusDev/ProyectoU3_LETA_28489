<script setup>
defineProps({
  transactions: {
    type: Array,
    required: true
  }
})

const formatTime = (seconds) => {
  const ms = seconds * 1000
  return ms < 1 ? `${(ms * 1000).toFixed(2)} μs` : `${ms.toFixed(3)} ms`
}

const formatDate = (date) => {
  return new Date(date).toLocaleString('es-EC', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getFastestAlgorithm = (transaction) => {
  const times = {
    'SHA-256': transaction.sha256Time,
    'KECCAK-256': transaction.keccak256Time,
    'AES-256': transaction.aes256Time,
    'RSA': transaction.rsaTime
  }
  return Object.entries(times).reduce((a, b) => a[1] < b[1] ? a : b)[0]
}

const getAlgorithmColor = (name) => {
  const colors = {
    'SHA-256': '#3b82f6',
    'KECCAK-256': '#8b5cf6',
    'AES-256': '#10b981',
    'RSA': '#ef4444'
  }
  return colors[name]
}
</script>

<template>
  <div class="table-container">
    <div v-if="transactions.length === 0" class="empty-state">
      <svg class="empty-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="empty-text">No hay análisis realizados aún</p>
      <p class="empty-subtext">Ejecuta tu primer análisis para ver los resultados aquí</p>
    </div>

    <div v-else class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th class="col-index">#</th>
            <th class="col-date">Fecha</th>
            <th class="col-text">Texto Analizado</th>
            <th class="col-size">Tamaño</th>
            <th class="col-time">SHA-256</th>
            <th class="col-time">KECCAK-256</th>
            <th class="col-time">AES-256</th>
            <th class="col-time">RSA</th>
            <th class="col-fastest">Más Rápido</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(transaction, index) in transactions.slice().reverse()" 
            :key="index"
            class="table-row"
          >
            <td class="col-index">
              <span class="index-badge">{{ transactions.length - index }}</span>
            </td>
            <td class="col-date">{{ formatDate(transaction.date) }}</td>
            <td class="col-text">
              <div class="text-content">
                <span class="text-preview">{{ transaction.text }}</span>
              </div>
            </td>
            <td class="col-size">
              <span class="size-badge">{{ transaction.inputSize }} bytes</span>
            </td>
            <td class="col-time">
              <span class="time-value" style="color: #3b82f6;">
                {{ formatTime(transaction.sha256Time) }}
              </span>
            </td>
            <td class="col-time">
              <span class="time-value" style="color: #8b5cf6;">
                {{ formatTime(transaction.keccak256Time) }}
              </span>
            </td>
            <td class="col-time">
              <span class="time-value" style="color: #10b981;">
                {{ formatTime(transaction.aes256Time) }}
              </span>
            </td>
            <td class="col-time">
              <span class="time-value" style="color: #ef4444;">
                {{ formatTime(transaction.rsaTime) }}
              </span>
            </td>
            <td class="col-fastest">
              <span 
                class="fastest-badge"
                :style="{ backgroundColor: getAlgorithmColor(getFastestAlgorithm(transaction)) + '20', color: getAlgorithmColor(getFastestAlgorithm(transaction)) }"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="badge-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {{ getFastestAlgorithm(transaction) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="transactions.length > 0" class="table-footer">
      <div class="footer-info">
        <svg xmlns="http://www.w3.org/2000/svg" class="footer-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Total de análisis realizados: <strong>{{ transactions.length }}</strong></span>
      </div>
      <div class="algorithm-legend">
        <span class="legend-item" style="--color: #3b82f6;">
          <span class="legend-dot"></span>
          SHA-256
        </span>
        <span class="legend-item" style="--color: #8b5cf6;">
          <span class="legend-dot"></span>
          KECCAK-256
        </span>
        <span class="legend-item" style="--color: #10b981;">
          <span class="legend-dot"></span>
          AES-256
        </span>
        <span class="legend-item" style="--color: #ef4444;">
          <span class="legend-dot"></span>
          RSA
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.table-container {
  width: 100%;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  width: 64px;
  height: 64px;
  color: #cbd5e1;
  margin-bottom: 1rem;
}

.empty-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: #475569;
  margin: 0 0 0.5rem 0;
}

.empty-subtext {
  font-size: 0.95rem;
  color: #94a3b8;
  margin: 0;
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.data-table thead {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  position: sticky;
  top: 0;
  z-index: 10;
}

.data-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #475569;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
}

.data-table td {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.table-row {
  transition: background-color 0.2s;
  animation: rowFadeIn 0.4s ease-out;
  animation-fill-mode: backwards;
}

@keyframes rowFadeIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.table-row:nth-child(1) { animation-delay: 0.05s; }
.table-row:nth-child(2) { animation-delay: 0.1s; }
.table-row:nth-child(3) { animation-delay: 0.15s; }
.table-row:nth-child(4) { animation-delay: 0.2s; }
.table-row:nth-child(5) { animation-delay: 0.25s; }

.table-row:hover {
  background-color: #f8fafc;
}

.col-index {
  width: 60px;
  text-align: center;
}

.index-badge {
  display: inline-block;
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
}

.col-date {
  min-width: 160px;
  color: #64748b;
  font-variant-numeric: tabular-nums;
}

.col-text {
  min-width: 200px;
  max-width: 300px;
}

.text-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.text-preview {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #1e293b;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.875rem;
}

.col-size {
  min-width: 100px;
}

.size-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #f1f5f9;
  color: #475569;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

.col-time {
  min-width: 100px;
  text-align: right;
}

.time-value {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  font-size: 0.9rem;
}

.col-fastest {
  min-width: 140px;
}

.fastest-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  white-space: nowrap;
}

.badge-icon {
  width: 16px;
  height: 16px;
}

.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0 0 12px 12px;
  border-top: 1px solid #e2e8f0;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;
}

.footer-icon {
  width: 18px;
  height: 18px;
}

.footer-info strong {
  color: #1e293b;
}

.algorithm-legend {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--color);
}

/* Responsive */
@media (max-width: 1024px) {
  .data-table {
    font-size: 0.875rem;
  }

  .data-table th,
  .data-table td {
    padding: 0.75rem;
  }

  .col-text {
    max-width: 200px;
  }
}

@media (max-width: 768px) {
  .table-wrapper {
    border-radius: 8px;
  }

  .data-table {
    font-size: 0.8125rem;
  }

  .data-table th,
  .data-table td {
    padding: 0.625rem;
  }

  .index-badge {
    width: 28px;
    height: 28px;
    line-height: 28px;
    font-size: 0.8125rem;
  }

  .col-date {
    min-width: 120px;
    font-size: 0.75rem;
  }

  .col-text {
    max-width: 150px;
  }

  .text-preview {
    font-size: 0.8125rem;
  }

  .table-footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .algorithm-legend {
    width: 100%;
    justify-content: space-around;
  }
}
</style>