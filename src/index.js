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
  .then(() => console.log('>> [NEXUS CORE V2]: Conectado a MongoDB'))
  .catch(err => console.error(' Error MongoDB:', err));

// Modelo de Tarea
const Task = mongoose.model('Task', {
  title: { type: String, required: true },
  description: String,
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// INTERFAZ GRÁFICA V2 - PURPLE CYBERPUNK EDITION
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NEXUS CORE | Cyberpunk Terminal</title>
    <script src="https://tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'JetBrains Mono', monospace;
            background-color: #030008;
            color: #d8b4fe;
            overflow-x: hidden;
            background-image: 
                radial-gradient(circle at 10% 20%, rgba(147, 51, 234, 0.15) 0%, transparent 40%),
                radial-gradient(circle at 90% 80%, rgba(217, 70, 239, 0.1) 0%, transparent 40%);
        }
        .font-orbitron { font-family: 'Orbitron', sans-serif; }
        
        /* Efectos de neón morado intensos */
        .cyber-card {
            background: rgba(15, 5, 29, 0.75);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(168, 85, 247, 0.3);
            box-shadow: 0 0 25px rgba(168, 85, 247, 0.12), inset 0 0 15px rgba(168, 85, 247, 0.05);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .cyber-card:hover {
            border-color: rgba(217, 70, 239, 0.7);
            box-shadow: 0 0 35px rgba(217, 70, 239, 0.3), inset 0 0 20px rgba(217, 70, 239, 0.1);
        }
        .neon-glow-text {
            text-shadow: 0 0 10px rgba(216, 180, 254, 0.6), 0 0 20px rgba(168, 85, 247, 0.4);
        }
        .neon-btn {
            background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%);
            box-shadow: 0 0 20px rgba(124, 58, 237, 0.4);
            transition: all 0.3s ease;
        }
        .neon-btn:hover {
            box-shadow: 0 0 30px rgba(219, 39, 119, 0.7);
            transform: translateY(-2px);
        }
        /* Línea de escaneo animada */
        @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(1000%); }
        }
        .scanline {
            position: absolute; top: 0; left: 0; width: 100%; height: 2px;
            background: linear-gradient(90deg, transparent, rgba(217, 70, 239, 0.5), transparent);
            animation: scanline 8s linear infinite;
            pointer-events: none;
        }
    </style>
</head>
<body class="min-h-screen p-6 md:p-10 relative">
    <div class="scanline"></div>

    <div class="max-w-4xl mx-auto space-y-8 relative z-10">
        
        <!-- Header Cibernético -->
        <header class="cyber-card p-6 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="flex items-center space-x-4">
                <div class="relative">
                    <div class="w-5 h-5 bg-fuchsia-500 rounded-full animate-ping absolute"></div>
                    <div class="w-5 h-5 bg-purple-600 rounded-full relative"></div>
                </div>
                <div>
                    <h1 class="font-orbitron text-2xl font-black text-white tracking-widest neon-glow-text">NEXUS CORE</h1>
                    <p class="text-xs text-purple-400 font-mono tracking-wider">SECURE SYSTEM // PROTOCOL V2.0</p>
                </div>
            </div>
            <div class="flex gap-2">
                <span class="px-3 py-1 bg-purple-950/80 text-purple-300 text-xs font-bold rounded-lg border border-purple-700/50 shadow-inner">CORE: ONLINE</span>
                <span class="px-3 py-1 bg-fuchsia-950/80 text-fuchsia-300 text-xs font-bold rounded-lg border border-fuchsia-700/50 shadow-inner">ATLAS DB</span>
            </div>
        </header>

        <!-- Métricas Holográficas -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div class="cyber-card p-6 rounded-2xl flex items-center justify-between">
                <div>
                    <p class="text-xs text-purple-400 font-bold uppercase tracking-wider">Total Registros</p>
                    <h2 id="total-tasks" class="font-orbitron text-4xl font-black text-white mt-1">0</h2>
                </div>
                <div class="p-3.5 bg-purple-900/30 rounded-xl text-purple-300 text-2xl border border-purple-700/30">🔮</div>
            </div>
            <div class="cyber-card p-6 rounded-2xl flex items-center justify-between">
                <div>
                    <p class="text-xs text-purple-400 font-bold uppercase tracking-wider">En Ejecución</p>
                    <h2 id="pending-tasks" class="font-orbitron text-4xl font-black text-amber-300 mt-1">0</h2>
                </div>
                <div class="p-3.5 bg-amber-950/30 rounded-xl text-amber-300 text-2xl border border-amber-700/30">⚡</div>
            </div>
            <div class="cyber-card p-6 rounded-2xl flex items-center justify-between">
                <div>
                    <p class="text-xs text-purple-400 font-bold uppercase tracking-wider">Sincronizadas</p>
                    <h2 id="completed-tasks" class="font-orbitron text-4xl font-black text-fuchsia-400 mt-1">0</h2>
                </div>
                <div class="p-3.5 bg-fuchsia-950/30 rounded-xl text-fuchsia-300 text-2xl border border-fuchsia-700/30">🛡️</div>
            </div>
        </div>

        <!-- Terminal de Ingreso de Misión -->
        <div class="cyber-card p-6 rounded-3xl space-y-4">
            <h2 class="font-orbitron text-xs font-bold text-fuchsia-400 tracking-widest uppercase flex items-center gap-2">
                <span class="text-purple-500">▶</span> Iniciar Nueva Tarea / Misión
            </h2>
            <form id="task-form" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" id="title" placeholder="Título de la misión..." required 
                    class="bg-[#0b0218] border border-purple-900/60 rounded-xl px-4 py-3 text-white placeholder-purple-600/70 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 text-sm">
                <input type="text" id="description" placeholder="Parámetros o descripción..." 
                    class="bg-[#0b0218] border border-purple-900/60 rounded-xl px-4 py-3 text-white placeholder-purple-600/70 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 text-sm">
                <button type="submit" class="neon-btn text-white font-orbitron font-bold rounded-xl px-6 py-3 text-sm flex items-center justify-center gap-2 tracking-wider">
                    EJECUTAR
                </button>
            </form>
        </div>

        <!-- Contenedor de Registros -->
        <div class="cyber-card p-6 rounded-3xl space-y-4">
            <h2 class="font-orbitron text-xs font-bold text-fuchsia-400 tracking-widest uppercase">Base de Datos Activa // Misiones</h2>
            <div id="tasks-container" class="space-y-3">
                <!-- Dinámico -->
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
                    container.innerHTML = \`<p class="text-center text-purple-500/60 py-8 text-xs font-mono tracking-widest">NINGÚN REGISTRO DETECTADO EN EL NÚCLEO</p>\`;
                    return;
                }

                container.innerHTML = tasks.map(task => \`
                    <div class="flex items-center justify-between bg-[#0b0218]/80 p-4 rounded-2xl border \${task.completed ? 'border-fuchsia-800/40 bg-fuchsia-950/10' : 'border-purple-900/40'} transition-all hover:border-purple-500">
                        <div class="flex items-center space-x-4">
                            <input type="checkbox" \${task.completed ? 'checked' : ''} onclick="toggleTask('\${task._id}', \${!task.completed})"
                                class="w-5 h-5 rounded border-purple-700 bg-purple-950 text-fuchsia-500 focus:ring-0 cursor-pointer accent-fuchsia-500">
                            <div>
                                <h3 class="font-orbitron font-bold text-sm text-white \${task.completed ? 'line-through text-purple-500/50' : ''}">\${task.title}</h3>
                                <p class="text-xs text-purple-400/80 mt-1">\${task.description || 'Sin parámetros adicionales'}</p>
                            </div>
                        </div>
                        <button onclick="deleteTask('\${task._id}')" class="text-purple-600 hover:text-fuchsia-400 transition-colors p-2 text-base">
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

// Endpoints API
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
  console.log(`>> [NEXUS CORE V2] Servidor Activo en puerto ${PORT}`);
});