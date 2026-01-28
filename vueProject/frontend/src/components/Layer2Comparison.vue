<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  transactions: {
    type: Array,
    required: true
  }
})

// Configuración de Layer 2
const batchSize = ref(100)
const selectedRollup = ref('optimistic-arbitrum')

// Datos reales de Layer 2 (basados en investigación)
const rollupConfigs = {
  'layer1': {
    name: 'Ethereum Layer 1',
    type: 'Mainnet',
    algorithm: 'KECCAK-256',
    gasPerTx: 21000,
    blockTime: 12000, // 12 segundos
    tpsLimit: 30,
    costMultiplier: 1,
    color: '#627eea',
    description: 'Red principal de Ethereum sin optimizaciones'
  },
  'optimistic-arbitrum': {
    name: 'Arbitrum One',
    type: 'Optimistic Rollup',
    algorithm: 'KECCAK-256',
    gasPerTx: 2100, // ~90% reducción
    blockTime: 250, // 250ms
    tpsLimit: 4000,
    costMultiplier: 0.1,
    color: '#28a0f0',
    description: 'Optimistic Rollup con fraud proofs'
  },
  'optimistic-optimism': {
    name: 'Optimism',
    type: 'Optimistic Rollup',
    algorithm: 'KECCAK-256',
    gasPerTx: 2200,
    blockTime: 250,
    tpsLimit: 3500,
    costMultiplier: 0.11,
    color: '#ff0420',
    description: 'Optimistic Rollup con EVM equivalence'
  },
  'zk-zksync': {
    name: 'zkSync Era',
    type: 'ZK-Rollup',
    algorithm: 'SHA-256 + ZK-SNARK',
    gasPerTx: 1500, // Más eficiente en batch
    blockTime: 200,
    tpsLimit: 2000,
    costMultiplier: 0.07,
    color: '#8c8dfc',
    description: 'ZK-Rollup con validity proofs'
  },
  'zk-starknet': {
    name: 'StarkNet',
    type: 'ZK-Rollup',
    algorithm: 'Pedersen Hash + STARK',
    gasPerTx: 1800,
    blockTime: 300,
    tpsLimit: 1500,
    costMultiplier: 0.085,
    color: '#ec796b',
    description: 'ZK-Rollup con STARKs (más escalable)'
  }
}

// Obtener tiempo promedio de KECCAK-256 de las transacciones
const avgKeccakTime = computed(() => {
  if (props.transactions.length === 0) return 0.0068 // Default
  const times = props.transactions.map(t => t.keccak256Time * 1000)
  return times.reduce((a, b) => a + b, 0) / times.length
})

// Obtener costo promedio de KECCAK-256
const avgKeccakCost = computed(() => {
  if (props.transactions.length === 0) return 10821.24 // Default
  const costs = props.transactions.map(t => t.keccak256BasePrice * 1e9)
  return costs.reduce((a, b) => a + b, 0) / costs.length
})

// Calcular métricas para cada Rollup
const rollupMetrics = computed(() => {
  const metrics = {}
  
  for (const [key, config] of Object.entries(rollupConfigs)) {
    // TPS teórico basado en el tiempo de hashing
    const hashTimePerTx = avgKeccakTime.value * 2 // input + output hash
    const theoreticalTPS = config.tpsLimit
    
    // Costo por transacción
    const gasCostGwei = config.gasPerTx * 0.001 // Simulado
    const l2SpecificCost = avgKeccakCost.value * config.costMultiplier
    const totalCostPerTx = gasCostGwei + l2SpecificCost
    
    // Costo del batch
    const batchCost = totalCostPerTx * batchSize.value
    
    // Tiempo del batch
    const batchHashTime = hashTimePerTx * batchSize.value
    const batchProcessTime = batchHashTime + config.blockTime
    
    // Throughput
    const throughput = (batchSize.value / batchProcessTime) * 1000 // TPS
    
    // Ahorro vs L1
    const l1Cost = rollupConfigs['layer1'].gasPerTx * 0.001 + avgKeccakCost.value
    const savings = ((l1Cost - totalCostPerTx) / l1Cost) * 100
    
    metrics[key] = {
      theoreticalTPS,
      costPerTx: totalCostPerTx,
      batchCost,
      batchTime: batchProcessTime,
      throughput,
      savings: Math.max(0, savings),
      efficiency: (theoreticalTPS / totalCostPerTx).toFixed(2)
    }
  }
  
  return metrics
})

// Comparativa detallada del Rollup seleccionado vs L1
const comparison = computed(() => {
  const l1 = rollupMetrics.value['layer1']
  const l2 = rollupMetrics.value[selectedRollup.value]
  
  // Si el rollup seleccionado ES Layer 1, comparar consigo mismo da 0
  const isL1Selected = selectedRollup.value === 'layer1'
  
  return {
    costReduction: isL1Selected ? 0 : l1.costPerTx - l2.costPerTx,
    costReductionPercent: isL1Selected ? '0.0' : ((l1.costPerTx - l2.costPerTx) / l1.costPerTx * 100).toFixed(1),
    tpsIncrease: isL1Selected ? 0 : l2.theoreticalTPS - l1.theoreticalTPS,
    tpsIncreasePercent: isL1Selected ? '0' : ((l2.theoreticalTPS - l1.theoreticalTPS) / l1.theoreticalTPS * 100).toFixed(0),
    timeReduction: isL1Selected ? 0 : l1.batchTime - l2.batchTime,
    batchSavings: isL1Selected ? 0 : l1.batchCost - l2.batchCost,
    isL1Selected
  }
})

// Simulación de transacciones diarias
const dailyTransactions = ref(10000)
const dailyMetrics = computed(() => {
  const l1 = rollupMetrics.value['layer1']
  const l2 = rollupMetrics.value[selectedRollup.value]
  
  const l1DailyCost = l1.costPerTx * dailyTransactions.value
  const l2DailyCost = l2.costPerTx * dailyTransactions.value
  const dailySavings = l1DailyCost - l2DailyCost
  const savingsPercent = ((dailySavings / l1DailyCost) * 100).toFixed(1)
  
  return {
    l1Cost: l1DailyCost.toFixed(2),
    l2Cost: l2DailyCost.toFixed(2),
    savings: dailySavings.toFixed(2),
    savingsPercent: savingsPercent,
    isL1Selected: selectedRollup.value === 'layer1'
  }
})
</script>

<template>
  <div class="layer2-comparison">
    <!-- Header -->
    <div class="comparison-header">
      <div class="header-icon-wrapper">
        <svg class="header-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <div>
          <h3 class="comparison-title">Comparación Ethereum Layer 2</h3>
          <p class="comparison-subtitle">Análisis de Optimistic Rollups vs ZK-Rollups vs Layer 1</p>
        </div>
      </div>
    </div>

    <!-- Controles -->
    <div class="controls-section">
      <div class="control-group">
        <label class="control-label">Tamaño del Batch</label>
        <div class="slider-container">
          <input 
            type="range" 
            v-model="batchSize" 
            min="10" 
            max="1000" 
            step="10"
            class="slider"
          />
          <span class="slider-value">{{ batchSize }} transacciones</span>
        </div>
        <div class="control-explanation">
          <svg xmlns="http://www.w3.org/2000/svg" class="info-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            Cambia: <strong>Costo total del batch</strong> y <strong>tiempo total</strong>. 
            NO cambia: costo por transacción ni % de ahorro.
          </span>
        </div>
      </div>

      <div class="control-group">
        <label class="control-label">Transacciones Diarias (Simulación)</label>
        <div class="slider-container">
          <input 
            type="range" 
            v-model="dailyTransactions" 
            min="1000" 
            max="1000000" 
            step="1000"
            class="slider"
          />
          <span class="slider-value">{{ dailyTransactions.toLocaleString() }} tx/día</span>
        </div>
        <div class="control-explanation">
          <svg xmlns="http://www.w3.org/2000/svg" class="info-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            Cambia: <strong>Ahorro total en USD/día</strong>. 
            NO cambia: % de ahorro (siempre {{ comparison.costReductionPercent }}% para {{ rollupConfigs[selectedRollup].name }}).
          </span>
        </div>
      </div>
    </div>

    <!-- Selector de Rollup -->
    <div class="rollup-selector">
      <h4 class="selector-title">Selecciona Layer 2 para Comparar</h4>
      <div class="rollup-grid">
        <button
          v-for="(config, key) in rollupConfigs"
          :key="key"
          @click="selectedRollup = key"
          class="rollup-button"
          :class="{ 
            active: selectedRollup === key,
            'is-l1': key === 'layer1'
          }"
          :style="{ '--rollup-color': config.color }"
        >
          <div class="rollup-button-header">
            <span class="rollup-name">{{ config.name }}</span>
            <span class="rollup-type">{{ config.type }}</span>
          </div>
          <div class="rollup-algorithm">{{ config.algorithm }}</div>
        </button>
      </div>
    </div>

    <!-- Comparación Principal: L1 vs L2 Seleccionado -->
    <div class="main-comparison">
      <h4 class="section-title">
        <svg xmlns="http://www.w3.org/2000/svg" class="title-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Layer 1 vs {{ rollupConfigs[selectedRollup].name }}
      </h4>

      <div class="comparison-cards">
        <!-- Layer 1 Card (SIEMPRE A LA IZQUIERDA) -->
        <div class="comparison-card l1-card">
          <div class="card-badge" style="background: #627eea;">Layer 1</div>
          <h5 class="card-title">Ethereum Mainnet</h5>
          
          <div class="metric-list">
            <div class="metric-item">
              <span class="metric-label">TPS Límite</span>
              <span class="metric-value">{{ rollupMetrics['layer1'].theoreticalTPS }} TPS</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Costo/Tx</span>
              <span class="metric-value">{{ rollupMetrics['layer1'].costPerTx.toFixed(4) }} Gwei</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Tiempo Batch ({{ batchSize }} tx)</span>
              <span class="metric-value">{{ rollupMetrics['layer1'].batchTime.toFixed(0) }} ms</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Costo Batch</span>
              <span class="metric-value">{{ rollupMetrics['layer1'].batchCost.toFixed(2) }} Gwei</span>
            </div>
          </div>
        </div>

        <!-- Arrow -->
        <div class="comparison-arrow">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          <div class="arrow-stats" v-if="!comparison.isL1Selected">
            <div class="arrow-stat success">
              <span class="stat-icon">↓</span>
              <span>{{ comparison.costReductionPercent }}% menos costo</span>
            </div>
            <div class="arrow-stat success">
              <span class="stat-icon">↑</span>
              <span>{{ comparison.tpsIncreasePercent }}% más TPS</span>
            </div>
          </div>
          <div class="arrow-stats" v-else>
            <div class="arrow-stat neutral">
              <span>Misma red</span>
            </div>
          </div>
        </div>

        <!-- Layer 2 Card (ROLLUP SELECCIONADO) -->
        <div class="comparison-card l2-card">
          <div class="card-badge" :style="{ background: rollupConfigs[selectedRollup].color }">
            {{ rollupConfigs[selectedRollup].type }}
          </div>
          <h5 class="card-title">{{ rollupConfigs[selectedRollup].name }}</h5>
          
          <div class="metric-list">
            <div class="metric-item">
              <span class="metric-label">TPS Límite</span>
              <span class="metric-value" :class="{ highlight: !comparison.isL1Selected }">
                {{ rollupMetrics[selectedRollup].theoreticalTPS }} TPS
              </span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Costo/Tx</span>
              <span class="metric-value" :class="{ highlight: !comparison.isL1Selected }">
                {{ rollupMetrics[selectedRollup].costPerTx.toFixed(4) }} Gwei
              </span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Tiempo Batch ({{ batchSize }} tx)</span>
              <span class="metric-value" :class="{ highlight: !comparison.isL1Selected }">
                {{ rollupMetrics[selectedRollup].batchTime.toFixed(0) }} ms
              </span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Costo Batch</span>
              <span class="metric-value" :class="{ highlight: !comparison.isL1Selected }">
                {{ rollupMetrics[selectedRollup].batchCost.toFixed(2) }} Gwei
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla Comparativa Completa -->
    <div class="full-comparison-table">
      <h4 class="section-title">
        <svg xmlns="http://www.w3.org/2000/svg" class="title-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        Comparación Detallada de Todas las Soluciones
      </h4>
      
      <div class="table-wrapper">
        <table class="comparison-table">
          <thead>
            <tr>
              <th>Solución</th>
              <th>Tipo</th>
              <th>Algoritmo</th>
              <th>TPS Máximo</th>
              <th>Costo/Tx (Gwei)</th>
              <th>Ahorro vs L1</th>
              <th>Eficiencia</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(config, key) in rollupConfigs" 
              :key="key"
              :class="{ 'selected-row': key === selectedRollup }"
            >
              <td>
                <div class="solution-cell">
                  <span 
                    class="solution-indicator" 
                    :style="{ background: config.color }"
                  ></span>
                  <strong>{{ config.name }}</strong>
                </div>
              </td>
              <td>
                <span class="type-badge" :class="key === 'layer1' ? 'l1' : 'l2'">
                  {{ config.type }}
                </span>
              </td>
              <td class="algorithm-cell">{{ config.algorithm }}</td>
              <td class="number-cell">{{ rollupMetrics[key].theoreticalTPS.toLocaleString() }}</td>
              <td class="number-cell">{{ rollupMetrics[key].costPerTx.toFixed(4) }}</td>
              <td class="number-cell">
                <span 
                  class="savings-badge" 
                  :class="rollupMetrics[key].savings > 0 ? 'positive' : 'neutral'"
                >
                  {{ rollupMetrics[key].savings > 0 ? '-' : '' }}{{ rollupMetrics[key].savings.toFixed(1) }}%
                </span>
              </td>
              <td class="number-cell">{{ rollupMetrics[key].efficiency }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Simulación de Costos Diarios -->
    <div class="daily-simulation">
      <h4 class="section-title">
        <svg xmlns="http://www.w3.org/2000/svg" class="title-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Proyección de Costos: {{ dailyTransactions.toLocaleString() }} transacciones/día
      </h4>

      <div class="simulation-grid">
        <div class="simulation-card">
          <div class="sim-label">Costo en Layer 1</div>
          <div class="sim-value l1">{{ parseFloat(dailyMetrics.l1Cost).toLocaleString() }} Gwei</div>
          <div class="sim-detail">≈ ${{ (dailyMetrics.l1Cost * 0.0000001 * 2000).toFixed(2) }} USD</div>
        </div>

        <div class="simulation-arrow">→</div>

        <div class="simulation-card">
          <div class="sim-label">Costo en {{ rollupConfigs[selectedRollup].name }}</div>
          <div class="sim-value l2">{{ parseFloat(dailyMetrics.l2Cost).toLocaleString() }} Gwei</div>
          <div class="sim-detail">≈ ${{ (dailyMetrics.l2Cost * 0.0000001 * 2000).toFixed(2) }} USD</div>
        </div>

        <div class="simulation-savings" v-if="!dailyMetrics.isL1Selected">
          <div class="savings-icon">💰</div>
          <div class="savings-content">
            <div class="savings-label">Ahorro Diario</div>
            <div class="savings-amount">{{ parseFloat(dailyMetrics.savings).toLocaleString() }} Gwei</div>
            <div class="savings-percent">{{ dailyMetrics.savingsPercent }}% menos</div>
            <div class="savings-usd">≈ ${{ (dailyMetrics.savings * 0.0000001 * 2000).toFixed(2) }} USD/día</div>
          </div>
        </div>
        
        <div class="simulation-savings neutral" v-else>
          <div class="savings-icon">ℹ️</div>
          <div class="savings-content">
            <div class="savings-label">Sin Ahorro</div>
            <div class="savings-amount">0.00 Gwei</div>
            <div class="savings-percent">Misma red</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Explicación Técnica -->
    <div class="technical-explanation">
      <h4 class="section-title">
        <svg xmlns="http://www.w3.org/2000/svg" class="title-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Cómo Funciona {{ rollupConfigs[selectedRollup].name }}
      </h4>
      
      <div class="explanation-content">
        <p class="explanation-text">{{ rollupConfigs[selectedRollup].description }}</p>
        
        <div class="tech-specs">
          <div class="spec-item">
            <strong>Algoritmo:</strong> {{ rollupConfigs[selectedRollup].algorithm }}
          </div>
          <div class="spec-item">
            <strong>Tiempo de Bloque:</strong> {{ rollupConfigs[selectedRollup].blockTime }}ms
          </div>
          <div class="spec-item">
            <strong>Gas por Tx:</strong> {{ rollupConfigs[selectedRollup].gasPerTx }} gas
          </div>
        </div>

        <div class="batching-explanation">
          <h5>Proceso de Batching:</h5>
          <ol>
            <li>Se agrupan {{ batchSize }} transacciones off-chain</li>
            <li>Se procesan usando {{ rollupConfigs[selectedRollup].algorithm }}</li>
            <li>Se genera una prueba criptográfica comprimida</li>
            <li>Solo la prueba se publica en Layer 1</li>
            <li>Ahorro: {{ comparison.costReductionPercent }}% en costos</li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.layer2-comparison {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.comparison-header {
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
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 10px;
  color: #d97706;
  flex-shrink: 0;
}

.comparison-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
  letter-spacing: -0.01em;
}

.comparison-subtitle {
  font-size: 0.9375rem;
  color: #64748b;
  margin: 0;
}

/* Controls */
.controls-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.control-explanation {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  font-size: 0.8125rem;
  color: #1e40af;
  line-height: 1.5;
}

.info-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.control-explanation strong {
  font-weight: 700;
  color: #0369a1;
}

.control-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.slider-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e2e8f0;
  outline: none;
  -webkit-appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #0284c7;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #0284c7;
  cursor: pointer;
  border: none;
}

.slider-value {
  font-size: 1rem;
  font-weight: 700;
  color: #0284c7;
}

/* Rollup Selector */
.rollup-selector {
  padding: 1.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
}

.selector-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 1rem 0;
}

.rollup-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.rollup-button {
  padding: 1.25rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.rollup-button:hover {
  border-color: var(--rollup-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.rollup-button.active {
  border-color: var(--rollup-color);
  background: linear-gradient(135deg, var(--rollup-color)10, var(--rollup-color)20);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.rollup-button.is-l1 {
  border-width: 3px;
}

.rollup-button-header {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-bottom: 0.5rem;
}

.rollup-name {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
}

.rollup-type {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.rollup-algorithm {
  font-size: 0.8125rem;
  color: #475569;
  font-family: 'Courier New', monospace;
}

/* Main Comparison */
.main-comparison {
  padding: 1.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 1.5rem 0;
}

.title-icon {
  width: 20px;
  height: 20px;
  color: #0284c7;
}

.comparison-cards {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 2rem;
  align-items: center;
}

.comparison-card {
  padding: 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  position: relative;
}

.l1-card {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-color: #93c5fd;
}

.l2-card {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-color: #86efac;
}

.card-badge {
  position: absolute;
  top: -12px;
  left: 1rem;
  padding: 0.375rem 0.875rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0.75rem 0 1rem 0;
}

.metric-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.625rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 6px;
}

.metric-label {
  font-size: 0.8125rem;
  color: #64748b;
  font-weight: 500;
}

.metric-value {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #1e293b;
  font-variant-numeric: tabular-nums;
}

.metric-value.highlight {
  color: #059669;
}

.comparison-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.comparison-arrow svg {
  width: 40px;
  height: 40px;
  color: #0284c7;
}

.arrow-stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.arrow-stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  background: white;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  white-space: nowrap;
}

.arrow-stat.success {
  color: #059669;
  border: 1px solid #86efac;
}

.arrow-stat.neutral {
  color: #64748b;
  border: 1px solid #cbd5e1;
}

.stat-icon {
  font-size: 1.25rem;
  font-weight: 700;
}

/* Table */
.full-comparison-table {
  padding: 1.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
}

.table-wrapper {
  overflow-x: auto;
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.comparison-table th {
  padding: 0.875rem 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #475569;
  background: #f8fafc;
  border-bottom: 2px solid #e5e7eb;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.comparison-table td {
  padding: 1rem 0.75rem;
  border-bottom: 1px solid #f1f5f9;
}

.comparison-table tr:hover {
  background: #f8fafc;
}

.comparison-table tr.selected-row {
  background: #eff6ff;
}

.solution-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.solution-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.type-badge {
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.type-badge.l1 {
  background: #dbeafe;
  color: #1e40af;
}

.type-badge.l2 {
  background: #dcfce7;
  color: #15803d;
}

.algorithm-cell {
  font-family: 'Courier New', monospace;
  font-size: 0.8125rem;
  color: #475569;
}

.number-cell {
  text-align: right;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  color: #1e293b;
}

.savings-badge {
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  font-size: 0.8125rem;
  font-weight: 700;
}

.savings-badge.positive {
  background: #dcfce7;
  color: #15803d;
}

.savings-badge.neutral {
  background: #f1f5f9;
  color: #64748b;
}

/* Daily Simulation */
.daily-simulation {
  padding: 1.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
}

.simulation-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto;
  gap: 1.5rem;
  align-items: center;
}

.simulation-card {
  padding: 1.5rem;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  text-align: center;
}

.sim-label {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.sim-value {
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  font-variant-numeric: tabular-nums;
}

.sim-value.l1 {
  color: #627eea;
}

.sim-value.l2 {
  color: #059669;
}

.sim-detail {
  font-size: 0.8125rem;
  color: #64748b;
}

.simulation-arrow {
  font-size: 2rem;
  color: #cbd5e1;
}

.simulation-savings {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  border: 2px solid #86efac;
  border-radius: 10px;
}

.simulation-savings.neutral {
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border: 2px solid #cbd5e1;
}

.simulation-savings.neutral .savings-label,
.simulation-savings.neutral .savings-amount,
.simulation-savings.neutral .savings-percent {
  color: #64748b;
}

.savings-icon {
  font-size: 3rem;
}

.savings-content {
  flex: 1;
}

.savings-label {
  font-size: 0.875rem;
  color: #15803d;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.savings-amount {
  font-size: 1.5rem;
  font-weight: 800;
  color: #15803d;
  margin-bottom: 0.25rem;
}

.savings-percent {
  font-size: 1rem;
  font-weight: 700;
  color: #059669;
  margin-bottom: 0.25rem;
}

.savings-usd {
  font-size: 0.875rem;
  color: #15803d;
}

/* Technical Explanation */
.technical-explanation {
  padding: 1.5rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 1px solid #fbbf24;
  border-radius: 10px;
}

.explanation-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.explanation-text {
  font-size: 0.9375rem;
  color: #78350f;
  margin: 0;
  line-height: 1.6;
}

.tech-specs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
}

.spec-item {
  font-size: 0.875rem;
  color: #78350f;
}

.spec-item strong {
  color: #92400e;
}

.batching-explanation {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
}

.batching-explanation h5 {
  font-size: 1rem;
  font-weight: 700;
  color: #92400e;
  margin: 0 0 0.75rem 0;
}

.batching-explanation ol {
  margin: 0;
  padding-left: 1.5rem;
}

.batching-explanation li {
  font-size: 0.875rem;
  color: #78350f;
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 1200px) {
  .comparison-cards {
    grid-template-columns: 1fr;
  }

  .comparison-arrow {
    transform: rotate(90deg);
    margin: 1rem 0;
  }

  .simulation-grid {
    grid-template-columns: 1fr;
  }

  .simulation-arrow {
    transform: rotate(90deg);
  }
}

@media (max-width: 768px) {
  .controls-section {
    grid-template-columns: 1fr;
  }

  .rollup-grid {
    grid-template-columns: 1fr;
  }
}
</style>