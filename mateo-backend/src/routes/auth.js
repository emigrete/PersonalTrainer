const express = require('express')
const admin = require('../config/firebase')
const User = require('../models/User')

const router = express.Router()

/**
 * POST /api/auth/sync
 * Verifica el token de Firebase, crea o actualiza el usuario en MongoDB,
 * y devuelve el perfil completo.
 */
router.post('/sync', async (req, res) => {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' })
  }

  const token = header.split(' ')[1]

  try {
    const decoded = await admin.auth().verifyIdToken(token)

    const isAdmin = decoded.email === process.env.ADMIN_EMAIL
    const role = isAdmin ? 'admin' : 'client'

    // Find by firebaseUid first; fall back to email (handles uid changes)
    let user = await User.findOne({ firebaseUid: decoded.uid })
      ?? await User.findOne({ email: decoded.email })

    if (user) {
      user.firebaseUid = decoded.uid
      user.role = role
      await user.save()
    } else {
      user = await User.create({
        firebaseUid: decoded.uid,
        email: decoded.email,
        name: decoded.name || decoded.email.split('@')[0],
        role,
      })
    }

    res.json({ user })
  } catch (err) {
    console.error('Error en /auth/sync:', err.code, err.message)
    if (typeof err.code === 'string' && err.code.startsWith('auth/')) {
      return res.status(401).json({ error: 'Token inválido o expirado' })
    }
    res.status(500).json({ error: 'Error del servidor' })
  }
})

module.exports = router
