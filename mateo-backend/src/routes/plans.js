const express = require('express')
const Plan = require('../models/Plan')
const verifyToken = require('../middleware/auth')
const requireAdmin = require('../middleware/requireAdmin')

const router = express.Router()

router.use(verifyToken)

/**
 * GET /api/plans/me
 * Devuelve el plan del usuario autenticado (cliente o admin).
 */
router.get('/me', async (req, res) => {
  try {
    const plan = await Plan.findOne({ clientId: req.user._id })
    res.json({ plan })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/**
 * GET /api/plans/:clientId
 * Devuelve el plan de un cliente específico (solo admin).
 */
router.get('/:clientId', requireAdmin, async (req, res) => {
  try {
    const plan = await Plan.findOne({ clientId: req.params.clientId })
    res.json({ plan })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/**
 * POST /api/plans
 * Crea un plan para un cliente (solo admin).
 */
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { clientId, title, startDate, endDate, days, generalNotes } = req.body

    // Si ya tiene plan, lo reemplazamos
    const existing = await Plan.findOne({ clientId })
    if (existing) {
      Object.assign(existing, { title, startDate, endDate, days, generalNotes })
      await existing.save()
      return res.json({ plan: existing })
    }

    const plan = await Plan.create({ clientId, title, startDate, endDate, days, generalNotes })
    res.status(201).json({ plan })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/**
 * PUT /api/plans/:id
 * Actualiza un plan existente (solo admin).
 */
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { title, startDate, endDate, days, generalNotes } = req.body
    const plan = await Plan.findByIdAndUpdate(
      req.params.id,
      { title, startDate, endDate, days, generalNotes },
      { new: true, runValidators: true }
    )
    if (!plan) return res.status(404).json({ error: 'Plan no encontrado' })
    res.json({ plan })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/**
 * DELETE /api/plans/:id
 * Elimina un plan (solo admin).
 */
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await Plan.findByIdAndDelete(req.params.id)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
