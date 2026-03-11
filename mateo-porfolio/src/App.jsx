import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Perfil from './pages/Perfil'

/* ── Loading spinner ── */
function Spinner() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-7 h-7 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

/* ── Protege rutas que requieren estar logueado ── */
function PrivateRoute({ children }) {
  const { firebaseUser, loading } = useAuth()
  if (loading) return <Spinner />
  return firebaseUser ? children : <Navigate to="/login" replace />
}

/* ── Protege rutas solo para admin ── */
function AdminRoute({ children }) {
  const { firebaseUser, isAdmin, loading } = useAuth()
  if (loading) return <Spinner />
  if (!firebaseUser) return <Navigate to="/login" replace />
  return isAdmin ? children : <Navigate to="/perfil" replace />
}

/* ── Redirige a la página correcta si ya está logueado ── */
function PublicOnlyRoute({ children }) {
  const { firebaseUser, isAdmin, loading } = useAuth()
  if (loading) return <Spinner />
  if (firebaseUser) return <Navigate to={isAdmin ? '/admin' : '/perfil'} replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
      <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
      <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
