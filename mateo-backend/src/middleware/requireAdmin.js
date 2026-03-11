/**
 * Middleware que bloquea el acceso si el usuario no es admin.
 * Debe usarse DESPUÉS de verifyToken.
 */
function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado — solo administradores' })
  }
  next()
}

module.exports = requireAdmin
