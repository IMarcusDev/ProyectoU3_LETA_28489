<script setup>
import { ref, computed } from 'vue'
import { createTransaction } from '../api/transactions'

const text = ref('')
const emit = defineEmits(['created'])
const isLoading = ref(false)
const error = ref(null)

const charCount = computed(() => text.value.length)
const byteCount = computed(() => new Blob([text.value]).size)

const submit = async () => {
  if (!text.value.trim()) {
    error.value = 'Por favor ingresa un texto para analizar'
    return
  }

  isLoading.value = true
  error.value = null

  try {
    const response = await createTransaction(text.value)
    emit('created', response.data)
    text.value = ''
    
    showSuccessFeedback()
  } catch (err) {
    error.value = 'Error al procesar el análisis. Intenta nuevamente.'
    console.error('Error al crear transacción:', err)
  } finally {
    isLoading.value = false
  }
}

const showSuccessFeedback = () => {
  const successMsg = document.querySelector('.success-message')
  if (successMsg) {
    successMsg.classList.add('show')
    setTimeout(() => {
      successMsg.classList.remove('show')
    }, 3000)
  }
}

const clearError = () => {
  error.value = null
}
</script>

<template>
  <div class="form-container">
    <div class="form-header">
      <div class="form-icon-wrapper">
        <svg class="form-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </div>
      <div>
        <h2 class="form-title">Entrada de Datos</h2>
        <p class="form-subtitle">Configure los parámetros de análisis criptográfico</p>
      </div>
    </div>

    <form @submit.prevent="submit" class="form-content">
      <div class="input-group">
        <label for="text-input" class="input-label">
          Texto de Entrada
          <span class="input-label-badge">Requerido</span>
        </label>
        <textarea
          id="text-input"
          v-model="text"
          @input="clearError"
          class="text-input"
          :class="{ 'error': error }"
          rows="6"
          placeholder="Ingrese el texto que desea analizar con los algoritmos criptográficos...&#10;&#10;Ejemplo: Hola Mundo"
          :disabled="isLoading"
        ></textarea>
        
        <div class="input-footer">
          <div class="input-stats">
            <span class="stat" :class="{ 'active': charCount > 0 }">
              <svg xmlns="http://www.w3.org/2000/svg" class="stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              {{ charCount }} caracteres
            </span>
            <span v-if="charCount > 0" class="stat active">
              <svg xmlns="http://www.w3.org/2000/svg" class="stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
              {{ byteCount }} bytes
            </span>
          </div>
        </div>

        <transition name="error">
          <div v-if="error" class="error-message">
            <svg xmlns="http://www.w3.org/2000/svg" class="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {{ error }}
          </div>
        </transition>
      </div>

      <button 
        type="submit" 
        class="submit-button"
        :disabled="isLoading || !text.trim()"
        :class="{ 'loading': isLoading }"
      >
        <span v-if="!isLoading" class="button-content">
          <svg xmlns="http://www.w3.org/2000/svg" class="button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
          </svg>
          Ejecutar Análisis
        </span>
        <span v-else class="button-content">
          <svg class="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Procesando análisis...
        </span>
      </button>
    </form>

    <div class="success-message">
      <svg xmlns="http://www.w3.org/2000/svg" class="success-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Análisis completado exitosamente</span>
    </div>
  </div>
</template>

<style scoped>
.form-container {
  position: relative;
}

.form-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.75rem;
}

.form-icon-wrapper {
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 1px solid #bfdbfe;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.form-icon {
  width: 28px;
  height: 28px;
  color: #0284c7;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
  letter-spacing: -0.01em;
}

.form-subtitle {
  font-size: 0.9375rem;
  color: #64748b;
  margin: 0;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.input-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input-label-badge {
  padding: 0.125rem 0.5rem;
  background: #fef3c7;
  color: #92400e;
  border-radius: 4px;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.text-input {
  width: 100%;
  padding: 1rem;
  font-size: 0.9375rem;
  font-family: 'SF Mono', 'Monaco', 'Courier New', Courier, monospace;
  color: #1e293b;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  resize: vertical;
  transition: all 0.2s ease;
  line-height: 1.6;
}

.text-input:focus {
  outline: none;
  border-color: #0284c7;
  background: white;
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
}

.text-input.error {
  border-color: #dc2626;
  background: #fef2f2;
}

.text-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input-stats {
  display: flex;
  gap: 1rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: #94a3b8;
  font-weight: 500;
  transition: color 0.2s;
}

.stat.active {
  color: #0369a1;
}

.stat-icon {
  width: 16px;
  height: 16px;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.875rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #991b1b;
  font-size: 0.875rem;
  font-weight: 500;
}

.error-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.error-enter-active, .error-leave-active {
  transition: all 0.3s ease;
}

.error-enter-from, .error-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.submit-button {
  padding: 1rem 1.75rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(30, 41, 59, 0.15);
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(30, 41, 59, 0.25);
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

.submit-button:active:not(:disabled) {
  transform: translateY(0);
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.button-icon {
  width: 20px;
  height: 20px;
}

.spinner {
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spinner-circle {
  opacity: 0.25;
}

.spinner-path {
  opacity: 0.75;
}

.success-message {
  position: fixed;
  top: 2rem;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: white;
  color: #15803d;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  font-weight: 600;
  font-size: 0.9375rem;
  opacity: 0;
  transform: translateX(400px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
}

.success-message.show {
  opacity: 1;
  transform: translateX(0);
}

.success-icon {
  width: 24px;
  height: 24px;
  color: #059669;
}

/* Responsive */
@media (max-width: 768px) {
  .form-header {
    flex-direction: column;
  }

  .form-title {
    font-size: 1.25rem;
  }

  .text-input {
    font-size: 0.875rem;
  }

  .input-stats {
    flex-direction: column;
    gap: 0.5rem;
  }

  .success-message {
    right: 1rem;
    left: 1rem;
  }
}
</style>