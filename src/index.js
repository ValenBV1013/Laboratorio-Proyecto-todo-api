const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/tododb')
  .then(() => console.log('>> [NEXUS CORE]: Conectado exitosamente a MongoDB'))
  .catch(err => console.error(' Error MongoDB:', err));

// Modelo de Tarea Futurista
const Task = mongoose.model('Task', {
  title: { type: String, required: true },
  description: String,
  status: { type: String, default: 'Iniciado' },
  priorityLevel: { type: String, default: 'MEDIA' },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// 1. INTERFAZ GRÁFICA FRONTEND (Dashboard Futurista - Nexus Core)
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NEXUS CORE | Dashboard de Misiones</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;800&family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #050b14; color: #94a3b8; }
        .font-orbitron { font-family: 'Orbitron', sans-serif; }
        .neon-glow { box-shadow: 0 0 20px rgba(0, 240, 255, 0.15); border: 1px solid rgba(0, 240, 255, 0.3); }
        .neon-button { background: linear-gradient(135deg, #00f0ff 0%, #0077ff 100%); transition: all 0.3s ease; }
        .neon-button:hover { box-shadow: 0 0 15px rgba(0, 240, 255, 0.5); transform: translateY(-1px); }
    </style>
</head>
<body class="min-h-screen p-6 md:p-12">
    <div class="max-w-4xl mx-auto space-y-8">
        
        <!-- Header -->
        <header class="flex flex-col md:flex-row justify-between items-center bg-[#0a1527] p-6 rounded-2xl neon-glow gap-4">
            <div class="flex items-center space-x-3">
                <div class="w-4 h-4 bg-cyan-400 rounded-full animate-ping"></div>
                <h1 class="font-orbitron text-2xl font-bold text-cyan-400 tracking-wider">NEXUS CORE</h1>
            </div>
            <div class="flex gap-2">
                <span class="px-3 py-1 bg-cyan-950 text-cyan-400 text-xs font-semibold rounded-full border border-cyan-800">SISTEMA ONLINE</span>
                <span class="px-3 py-1 bg-emerald-950 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-800">MONGODB ATLAS</span>
            </div>
        </header>

        <!-- Estadísticas -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-[#0a1527] p-5 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                    <p class="text-xs uppercase tracking-wider text-slate-400 font-semibold">Total Misiones</p>
                    <h2 id="total-tasks" class="font-orbitron text-3xl font-bold text-white mt-1">0</h2>
                </div>
                <div class="p-3 bg-blue-950/50 rounded-lg text-blue-400 text-xl">🚀</div>
            </div>
            <div class="bg-[#0a1527] p-5 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                    <p class="text-xs uppercase tracking-wider text-slate-400 font-semibold">Pendientes / En Curso</p>
                    <h2 id="pending-tasks" class="font-orbitron text-3xl font-bold text-amber-400 mt-1">0</h2>
                </div>
                <div class="p-3 bg-amber-950/50 rounded-lg text-amber-400 text-xl">⏳</div>
            </div>
            <div class="bg-[#0a1527] p-5 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                    <p class="text-xs uppercase tracking-wider text-slate-400 font-semibold">Completadas</p>
                    <h2 id="completed-tasks" class="font-orbitron text-3xl font-bold text-emerald-400 mt-1">0</h2>
                </div>
                <div class="p-3 bg-emerald-950/50 rounded-lg text-emerald-400 text-xl">🛡️</div>
            </div>
        </div>

        <!-- Formulario Nueva Misión -->
        <div class="bg-[#0a1527] p-6 rounded-2xl border border-slate-800 space-y-4">
            <h2 class="font-orbitron text-sm font-semibold text-white tracking-wide uppercase flex items-center gap-2">
                <span class="text-cyan-400">+</span> Registrar Nueva Misión
            </h2>
            <form id="task-form" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" id="title" placeholder="Título de la misión..." required 
                    class="bg-[#050b14] border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 text-sm">
                <input type="text" id="description" placeholder="Descripción de parámetros..." 
                    class="bg-[#050b14] border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 text-sm">
                <button type="submit" class="neon-button text-slate-950 font-orbitron font-bold rounded-xl px-6 py-3 text-sm flex items-center justify-center gap-2">
                    Iniciar Misión
                </button>
            </form>
        </div>

        <!-- Listado de Tareas -->
        <div class="bg-[#0a1527] p-6 rounded-2xl border border-slate-800 space-y-4">
            <h2 class="font-orbitron text-sm font-semibold text-white tracking-wide uppercase">Registro de Misiones Activas</h2>
            <div id="tasks-container" class="space-y-3">
                <!-- Se cargan dinámicamente -->
            </div>
        </div>

    </div>

    <script>
        const API_URL = '/api/tasks';

        async function fetchTasks() {
            try {
                const res = await fetch(API_URL);
                const data = await res.json();
                const tasks = data.tasks || data;
                
                document.getElementById('total-tasks').innerText = tasks.length;
                const completed = tasks.filter(t => t.completed).length;
                document.getElementById('completed-tasks').innerText = completed;
                document.getElementById('pending-tasks').innerText = tasks.length - completed;

                const container = document.getElementById('tasks-container');
                if (tasks.length === 0) {
                    container.innerHTML = \`<p class="text-center text-slate-600 py-6 text-sm font-mono">No hay misiones registradas en el núcleo.</p>\`;
                    return;
                }

                container.innerHTML = tasks.map(task => \`
                    <div class="flex items-center justify-between bg-[#050b14] p-4 rounded-xl border \${task.completed ? 'border-emerald-900/50 bg-emerald-950/10' : 'border-slate-800'} transition-all">
                        <div class="flex items-center space-x-4">
                            <input type="checkbox" \${task.completed ? 'checked' : ''} onclick="toggleTask('\${task._id}', \${!task.completed})"
                                class="w-5 h-5 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 cursor-pointer">
                            <div>
                                <h3 class="font-semibold text-white text-sm \${task.completed ? 'line-through text-slate-500' : ''}">\${task.title}</h3>
                                <p class="text-xs text-slate-400 mt-0.5">\${task.description || 'Sin descripción adicional'}</p>
                            </div>
                        </div>
                        <button onclick="deleteTask('\${task._id}')" class="text-slate-600 hover:text-red-400 transition-colors p-2">
                            🗑️
                        </button>
                    </div>
                \`).join('');
            } catch (err) {
                console.error("Error cargando misiones:", err);
            }
        }

        document.getElementById('task-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;

            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description })
            });

            document.getElementById('title').value = '';
            document.getElementById('description').value = '';
            fetchTasks();
        });

        async function toggleTask(id, completed) {
            await fetch(\`\${API_URL}/\${id}\`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed })
            });
            fetchTasks();
        }

        async function deleteTask(id) {
            await fetch(\`\${API_URL}/\${id}\`, { method: 'DELETE' });
            fetchTasks();
        }

        fetchTasks();
    </script>
</body>
</html>`);
});

// 2. ENDPOINTS DE LA API (CRUD)
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json({ systemStatus: "ONLINE", count: tasks.length, tasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json({ message: "Misión registrada", task });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Misión actualizada", task });
  } catch (error) {
    res.status(404).json({ error: 'Tarea no encontrada' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Misión eliminada' });
  } catch (error) {
    res.status(404).json({ error: 'Tarea no encontrada' });
  }
});

app.listen(PORT, () => {
  console.log(`>> [NEXUS CORE] Servidor y Panel Activos en puerto ${PORT}`);
});