const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a MongoDB (Mantiene tu fallback local y tu variable de Atlas)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/tododb')
  .then(() => console.log('>> [NEXUS CORE]: Conectado exitosamente a MongoDB'))
  .catch(err => console.error(' Error MongoDB:', err));

// Modelo de Tarea (Actualizado con atributos futuristas: prioridades, sectores y tags)
const Task = mongoose.model('Task', {
  title: { type: String, required: true },
  description: String,
  status: { 
    type: String, 
    enum: ['Iniciado', 'En Progreso', 'Completado', 'Abortado'], 
    default: 'Iniciado' 
  },
  priorityLevel: { 
    type: String, 
    enum: ['BAJA', 'MEDIA', 'ALTA', 'CRÍTICA'], 
    default: 'MEDIA' 
  },
  sector: { type: String, default: 'General' },
  cyberTags: [String],
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Rutas
app.get('/', (req, res) => {
  res.send(`
    <div style="background-color: #0a0b10; color: #00f0ff; font-family: monospace; padding: 40px; text-align: center; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
      <h1 style="border-bottom: 2px solid #00f0ff; padding-bottom: 10px;">[NEXUS CORE] Sistema Operativo</h1>
      <p style="color: #ffffff; font-size: 18px;">Gestor de misiones y tareas con estética futurista activo.</p>
      <p style="color: #00ff66; font-weight: bold;">Estado del Servidor: EN LÍNEA Y SINCRONIZADO</p>
      <a href="/api/tasks" style="color: #bd00ff; margin-top: 20px; font-size: 16px;">Ver Endpoint de Tareas (/api/tasks)</a>
    </div>
  `);
});

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
    res.status(201).json({ message: "Misión registrada con éxito en Nexus Core", task });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Parámetros de misión actualizados", task });
  } catch (error) {
    res.status(404).json({ error: 'Tarea no encontrada' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Misión purgada del sistema con éxito' });
  } catch (error) {
    res.status(404).json({ error: 'Tarea no encontrada' });
  }
});

app.listen(PORT, () => {
  console.log(`>> [NEXUS CORE] Servidor corriendo en puerto ${PORT}`);
});