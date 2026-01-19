<script setup>
import { ref } from "vue";
import { createTransaction } from "../api/transactions";

const text = ref("");
const emit = defineEmits(["created"]);

const submit = async () => {
  if (!text.value.trim()) return;

  try {
    const response = await createTransaction(text.value);
    emit("created", response.data);
    text.value = "";
  } catch (error) {
    console.error("Error al crear transacción:", error);
  }
};
</script>

<template>
  <div class="card shadow-sm mb-4">
    <div class="card-body">
      <h5 class="card-title mb-3">
        <i class="fas fa-keyboard me-2 text-primary"></i>
        Texto de entrada
      </h5>

      <textarea
        v-model="text"
        class="form-control mb-3"
        rows="4"
        placeholder="Ingrese la cadena a analizar..."
      ></textarea>

      <button class="btn btn-primary" @click="submit">
        <i class="fa-solid fa-circle-play me-2"></i>
        Ejecutar
      </button>
    </div>

  </div>
</template>
