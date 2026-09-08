# 🚀 NEXUS CORE | TODO API - Proyecto Formativo

> API REST moderna y panel de control interactivo para la gestión de misiones/tareas, desarrollada con tecnologías web modernas y conectada a la nube.

---

## 📋 Descripción del Proyecto
**NEXUS CORE** es una aplicación full-stack orientada al control y seguimiento de tareas. Cuenta con una API REST robusta construida en **Node.js** y **Express**, respaldada por una base de datos no relacional en **MongoDB**. Además, incluye una interfaz gráfica integrada de alto rendimiento con temática Cyberpunk/Synthwave, efectos de cristal esmerilado (*glassmorphism*), filtros dinámicos (Todas, Pendientes, Completadas) y contadores en tiempo real.

---

## 🛠️ Tecnologías Utilizadas

* **Backend / API:** Node.js, Express.js
* **Base de Datos:** MongoDB / Mongoose
* **Contenedores:** Docker, Docker Compose
* **Frontend / UI:** HTML5, CSS Grid / Flexbox, JavaScript ES6+, Tipografías Orbitron & JetBrains Mono
* **Despliegue:** Render Cloud

---

## ⚙️ Instalación Local

```bash
git clone [URL]
npm install
npm run dev

🐳 Despliegue con Docker
Bash
docker-compose up -d
🌐 Despliegue en Producción
URL: https://laboratorio-proyecto-todo-api-vale.onrender.com

📌 Endpoints de la API
GET /api/tasks - Obtiene todas las misiones registradas.

POST /api/tasks - Crea una nueva misión.

PUT /api/tasks/:id - Actualiza una misión existente.

DELETE /api/tasks/:id - Elimina una misión.
