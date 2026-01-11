# PROYECTO INTEGRADO: L2-CryptoBench Platform
**Facultad:** Ingeniería de Software / Ciencias de la Computación  
**Integrantes:** Marcos Escobar, Mateo Sosa, Fernando Tipán  
**Repositorio:** GitHub Private (Invitación a docentes)

---

## 1. Resumen del Proyecto
**L2-CryptoBench** es una plataforma web de investigación diseñada para analizar la intersección entre la **eficiencia criptográfica** y los **costos económicos** en redes Blockchain de Capa 2 (Layer 2).

La plataforma permite a los usuarios:
1.  Realizar pruebas de rendimiento de algoritmos criptográficos (Simétricos vs Asimétricos vs Hashing).
2.  Calcular en tiempo real el costo de almacenar esos datos cifrados en redes como Arbitrum, Optimism y Base.
3.  Visualizar la relación costo-beneficio entre "Seguridad (Cifrado)" y "Economía (Gas)" a través de un dashboard diseñado bajo estrictos principios de HCI y Usabilidad.

---

## 2. Alineación con las Materias

| Característica | Materia 1: Investigación / Sist. Distribuidos | Materia 2: HCI / Seguridad / Web |
| :--- | :--- | :--- |
| **Core** | Benchmarking de Gas en Layer 2 (L2) | Pruebas de Criptografía (AES, RSA, SHA) |
| **Enfoque** | Análisis de datos cuantitativos (Backend) | Experiencia de usuario (HCI, UX, UI) |
| **Stack** | Conexión Blockchain (Web3) | Python, Base de Datos, Accesibilidad |
| **Producto** | Artículo Científico (Research Gap) | Plataforma Web Robusta |

---

## 3. Arquitectura Técnica (Requisitos Cumplidos)

El sistema sigue una arquitectura cliente-servidor clásica con integración blockchain.

* **Frontend (UI/UX):** React.js + TailwindCSS (o Material UI).
    * *Justificación:* Permite componentes interactivos rápidos para cumplir con HCI e IxD.
* **Backend (Lógica):** **Python** (FastAPI o Flask).
    * *Justificación:* Obligatorio. Python tiene excelentes librerías de criptografía (`cryptography`) y blockchain (`web3.py`).
* **Base de Datos:** PostgreSQL o SQLite.
    * *Uso:* Almacenar historial de pruebas, usuarios y logs de rendimiento.
* **Blockchain Layer:** Web3.py conectado a RPCs de Alchemy.
* **Control de Versiones:** GitHub (Repositorio Privado).

---

## 4. Módulos del Sistema

### Módulo A: El Laboratorio Criptográfico (Materia 2)
El usuario podrá ingresar un texto (payload) y seleccionar diferentes algoritmos para ver cuánto tarda el sistema en procesarlo y cuánto aumenta el tamaño del archivo.
* **Algoritmos a implementar (Python):**
    * *Hashing:* SHA-256 vs Keccak-256.
    * *Simétrico:* AES-256 (Rápido, llave única).
    * *Asimétrico:* RSA (Lento, par de llaves) o Curvas Elípticas.
* **Output Visual:** Gráfica de barras comparando tiempo de CPU y tamaño en bytes del resultado.

### Módulo B: El Benchmarking de Gas L2 (Materia 1)
Una vez cifrada la data en el Módulo A, el sistema enviará una consulta (*estimateGas*) a las redes L2 para ver cuánto costaría guardar ese secreto cifrado on-chain.
* **Redes:** Arbitrum, Optimism, Base.
* **Output Visual:** Gráfica lineal de costos en USD a lo largo del tiempo.

---

## 5. Diseño Centrado en el Usuario (HCI & UX)
Para cumplir con los requisitos de la segunda materia, la interfaz implementará:

1.  **HCI & Feedback (IxD):**
    * Indicadores de carga (Spinners) precisos durante el proceso de encriptación (que puede tardar ms) y consulta a blockchain.
    * Mensajes de error amigables ("La red Arbitrum está congestionada" en lugar de "Error 500").
2.  **Usabilidad y Eficiencia:**
    * "One-click Benchmark": Un botón principal grande que ejecuta toda la suite de pruebas.
    * Atajos de teclado para desarrolladores.
3.  **Accesibilidad (A11y):**
    * Alto contraste cumpliendo WCAG AA.
    * Soporte para lectores de pantalla (etiquetas ARIA correctas en los gráficos).
    * Modo daltónico para diferenciar las líneas de los gráficos de las redes.
4.  **Ergonomía Cognitiva:**
    * Dashboard limpio, sin saturación de información. Uso de "Cards" para separar el módulo de Cripto del módulo de Blockchain.

---

## 6. Objetivos del Proyecto Unificado

1.  **Desarrollar una plataforma web** utilizando Python y React que integre pruebas de algoritmos criptográficos con estimaciones de costos en blockchain.
2.  **Evaluar la usabilidad** de la herramienta aplicando principios de UCD (Diseño Centrado en el Usuario) para asegurar que datos técnicos complejos sean comprensibles.
3.  **Analizar el impacto económico** (Gas Fees) que tiene la elección de un algoritmo de cifrado (tamaño del output) al ser almacenado en redes Ethereum Layer 2.
4.  **Generar un dataset** híbrido que correlacione "Tiempo de Cifrado (CPU)" vs "Costo de Almacenamiento (Blockchain)".

---

## 7. Plan de Implementación (Roadmap Express)

* **Semana 1: Backend Python (Core)**
    * Setup de entorno (VS Code + Virtualenv).
    * Endpoint `/encrypt`: Recibe texto, aplica AES/RSA, devuelve texto cifrado.
    * Endpoint `/estimate`: Recibe texto cifrado, consulta a Alchemy usando `web3.py`.
* **Semana 2: Frontend y Base de Datos**
    * Diseño de UI en React (Wireframes centrados en usabilidad).
    * Conexión a Base de Datos (SQLAlchemy) para guardar el historial de pruebas.
* **Semana 3: Integración y UX**
    * Conectar Front y Back.
    * Implementar validaciones de accesibilidad (colores, tamaños).
    * Generar gráficos con los datos.
* **Semana 4: Pruebas y Artículo**
    * Ejecutar 50 pruebas automáticas.
    * Redactar el artículo con los hallazgos (ej: "RSA es muy caro para Blockchain debido al tamaño de la clave").

---

## 8. ¿Por qué este proyecto es innovador? (Research Gap)
Mientras la mayoría de papers estudian la criptografía o el blockchain por separado, **L2-CryptoBench** estudia la relación directa entre **la longitud del cifrado y su costo financiero en redes modernas**, todo presentado en una interfaz que democratiza el acceso a estos datos para desarrolladores no expertos.
