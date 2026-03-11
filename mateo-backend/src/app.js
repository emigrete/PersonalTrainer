require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/mongodb')
require('./config/firebase') // inicializa Firebase Admin

const authRoutes = require('./routes/auth')
const clientRoutes = require('./routes/clients')
const planRoutes = require('./routes/plans')
const checkInRoutes = require('./routes/checkins')

const app = express()

// ── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json())

// ── Health check ────────────────────────────────────────────
app.get('/health', (_, res) => res.json({ status: 'ok', ts: new Date() }))

// ── Rutas ───────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/clients', clientRoutes)
app.use('/api/plans', planRoutes)
app.use('/api/checkins', checkInRoutes)

// ── Error handler global ────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Error interno del servidor' })
})

// ── Start ───────────────────────────────────────────────────
const PORT = process.env.PORT || 3001

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Backend corriendo en http://localhost:${PORT}`)
  })
})
