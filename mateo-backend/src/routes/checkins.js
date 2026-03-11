const express = require('express')
const CheckIn = require('../models/CheckIn')
const verifyToken = require('../middleware/auth')
const requireAdmin = require('../middleware/requireAdmin')

const router = express.Router()

router.use(verifyToken)

/**
 * GET /api/checkins/me
 * Historial de check-ins del usuario autenticado.
 */
router.get('/me', async (req, res) => {
  try {
    const checkIns = await CheckIn.find({ clientId: req.user._id })
      .sort({ date: -1 })
      .limit(20)
    res.json({ checkIns })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/**
 * GET /api/checkins/:clientId
 * Check-ins de un cliente específico (solo admin).
 */
router.get('/:clientId', requireAdmin, async (req, res) => {
  try {
    const checkIns = await CheckIn.find({ clientId: req.params.clientId })
      .sort({ date: -1 })
      .limit(20)
    res.json({ checkIns })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/**
 * POST /api/checkins
 * El cliente registra su check-in semanal.
 */
router.post('/', async (req, res) => {
  try {
    const { date, weight, bodyFat, completedWorkouts, totalWorkouts, clientNotes } = req.body
    const checkIn = await CheckIn.create({
      clientId: req.user._id,
      date,
      weight,
      bodyFat,
      completedWorkouts,
      totalWorkouts,
      clientNotes,
    })
    res.status(201).json({ checkIn })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/**
 * PATCH /api/checkins/:id/coach
 * Mateo agrega su nota al check-in de un cliente (solo admin).
 */
router.patch('/:id/coach', requireAdmin, async (req, res) => {
  try {
    const { coachNotes } = req.body
    const checkIn = await CheckIn.findByIdAndUpdate(
      req.params.id,
      { coachNotes },
      { new: true }
    )
    if (!checkIn) return res.status(404).json({ error: 'Check-in no encontrado' })
    res.json({ checkIn })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
