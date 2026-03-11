const express = require('express')
const User = require('../models/User')
const Plan = require('../models/Plan')
const CheckIn = require('../models/CheckIn')
const verifyToken = require('../middleware/auth')
const requireAdmin = require('../middleware/requireAdmin')
const admin = require('../config/firebase')

const router = express.Router()

// Todas las rutas requieren admin
router.use(verifyToken, requireAdmin)

/**
 * GET /api/clients
 * Sincroniza todos los usuarios de Firebase a MongoDB y devuelve los clientes.
 */
router.get('/', async (req, res) => {
  try {
    // Sync Firebase users → MongoDB so no one is missing from the list
    let pageToken
    do {
      const result = await admin.auth().listUsers(1000, pageToken)
      for (const fbUser of result.users) {
        if (!fbUser.email) continue
        const isAdmin = fbUser.email === process.env.ADMIN_EMAIL
        await User.findOneAndUpdate(
          { firebaseUid: fbUser.uid },
          {
            $set: { role: isAdmin ? 'admin' : 'client' },
            $setOnInsert: {
              firebaseUid: fbUser.uid,
              email: fbUser.email,
              name: fbUser.displayName || fbUser.email.split('@')[0],
            },
          },
          { upsert: true }
        )
      }
      pageToken = result.pageToken
    } while (pageToken)

    const clients = await User.find({ role: 'client' }).select('-__v').sort({ createdAt: -1 })
    res.json({ clients })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/**
 * GET /api/clients/:id
 * Detalle de un cliente con su plan y últimos check-ins.
 */
router.get('/:id', async (req, res) => {
  try {
    const client = await User.findById(req.params.id).select('-__v')
    if (!client) return res.status(404).json({ error: 'Cliente no encontrado' })

    const plan = await Plan.findOne({ clientId: client._id })
    const checkIns = await CheckIn.find({ clientId: client._id }).sort({ date: -1 }).limit(10)

    res.json({ client, plan, checkIns })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/**
 * PUT /api/clients/:id
 * Actualiza nombre, teléfono u objetivo de un cliente.
 */
router.put('/:id', async (req, res) => {
  try {
    const { name, phone, objective } = req.body
    const client = await User.findByIdAndUpdate(
      req.params.id,
      { name, phone, objective },
      { new: true, runValidators: true }
    ).select('-__v')
    if (!client) return res.status(404).json({ error: 'Cliente no encontrado' })
    res.json({ client })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
