const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/tododb')
  .then(() => console.log('>> [NEXUS CORE V3]: Conectado a MongoDB'))
  .catch(err => console.error(' Error MongoDB:', err));

const Task = mongoose.model('Task', {
  title: { type: String, required: true },
  description: String,
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NEXUS CORE | Cyberpunk Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'JetBrains Mono', monospace;
            background-color: #030008;
            color: #d8b4fe;
            min-height: 100vh;
            padding: 30px 20px;
            background-image: 
                radial-gradient(circle at 10% 20%, rgba(147, 51, 234, 0.18) 0%, transparent 40%),
                radial-gradient(circle at 90% 80%, rgba(217, 70, 239, 0.12) 0%, transparent 40%);
        }
        .container { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
        
        /* Tarjetas estilo Cyberpunk Glassmorphism */
        .cyber-card {
            background: rgba(15, 5, 29, 0.85);
            border: 1px solid rgba(168, 85, 247, 0.35);
            box-shadow: 0 0 25px rgba(168, 85, 247, 0.15), inset 0 0 15px rgba(168, 85, 247, 0.05);
            border-radius: 20px;
            padding: 24px;
            backdrop-filter: blur(12px);
            transition: all 0.3s ease;
        }
        .cyber-card:hover {
            border-color: rgba(217, 70, 239, 0.7);
            box-shadow: 0 0 35px rgba(217, 70, 239, 0.3);
        }

        /* Header */
        .header-flex { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
        .logo-area { display: flex; align-items: center; gap: 15px; }
        .pulse-dot { width: 14px; height: 14px; background-color: #d946ef; border-radius: 50%; box-shadow: 0 0 12px #d946ef; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0% { transform: scale(0.95); opacity: 0.8; } 50% { transform: scale(1.2); opacity: 1; box-shadow: 0 0 20px #d946ef; } 100% { transform: scale(0.95); opacity: 0.8; } }
        
        h1 { font-family: 'Orbitron', sans-serif; font-weight: 900; font-size: 1.6rem; color: #ffffff; letter-spacing: 2px; text-shadow: 0 0 10px rgba(216, 180, 254, 0.6); }
        .badge-group { display: flex; gap: 8px; }
        .badge { background: rgba(88, 28, 135, 0.5); border: 1px solid rgba(168, 85, 247, 0.5); color: #e9d5ff; padding: 6px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: bold; }

        /* Estadísticas Grid */
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
        .stat-card { display: flex; justify-content: space-between; align-items: center; }
        .stat-label { font-size: 0.75rem; color: #c084fc; text-transform: uppercase; font-weight: bold; letter-spacing: 1px; }
        .stat-value { font-family: 'Orbitron', sans-serif; font-size: 2.2rem; font-weight: 900; color: #ffffff; margin-top: 5px; }
        .stat-icon { font-size: 1.8rem; padding: 12px; background: rgba(147, 51, 234, 0.15); border-radius: 12px; border: 1px solid rgba(168, 85, 247, 0.3); }

        /* Formulario */
        .section-title { font-family: 'Orbitron', sans-serif; font-size: 0.85rem; color: #e879f9; letter-spacing: 1.5px; margin-bottom: 16px; text-transform: uppercase; display: flex; align-items: center; gap: 8px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr auto; gap: 12px; }
        @media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } }
        
        input {
            background: #06010f;
            border: 1px solid rgba(168, 85, 247, 0.4);
            border-radius: 12px;
            padding: 12px 16px;
            color: #fff;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.9rem;
            outline: none;
            transition: border 0.3s;
        }
        input:focus { border-color: #e879f9; box-shadow: 0 0 10px rgba(232, 121, 249, 0.3); }
        
        .cyber-btn {
            background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%);
            color: white;
            font-family: 'Orbitron', sans-serif;
            font-weight: 700;
            border: none;
            border-radius: 12px;
            padding: 12px 24px;
            cursor: pointer;
            box-shadow: 0 0 15px rgba(124, 58, 237, 0.5);
            transition: all 0.3s;
            letter-spacing: 1px;
        }
        .cyber-btn:hover { box-shadow: 0 0 25px rgba(219, 39, 119, 0.8); transform: translateY(-2px); }

        /* Lista de Tareas */
        .tasks-list { display: flex; flex-direction: column; gap: 12px; }
        .task-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(8, 2, 18, 0.8);
            border: 1px solid rgba(168, 85, 247, 0.25);
            padding: 14px 18px;
            border-radius: 14px;
            transition: all 0.2s;
        }
        .task-item:hover { border-color: rgba(168, 85, 247, 0.6); }
        .task-left { display: flex; align-items: center; gap: 14px; }
        .task-title { font-family: 'Orbitron', sans-serif; font-size: 0.9rem; color: #fff; font-weight: 700; }
        .task-desc { font-size: 0.75rem; color: #a78bfa; margin-top: 4px; }
        .completed .task-title { text-decoration: line-through; color: #6b21a8; }
        .completed .task-desc { color: #4c1d95; }
        
        input[type="checkbox"] { width: 20px; height: 20px; accent-color: #d946ef; cursor: pointer; }
        .delete-btn { background: none; border: none; cursor: pointer; font-size: 1.1rem; opacity: 0.7; transition: opacity 0.2s; }
        .delete-btn:hover { opacity: 1; }
        .empty-msg { text-align: center; color: #7e22ce; font-size: 0.8rem; padding: 20px; letter-spacing: 1px; }
    </style>
</head>
<body>
    <div class="container">
        
        <!-- Header -->
        <header class="cyber-card header-flex">
            <div class="logo-area">
                <div class="pulse-dot"></div>
                <div>
                    <h1>NEXUS CORE</h1>
                    <span style="font-size: 0.7rem; color: #a855f7; letter-spacing: 2px;">SECURE SYSTEM // PROTOCOL V3.0</span>
                </div>
            </div>
            <div class="badge-group">
                <span class="badge">ONLINE</span>
                <span class="badge" style="background: rgba(147, 51, 234, 0.3);">MONGODB ATLAS</span>
            </div>
        </header>

        <!-- Estadísticas -->
        <div class="stats-grid">
            <div class="cyber-card stat-card">
                <div>
                    <div class="stat-label">Total Misiones</div>
                    <div id="total-tasks" class="stat-value">0</div>
                </div>
                <div class="stat-icon">🔮</div>
            </div>
            <div class="cyber-card stat-card">
                <div>
                    <div class="stat-label">En Ejecución</div>
                    <div id="pending-tasks" class="stat-value" style="color: #fbbf24;">0</div>
                </div>
                <div class="stat-icon">⚡</div>
            </div>
            <div class="cyber-card stat-card">
                <div>
                    <div class="stat-label">Sincronizadas</div>
                    <div id="completed-tasks" class="stat-value" style="color: #e879f9;">0</div>
                </div>
                <div class="stat-icon">🛡️</div>
            </div>
        </div>

        <!-- Formulario -->
        <div class="cyber-card">
            <div class="section-title"><span>▶</span> Registrar Nueva Misión / Tarea</div>
            <form id="task-form" class="form-grid">
                <input type="text" id="title" placeholder="Título de la misión..." required>
                <input type="text" id="description" placeholder="Parámetros o descripción...">
                <button type="submit" class="cyber-btn">EJECUTAR</button>
            </form>
        </div>

        <!-- Listado -->
        <div class="cyber-card">
            <div class="section-title">Base de Datos Activa // Misiones</div>
            <div id="tasks-container" class="tasks-list">
                <!-- Se llena por JS -->
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
                    container.innerHTML = '<div class="empty-msg">NINGÚN REGISTRO DETECTADO EN EL NÚCLEO</div>';
                    return;
                }

                container.innerHTML = tasks.map(task => \`
                    <div class="task-item \${task.completed ? 'completed' : ''}">
                        <div class="task-left">
                            <input type="checkbox" \${task.completed ? 'checked' : ''} onclick="toggleTask('\${task._id}', \${!task.completed})">
                            <div>
                                <div class="task-title">\${task.title}</div>
                                <div class="task-desc">\${task.description || 'Sin parámetros adicionales'}</div>
                            </div>
                        </div>
                        <button onclick="deleteTask('\${task._id}')" class="delete-btn" title="Eliminar misión">🗑️</button>
                    </div>
                \`).join('');
            } catch (err) {
                console.error("Error:", err);
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

// Endpoints de la API
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
  console.log(`>> [NEXUS CORE V3] Servidor Activo en puerto ${PORT}`);
});