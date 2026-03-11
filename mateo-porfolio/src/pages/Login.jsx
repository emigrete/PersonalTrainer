import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from 'firebase/auth'
import { auth, googleProvider } from '../lib/firebase'
import { syncUser } from '../lib/api'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
      <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.548 0 9s.348 2.825.957 4.039l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

export default function Login() {
  const [tab, setTab] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const redirectAfterLogin = (profile) => {
    navigate(profile?.role === 'admin' ? '/admin' : '/perfil', { replace: true })
  }

  const handleEmailAuth = async (e) => {
    e.preventDefault()
    if (!email || !password) return setError('Completá todos los campos')
    if (tab === 'register' && !name) return setError('Ingresá tu nombre')

    setLoading(true)
    setError('')
    try {
      let credential
      if (tab === 'login') {
        credential = await signInWithEmailAndPassword(auth, email, password)
      } else {
        credential = await createUserWithEmailAndPassword(auth, email, password)
      }
      const token = await credential.user.getIdToken()
      const { user } = await syncUser(token)
      redirectAfterLogin(user)
    } catch (err) {
      const msgs = {
        'auth/user-not-found': 'No existe una cuenta con ese email',
        'auth/wrong-password': 'Contraseña incorrecta',
        'auth/email-already-in-use': 'Ese email ya tiene una cuenta',
        'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
        'auth/invalid-email': 'Email inválido',
        'auth/invalid-credential': 'Email o contraseña incorrectos',
      }
      setError(msgs[err.code] || 'Ocurrió un error, intentá de nuevo')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setLoading(true)
    setError('')
    try {
      const credential = await signInWithPopup(auth, googleProvider)
      const token = await credential.user.getIdToken()
      const { user } = await syncUser(token)
      redirectAfterLogin(user)
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Error al iniciar sesión con Google')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background effects */}
      <div className="absolute inset-0 hero-grid opacity-60" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-600 to-transparent" />
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-cyan-900/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-cyan-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">

        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-zinc-600 hover:text-white text-xs uppercase tracking-widest font-semibold transition-colors mb-8"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M13 7H1M6 3L1 7l5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Volver al inicio
        </Link>

        {/* Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-900 border-2 border-cyan-700 mb-5 shadow-2xl shadow-cyan-950/60">
            <span className="text-2xl font-black text-white tracking-tight">MM</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-widest uppercase">
            Mateo Monente
          </h1>
          <p className="text-cyan-500 text-xs uppercase tracking-[0.3em] mt-2 font-semibold">
            Personal Trainer
          </p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-2xl p-8 shadow-2xl">

          {/* Tab toggle */}
          <div className="flex gap-1 bg-zinc-800/60 rounded-xl p-1 mb-6">
            {['login', 'register'].map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError('') }}
                className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                  tab === t
                    ? 'bg-zinc-700 text-white shadow'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {t === 'login' ? 'Ingresar' : 'Registrarse'}
              </button>
            ))}
          </div>

          {/* Google button */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-100 text-zinc-900 font-bold py-3 rounded-xl transition-all text-sm mb-5 disabled:opacity-50"
          >
            <GoogleIcon />
            Continuar con Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-zinc-600 text-xs uppercase tracking-widest">o</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {tab === 'register' && (
              <div>
                <label className="block text-zinc-500 text-xs uppercase tracking-widest mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError('') }}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-600 transition-colors text-sm"
                  placeholder="Tu nombre"
                  autoComplete="name"
                />
              </div>
            )}

            <div>
              <label className="block text-zinc-500 text-xs uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-600 transition-colors text-sm"
                placeholder="tu@email.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-zinc-500 text-xs uppercase tracking-widest mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-600 transition-colors text-sm"
                placeholder="••••••••"
                autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white font-black py-4 rounded-xl transition-all uppercase tracking-widest text-sm mt-2 shadow-lg shadow-cyan-950/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0"
            >
              {loading ? 'Cargando...' : tab === 'login' ? 'Ingresar' : 'Crear cuenta'}
            </button>
          </form>
        </div>

        <p className="text-center text-zinc-700 text-xs mt-6 uppercase tracking-wider">
          © {new Date().getFullYear()} Mateo Monente
        </p>
      </div>
    </div>
  )
}
