<script setup>
import { ref } from 'vue'
import TransactionForm from './components/TransactionForm.vue'
import TransactionTable from './components/TransactionTable.vue'
import CryptoCards from './components/CryptoCards.vue'
import HashVisualization from './components/HashVisualization.vue'
import AdvancedAnalytics from './components/AdvancedAnalytics.vue'
import Layer2Comparison from './components/Layer2Comparison.vue'

const transactions = ref([])
const activeTab = ref('analyzer')

const addTransaction = (transaction) => {
  transactions.value.push(transaction)
  // Auto-switch to results after first analysis
  if (transactions.value.length === 1) {
    activeTab.value = 'results'
  }
}

const tabs = [
  {
    id: 'analyzer',
    name: 'Analizador',
    icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    badge: null
  },
  {
    id: 'results',
    name: 'Resultados',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    badge: null,
    disabled: () => transactions.value.length === 0
  },
  {
    id: 'statistics',
    name: 'Estadísticas',
    icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    badge: null,
    disabled: () => transactions.value.length === 0
  },
  {
    id: 'layer2',
    name: 'Layer 2',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    badge: null,
    disabled: () => transactions.value.length === 0
  },
  {
    id: 'history',
    name: 'Historial',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    badge: () => transactions.value.length > 0 ? transactions.value.length : null,
    disabled: () => transactions.value.length === 0
  }
]
</script>

<template>
  <div class="app-container">
    <!-- Header -->
    <header class="app-header">
      <div class="header-content">
        <div class="header-left">
          <div class="logo-container">
            <svg class="logo-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div class="logo-text">
              <h1>CryptoAnalyzer</h1>
              <span class="tagline">Professional Edition</span>
            </div>
          </div>
        </div>
        <div class="header-right">
          <div class="header-meta">
            <span class="project-label">Proyecto Final</span>
            <span class="separator">•</span>
            <span class="course-name">Sistemas Operativos & Blockchain</span>
          </div>
        </div>
      </div>
      <div class="header-divider"></div>
      <p class="header-description">
        Análisis integrado de algoritmos criptográficos y soluciones Ethereum Layer 2
      </p>
    </header>

    <!-- Navigation Tabs -->
    <nav class="tabs-navigation">
      <div class="tabs-container">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :disabled="tab.disabled && tab.disabled()"
          :class="[
            'tab-button',
            { 'active': activeTab === tab.id },
            { 'disabled': tab.disabled && tab.disabled() }
          ]"
        >
          <svg class="tab-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="tab.icon" />
          </svg>
          <span class="tab-name">{{ tab.name }}</span>
          <span v-if="tab.badge && tab.badge()" class="tab-badge">{{ tab.badge() }}</span>
        </button>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Tab: Analyzer -->
      <div v-show="activeTab === 'analyzer'" class="tab-content">
        <TransactionForm @created="addTransaction" />
      </div>

      <!-- Tab: Results -->
      <div v-show="activeTab === 'results'" class="tab-content">
        <div v-if="transactions.length === 0" class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" class="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3>Sin Análisis Disponibles</h3>
          <p>Ejecuta tu primer análisis en la pestaña "Analizador"</p>
          <button @click="activeTab = 'analyzer'" class="cta-button">
            Ir al Analizador
          </button>
        </div>

        <div v-else class="results-container">
          <div class="results-header">
            <div>
              <h2 class="content-title">Análisis de Rendimiento</h2>
              <p class="content-subtitle">Última ejecución: {{ new Date().toLocaleString('es-ES') }}</p>
            </div>
          </div>

          <CryptoCards :transaction="transactions.at(-1)" />
          <HashVisualization :transaction="transactions.at(-1)" />
        </div>
      </div>

      <!-- Tab: Statistics -->
      <div v-show="activeTab === 'statistics'" class="tab-content">
        <div v-if="transactions.length === 0" class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" class="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3>Sin Datos Estadísticos</h3>
          <p>Necesitas al menos 1 análisis para ver estadísticas</p>
          <button @click="activeTab = 'analyzer'" class="cta-button">
            Ir al Analizador
          </button>
        </div>

        <div v-else class="statistics-container">
          <div class="results-header">
            <div>
              <h2 class="content-title">Análisis Estadístico Avanzado</h2>
              <p class="content-subtitle">{{ transactions.length }} ejecuciones analizadas</p>
            </div>
          </div>

          <AdvancedAnalytics :transactions="transactions" />
        </div>
      </div>

      <!-- Tab: Layer 2 -->
      <div v-show="activeTab === 'layer2'" class="tab-content">
        <div v-if="transactions.length === 0" class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" class="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h3>Comparación Layer 2</h3>
          <p>Ejecuta análisis para comparar soluciones Ethereum Layer 2</p>
          <button @click="activeTab = 'analyzer'" class="cta-button">
            Ir al Analizador
          </button>
        </div>

        <div v-else class="layer2-container">
          <div class="results-header">
            <div>
              <h2 class="content-title">Análisis Ethereum Layer 2</h2>
              <p class="content-subtitle">Comparación: Optimistic Rollups vs ZK-Rollups vs Layer 1</p>
            </div>
          </div>

          <Layer2Comparison :transactions="transactions" />
        </div>
      </div>

      <!-- Tab: History -->
      <div v-show="activeTab === 'history'" class="tab-content">
        <div v-if="transactions.length === 0" class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" class="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3>Historial Vacío</h3>
          <p>Tus análisis aparecerán aquí</p>
          <button @click="activeTab = 'analyzer'" class="cta-button">
            Ir al Analizador
          </button>
        </div>

        <div v-else class="history-container">
          <div class="results-header">
            <div>
              <h2 class="content-title">Historial de Pruebas</h2>
              <p class="content-subtitle">{{ transactions.length }} análisis completados</p>
            </div>
          </div>

          <TransactionTable :transactions="transactions" />
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="app-footer">
      <div class="footer-content">
        <p class="footer-text">
          © 2026 CryptoAnalyzer Professional Edition
          <span class="separator">•</span>
          <span class="footer-badge">ESPE - Sistemas Operativos</span>
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
}

/* Header */
.app-header {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: white;
  padding: 1.5rem 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  flex: 1;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-icon {
  width: 48px;
  height: 48px;
  padding: 10px;
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(2, 132, 199, 0.3);
}

.logo-text h1 {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.025em;
}

.tagline {
  font-size: 0.8125rem;
  color: #94a3b8;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.header-right {
  display: flex;
  align-items: center;
}

.header-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
}

.project-label {
  padding: 0.375rem 0.875rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  font-weight: 600;
}

.separator {
  color: #64748b;
}

.course-name {
  color: #cbd5e1;
  font-weight: 500;
}

.header-divider {
  height: 4px;
  background: linear-gradient(90deg, #0284c7 0%, #7c3aed 33%, #059669 66%, #dc2626 100%);
  border-radius: 2px;
  margin: 1rem 0;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
}

.header-description {
  max-width: 1400px;
  margin: 0 auto;
  font-size: 0.9375rem;
  color: #cbd5e1;
  line-height: 1.5;
}

/* Navigation Tabs */
.tabs-navigation {
  background: white;
  border-bottom: 2px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.tabs-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  padding: 0 2rem;
  overflow-x: auto;
  scrollbar-width: none;
}

.tabs-container::-webkit-scrollbar {
  display: none;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 1rem 1.5rem;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  color: #64748b;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  position: relative;
}

.tab-button:hover:not(.disabled) {
  color: #1e293b;
  background: #f8fafc;
}

.tab-button.active {
  color: #0284c7;
  border-bottom-color: #0284c7;
  background: linear-gradient(180deg, rgba(2, 132, 199, 0.05) 0%, transparent 100%);
}

.tab-button.disabled {
  color: #cbd5e1;
  cursor: not-allowed;
  opacity: 0.5;
}

.tab-icon {
  width: 20px;
  height: 20px;
}

.tab-badge {
  min-width: 20px;
  height: 20px;
  padding: 0 0.375rem;
  background: #0284c7;
  color: white;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-button.active .tab-badge {
  background: #0369a1;
}

/* Main Content */
.main-content {
  flex: 1;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
}

.tab-content {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background: white;
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
  min-height: 400px;
}

.empty-icon {
  width: 80px;
  height: 80px;
  color: #cbd5e1;
  margin-bottom: 1.5rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  font-size: 1rem;
  color: #64748b;
  margin: 0 0 2rem 0;
}

.cta-button {
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(2, 132, 199, 0.4);
}

/* Content Containers */
.results-container,
.statistics-container,
.layer2-container,
.history-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.content-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
  letter-spacing: -0.01em;
}

.content-subtitle {
  font-size: 0.9375rem;
  color: #64748b;
  margin: 0;
}

/* Footer */
.app-footer {
  background: white;
  border-top: 1px solid #e5e7eb;
  padding: 1.5rem 2rem;
  margin-top: auto;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  text-align: center;
}

.footer-text {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.footer-badge {
  padding: 0.25rem 0.75rem;
  background: #f1f5f9;
  border-radius: 6px;
  font-weight: 600;
  color: #475569;
}

/* Responsive */
@media (max-width: 768px) {
  .app-header {
    padding: 1rem;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .header-right {
    width: 100%;
  }

  .header-meta {
    flex-wrap: wrap;
  }

  .tabs-container {
    padding: 0 1rem;
  }

  .tab-button {
    padding: 0.875rem 1rem;
    font-size: 0.875rem;
  }

  .tab-icon {
    width: 18px;
    height: 18px;
  }

  .tab-name {
    display: none;
  }

  .main-content {
    padding: 1rem;
  }

  .content-title {
    font-size: 1.5rem;
  }

  .empty-state {
    padding: 3rem 1.5rem;
    min-height: 300px;
  }

  .empty-icon {
    width: 60px;
    height: 60px;
  }
}
</style>