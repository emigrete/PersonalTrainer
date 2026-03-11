const admin = require('../config/firebase')
const User = require('../models/User')

/**
 * Verifica el Firebase ID token del header Authorization.
 * Si el token es válido, adjunta el usuario de MongoDB en req.user.
 */
async function verifyToken(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' })
  }

  const token = header.split(' ')[1]

  try {
    const decoded = await admin.auth().verifyIdToken(token)
    const isAdmin = decoded.email === process.env.ADMIN_EMAIL

    let user = await User.findOne({ firebaseUid: decoded.uid })
      ?? await User.findOne({ email: decoded.email })

    if (user) {
      if (user.firebaseUid !== decoded.uid) {
        user.firebaseUid = decoded.uid
        await user.save()
      }
    } else {
      user = await User.create({
        firebaseUid: decoded.uid,
        email: decoded.email,
        name: decoded.name || decoded.email.split('@')[0],
        role: isAdmin ? 'admin' : 'client',
      })
    }
    req.user = user
    next()
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' })
  }
}

module.exports = verifyToken
