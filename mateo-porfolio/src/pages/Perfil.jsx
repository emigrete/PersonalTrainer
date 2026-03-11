import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getMyPlan, getMyCheckIns, createCheckIn } from '../lib/api'

/* ── helpers ── */
function SectionLabel({ text }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-8 h-px bg-cyan-600" />
      <span className="text-cyan-500 text-xs font-bold uppercase tracking-[0.35em]">{text}</span>
    </div>
  )
}

function EmptyState({ icon, text }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-4xl mb-4 opacity-30">{icon}</div>
      <p className="text-zinc-600 text-sm uppercase tracking-widest">{text}</p>
    </div>
  )
}

/* ── Plan viewer ── */
function PlanView({ plan }) {
  if (!plan) return <EmptyState icon="📋" text="Mateo todavía no asignó tu plan · Pronto estará disponible" />

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">{plan.title}</h3>
          {plan.startDate && (
            <p className="text-zinc-500 text-xs mt-1 uppercase tracking-wider">
              {new Date(plan.startDate).toLocaleDateString('es-AR')}
              {plan.endDate && ` → ${new Date(plan.endDate).toLocaleDateString('es-AR')}`}
            </p>
          )}
        </div>
        <span className="inline-flex items-center gap-1.5 bg-cyan-950/60 border border-cyan-900/50 text-cyan-400 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          Plan activo
        </span>
      </div>

      {plan.generalNotes && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl px-5 py-4 mb-6">
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Nota general</p>
          <p className="text-zinc-300 text-sm leading-relaxed">{plan.generalNotes}</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {plan.days.map((day) => (
          <div key={day.name} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-cyan-900/50 transition-colors">
            <div className="px-5 py-3 border-b border-zinc-800 flex items-center justify-between">
              <p className="text-white font-black text-sm uppercase tracking-wide">{day.name}</p>
              {day.focus && (
                <span className="text-zinc-600 text-[10px] uppercase tracking-widest">{day.focus}</span>
              )}
            </div>
            <div className="p-4 space-y-3">
              {day.exercises.length === 0 && (
                <p className="text-zinc-700 text-xs uppercase tracking-wider">Descanso</p>
              )}
              {day.exercises.map((ex, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-cyan-700 font-black text-xs mt-0.5 w-4 flex-shrink-0 tabular-nums">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold leading-tight">{ex.name}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-zinc-500 text-xs tabular-nums">{ex.sets} × {ex.reps}</span>
                      {ex.weight && <span className="text-zinc-600 text-xs">· {ex.weight}</span>}
                    </div>
                    {ex.notes && <p className="text-zinc-600 text-xs mt-0.5 italic">{ex.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Check-in form ── */
function CheckInForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    weight: '', bodyFat: '', completedWorkouts: '', totalWorkouts: '', clientNotes: '',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      weight: form.weight ? Number(form.weight) : undefined,
      bodyFat: form.bodyFat ? Number(form.bodyFat) : undefined,
      completedWorkouts: form.completedWorkouts ? Number(form.completedWorkouts) : 0,
      totalWorkouts: form.totalWorkouts ? Number(form.totalWorkouts) : 0,
      clientNotes: form.clientNotes,
    })
    setForm({ weight: '', bodyFat: '', completedWorkouts: '', totalWorkouts: '', clientNotes: '' })
  }

  const inputClass = "w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-600 transition-colors text-sm"

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
      <p className="text-white font-black text-sm uppercase tracking-wider mb-4">Registrar check-in semanal</p>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-zinc-500 text-xs uppercase tracking-widest mb-2">Peso (kg)</label>
          <input type="number" step="0.1" placeholder="75.5" value={form.weight}
            onChange={(e) => set('weight', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-zinc-500 text-xs uppercase tracking-widest mb-2">% Grasa (opcional)</label>
          <input type="number" step="0.1" placeholder="18.0" value={form.bodyFat}
            onChange={(e) => set('bodyFat', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-zinc-500 text-xs uppercase tracking-widest mb-2">Entrenos completados</label>
          <input type="number" min="0" placeholder="4" value={form.completedWorkouts}
            onChange={(e) => set('completedWorkouts', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-zinc-500 text-xs uppercase tracking-widest mb-2">Entrenos del plan</label>
          <input type="number" min="0" placeholder="5" value={form.totalWorkouts}
            onChange={(e) => set('totalWorkouts', e.target.value)} className={inputClass} />
        </div>
      </div>

      <div>
        <label className="block text-zinc-500 text-xs uppercase tracking-widest mb-2">Tu nota para Mateo</label>
        <textarea rows={3} placeholder="¿Cómo te sentiste esta semana? ¿Algo que ajustar?"
          value={form.clientNotes} onChange={(e) => set('clientNotes', e.target.value)}
          className={`${inputClass} resize-none`} />
      </div>

      <button type="submit" disabled={loading}
        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-3 rounded-xl transition-all uppercase tracking-widest text-sm disabled:opacity-50">
        {loading ? 'Guardando...' : 'Enviar check-in'}
      </button>
    </form>
  )
}

/* ── Check-ins list ── */
function CheckInList({ checkIns }) {
  if (checkIns.length === 0) return <EmptyState icon="📊" text="Todavía no hay check-ins registrados" />

  return (
    <div className="space-y-3">
      {checkIns.map((ci) => (
        <div key={ci._id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <p className="text-zinc-500 text-xs uppercase tracking-widest">
              {new Date(ci.date).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            {ci.completedWorkouts > 0 && (
              <span className="text-xs font-bold text-cyan-500 tabular-nums">
                {ci.completedWorkouts}/{ci.totalWorkouts} entrenos
              </span>
            )}
          </div>

          <div className="flex gap-6 mb-3">
            {ci.weight && (
              <div>
                <p className="text-2xl font-black text-white tabular-nums leading-none">{ci.weight}<span className="text-sm text-zinc-600 font-normal ml-1">kg</span></p>
              </div>
            )}
            {ci.bodyFat && (
              <div>
                <p className="text-2xl font-black text-white tabular-nums leading-none">{ci.bodyFat}<span className="text-sm text-zinc-600 font-normal ml-1">%</span></p>
              </div>
            )}
          </div>

          {ci.clientNotes && (
            <div className="border-t border-zinc-800 pt-3 mt-3">
              <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Tu nota</p>
              <p className="text-zinc-300 text-sm leading-relaxed">{ci.clientNotes}</p>
            </div>
          )}

          {ci.coachNotes && (
            <div className="bg-cyan-950/30 border border-cyan-900/40 rounded-xl px-4 py-3 mt-3">
              <p className="text-cyan-600 text-xs uppercase tracking-widest mb-1 font-bold">Nota de Mateo</p>
              <p className="text-cyan-200 text-sm leading-relaxed">{ci.coachNotes}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/* ── Main page ── */
export default function Perfil() {
  const { profile, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('plan') // 'plan' | 'checkins'
  const [plan, setPlan] = useState(null)
  const [checkIns, setCheckIns] = useState([])
  const [fetchLoading, setFetchLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function load() {
    setFetchLoading(true)
    setFetchError(null)
    try {
      const [planRes, checkInsRes] = await Promise.all([getMyPlan(), getMyCheckIns()])
      setPlan(planRes.plan ?? null)
      setCheckIns(checkInsRes.checkIns ?? [])
    } catch (err) {
      setFetchError('No se pudieron cargar los datos. Verificá que el servidor esté activo.')
      console.error(err)
    } finally {
      setFetchLoading(false)
    }
  }

  useEffect(() => {
    if (profile) load()
  }, [profile])

  const handleCheckIn = async (data) => {
    setSubmitting(true)
    try {
      const { checkIn } = await createCheckIn(data)
      setCheckIns((prev) => [checkIn, ...prev])
      setTab('checkins')
    } catch { /* ignore */ }
    finally { setSubmitting(false) }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur border-b border-zinc-900 shadow-lg shadow-black/20">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-900 border border-cyan-700 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-black text-white">
                {profile?.name?.slice(0, 2).toUpperCase() || 'MM'}
              </span>
            </div>
            <div>
              <p className="font-black text-white uppercase tracking-wider text-sm leading-tight">
                {profile?.name || 'Mi perfil'}
              </p>
              <p className="text-cyan-600 text-[10px] tracking-widest uppercase">Área personal</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a href="/" className="text-xs text-zinc-500 hover:text-white uppercase tracking-widest font-semibold transition-colors hidden sm:block">
              Inicio →
            </a>
            <button
              onClick={handleLogout}
              className="text-xs font-bold text-zinc-500 hover:text-red-400 uppercase tracking-widest transition-colors border border-zinc-800 hover:border-red-900/60 rounded-lg px-3 py-2"
            >
              Salir
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-cyan-600" />
            <span className="text-cyan-500 text-xs font-bold uppercase tracking-[0.35em]">Tu área personal</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
            Hola, {profile?.name?.split(' ')[0] || 'Cliente'} 👋
          </h1>
          {profile?.objective && (
            <p className="text-zinc-500 mt-2 text-sm">Objetivo: <span className="text-zinc-300">{profile.objective}</span></p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1 mb-8 w-fit">
          {[
            { key: 'plan', label: 'Mi plan' },
            { key: 'checkins', label: 'Check-ins' },
            { key: 'nuevo', label: '+ Nuevo check-in' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                tab === key
                  ? 'bg-zinc-700 text-white shadow'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {fetchLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-6 h-6 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : fetchError ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <p className="text-red-400 text-sm uppercase tracking-widest">{fetchError}</p>
            <button
              onClick={load}
              className="text-xs font-bold text-white uppercase tracking-widest border border-zinc-700 hover:border-cyan-700 hover:text-cyan-400 rounded-lg px-4 py-2 transition-all"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <>
            {tab === 'plan' && <PlanView plan={plan} />}
            {tab === 'checkins' && <CheckInList checkIns={checkIns} />}
            {tab === 'nuevo' && <CheckInForm onSubmit={handleCheckIn} loading={submitting} />}
          </>
        )}
      </div>
    </div>
  )
}
