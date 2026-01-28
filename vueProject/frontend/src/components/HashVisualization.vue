<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  transaction: {
    type: Object,
    required: true
  }
})

const selectedAlgorithm = ref('sha256')

const algorithms = {
  sha256: {
    name: 'SHA-256',
    color: '#0284c7',
    outputSize: 32,
    type: 'Hashing Criptográfico'
  },
  keccak256: {
    name: 'KECCAK-256',
    color: '#7c3aed',
    outputSize: 32,
    type: 'Hashing Criptográfico'
  },
  aes256: {
    name: 'AES-256',
    color: '#059669',
    outputSize: props.transaction.aes256OutputSize,
    type: 'Cifrado Simétrico'
  },
  rsa: {
    name: 'RSA',
    color: '#dc2626',
    outputSize: 256,
    type: 'Cifrado Asimétrico'
  }
}

// Simular el hash en formato hexadecimal
const generateSimulatedHash = (text, size) => {
  let hash = ''
  for (let i = 0; i < size * 2; i++) {
    const charCode = text.charCodeAt(i % text.length) || 0
    const pseudoRandom = (charCode * (i + 1) * 16807) % 256
    hash += pseudoRandom.toString(16).padStart(2, '0')
  }
  return hash
}

const currentHash = computed(() => {
  const algo = algorithms[selectedAlgorithm.value]
  return generateSimulatedHash(props.transaction.text, algo.outputSize)
})

// Convertir hash a matriz de bytes para visualización
const hashMatrix = computed(() => {
  const hash = currentHash.value
  const matrix = []
  const bytesPerRow = 16
  
  for (let i = 0; i < hash.length; i += 2) {
    const byteValue = parseInt(hash.substr(i, 2), 16)
    matrix.push(byteValue)
  }
  
  const rows = []
  for (let i = 0; i < matrix.length; i += bytesPerRow) {
    rows.push(matrix.slice(i, i + bytesPerRow))
  }
  
  return rows
})

// Calcular entropía del hash
const entropy = computed(() => {
  const hash = currentHash.value
  const freq = {}
  
  for (let char of hash) {
    freq[char] = (freq[char] || 0) + 1
  }
  
  let entropy = 0
  const len = hash.length
  
  for (let char in freq) {
    const p = freq[char] / len
    entropy -= p * Math.log2(p)
  }
  
  return entropy.toFixed(3)
})

// Efecto avalancha: cuántos bits cambian con un pequeño cambio
const avalancheEffect = computed(() => {
  const originalHash = currentHash.value
  const modifiedText = props.transaction.text + 'X'
  const modifiedHash = generateSimulatedHash(modifiedText, algorithms[selectedAlgorithm.value].outputSize)
  
  let differentBits = 0
  for (let i = 0; i < originalHash.length; i++) {
    const byte1 = parseInt(originalHash.substr(i, 2), 16)
    const byte2 = parseInt(modifiedHash.substr(i, 2), 16)
    
    let xor = byte1 ^ byte2
    while (xor) {
      differentBits += xor & 1
      xor >>= 1
    }
  }
  
  const totalBits = algorithms[selectedAlgorithm.value].outputSize * 8
  return ((differentBits / totalBits) * 100).toFixed(1)
})

// Obtener color del mapa de calor basado en el valor del byte
const getHeatColor = (value) => {
  const intensity = value / 255
  const hue = 240 - (intensity * 240) // De azul (240) a rojo (0)
  return `hsl(${hue}, 80%, ${50 + intensity * 20}%)`
}
</script>

<template>
  <div class="visualization-container">
    <div class="viz-header">
      <div class="viz-title-section">
        <svg class="viz-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <div>
          <h3 class="viz-title">Visualización del Proceso de Hashing</h3>
          <p class="viz-subtitle">Análisis visual del comportamiento criptográfico</p>
        </div>
      </div>

      <!-- Selector de Algoritmo -->
      <div class="algorithm-selector">
        <button
          v-for="(algo, key) in algorithms"
          :key="key"
          @click="selectedAlgorithm = key"
          class="algo-button"
          :class="{ active: selectedAlgorithm === key }"
          :style="{ '--algo-color': algo.color }"
        >
          {{ algo.name }}
        </button>
      </div>
    </div>

    <div class="viz-content">
      <!-- Información del Algoritmo -->
      <div class="algo-info-card">
        <div class="info-row">
          <span class="info-label">Algoritmo</span>
          <span class="info-value">{{ algorithms[selectedAlgorithm].name }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Tipo</span>
          <span class="info-value">{{ algorithms[selectedAlgorithm].type }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Tamaño de Salida</span>
          <span class="info-value">{{ algorithms[selectedAlgorithm].outputSize * 8 }} bits</span>
        </div>
        <div class="info-row">
          <span class="info-label">Entropía</span>
          <span class="info-value">{{ entropy }} bits/símbolo</span>
        </div>
        <div class="info-row">
          <span class="info-label">Efecto Avalancha</span>
          <span class="info-value highlight">{{ avalancheEffect }}%</span>
        </div>
      </div>

      <!-- Proceso Visual -->
      <div class="process-visual">
        <div class="process-step">
          <div class="step-label">Entrada</div>
          <div class="input-box">{{ transaction.text }}</div>
          <div class="step-size">{{ transaction.text.length }} caracteres</div>
        </div>

        <div class="process-arrow">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          <div class="arrow-label">{{ algorithms[selectedAlgorithm].name }}</div>
        </div>

        <div class="process-step">
          <div class="step-label">Salida (Hash)</div>
          <div class="output-box">{{ currentHash.substring(0, 32) }}...</div>
          <div class="step-size">{{ algorithms[selectedAlgorithm].outputSize * 8 }} bits</div>
        </div>
      </div>

      <!-- Mapa de Calor -->
      <div class="heatmap-section">
        <h4 class="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" class="title-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
          Mapa de Calor de Bytes
        </h4>
        <p class="section-description">
          Representación visual de la distribución de valores en el hash (azul = bajo, rojo = alto)
        </p>
        <div class="heatmap-container">
          <div class="heatmap">
            <div v-for="(row, rowIndex) in hashMatrix" :key="rowIndex" class="heatmap-row">
              <div
                v-for="(byte, byteIndex) in row"
                :key="byteIndex"
                class="heatmap-cell"
                :style="{ backgroundColor: getHeatColor(byte) }"
                :title="`Byte ${rowIndex * 16 + byteIndex}: ${byte} (0x${byte.toString(16).padStart(2, '0')})`"
              >
              </div>
            </div>
          </div>
          <div class="heatmap-legend">
            <span>0</span>
            <div class="legend-gradient"></div>
            <span>255</span>
          </div>
        </div>
      </div>

      <!-- Distribución de Bits -->
      <div class="distribution-section">
        <h4 class="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" class="title-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Análisis de Distribución
        </h4>
        <div class="distribution-grid">
          <div class="dist-card">
            <div class="dist-label">Uniformidad</div>
            <div class="dist-value">Alta</div>
            <div class="dist-description">Los valores están bien distribuidos</div>
          </div>
          <div class="dist-card">
            <div class="dist-label">Entropía</div>
            <div class="dist-value">{{ entropy }}</div>
            <div class="dist-description">bits por símbolo</div>
          </div>
          <div class="dist-card">
            <div class="dist-label">Efecto Avalancha</div>
            <div class="dist-value">{{ avalancheEffect }}%</div>
            <div class="dist-description">de bits cambiados</div>
          </div>
        </div>
      </div>

      <!-- Explicación del Efecto Avalancha -->
      <div class="avalanche-explanation">
        <div class="explanation-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="explanation-content">
          <h5>¿Qué es el Efecto Avalancha?</h5>
          <p>
            Un cambio mínimo en la entrada (añadir un solo carácter) debe cambiar aproximadamente el 50% de los bits
            en el hash resultante. Esto garantiza que hashes similares produzcan salidas completamente diferentes.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.visualization-container {
  margin-bottom: 2rem;
}

.viz-header {
  margin-bottom: 1.5rem;
}

.viz-title-section {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.viz-icon {
  width: 40px;
  height: 40px;
  padding: 8px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 10px;
  color: #d97706;
  flex-shrink: 0;
}

.viz-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
  letter-spacing: -0.01em;
}

.viz-subtitle {
  font-size: 0.9375rem;
  color: #64748b;
  margin: 0;
}

.algorithm-selector {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.algo-button {
  padding: 0.625rem 1.25rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.algo-button:hover {
  border-color: #cbd5e1;
  transform: translateY(-1px);
}

.algo-button.active {
  background: var(--algo-color);
  border-color: var(--algo-color);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.viz-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.algo-info-card {
  padding: 1.25rem;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #1e293b;
}

.info-value.highlight {
  color: #d97706;
  font-size: 1.125rem;
}

.process-visual {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1.5rem;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 1px solid #bae6fd;
  border-radius: 10px;
}

.process-step {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.step-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #0369a1;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input-box,
.output-box {
  padding: 0.875rem;
  background: white;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  color: #1e293b;
  word-break: break-all;
  line-height: 1.5;
}

.step-size {
  font-size: 0.8125rem;
  color: #64748b;
  font-weight: 500;
}

.process-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.process-arrow svg {
  width: 32px;
  height: 32px;
  color: #0284c7;
}

.arrow-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #0369a1;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.heatmap-section,
.distribution-section {
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
  margin: 0 0 0.5rem 0;
}

.title-icon {
  width: 20px;
  height: 20px;
  color: #0284c7;
}

.section-description {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 1.25rem 0;
  line-height: 1.5;
}

.heatmap-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.heatmap {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  overflow-x: auto;
}

.heatmap-row {
  display: flex;
  gap: 2px;
}

.heatmap-cell {
  width: 24px;
  height: 24px;
  border-radius: 3px;
  cursor: pointer;
  transition: transform 0.2s;
  flex-shrink: 0;
}

.heatmap-cell:hover {
  transform: scale(1.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.heatmap-legend {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
}

.legend-gradient {
  flex: 1;
  height: 20px;
  background: linear-gradient(90deg, 
    hsl(240, 80%, 50%) 0%,
    hsl(180, 80%, 50%) 25%,
    hsl(120, 80%, 50%) 50%,
    hsl(60, 80%, 50%) 75%,
    hsl(0, 80%, 50%) 100%
  );
  border-radius: 4px;
}

.distribution-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.dist-card {
  padding: 1.25rem;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  text-align: center;
}

.dist-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.dist-value {
  font-size: 1.875rem;
  font-weight: 800;
  color: #0284c7;
  margin-bottom: 0.5rem;
}

.dist-description {
  font-size: 0.8125rem;
  color: #64748b;
}

.avalanche-explanation {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 1px solid #bae6fd;
  border-radius: 10px;
}

.explanation-icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 10px;
}

.explanation-icon svg {
  width: 24px;
  height: 24px;
  color: #0284c7;
}

.explanation-content h5 {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.explanation-content p {
  font-size: 0.9375rem;
  color: #475569;
  margin: 0;
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 1024px) {
  .process-visual {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .process-arrow {
    transform: rotate(90deg);
  }
}

@media (max-width: 768px) {
  .heatmap-cell {
    width: 20px;
    height: 20px;
  }

  .distribution-grid {
    grid-template-columns: 1fr;
  }
}
</style>