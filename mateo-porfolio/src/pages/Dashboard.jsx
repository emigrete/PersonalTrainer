import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  getClients, getClientDetail,
  savePlan, updatePlan,
  getClientCheckIns, addCoachNote,
} from '../lib/api'

function getInitials(name = '') {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase() || '?'
}

/* ── Plan editor modal ── */
const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

function PlanEditor({ client, existingPlan, onSave, onClose }) {
  const [title, setTitle] = useState(existingPlan?.title || '')
  const [startDate, setStartDate] = useState(
    existingPlan?.startDate ? existingPlan.startDate.slice(0, 10) : ''
  )
  const [endDate, setEndDate] = useState(
    existingPlan?.endDate ? existingPlan.endDate.slice(0, 10) : ''
  )
  const [generalNotes, setGeneralNotes] = useState(existingPlan?.generalNotes || '')
  const [days, setDays] = useState(
    existingPlan?.days?.length
      ? existingPlan.days
      : DAYS.slice(0, 5).map((name) => ({ name, focus: '', exercises: [] }))
  )
  const [saving, setSaving] = useState(false)
  const [titleError, setTitleError] = useState(false)
  // When editing collapse all days; when creating expand all
  const [openDays, setOpenDays] = useState(
    () => new Set(existingPlan ? [] : [0, 1, 2, 3, 4])
  )

  const toggleDay = (i) =>
    setOpenDays((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })

  const addExercise = (dayIdx) => {
    setDays((prev) => {
      const next = [...prev]
      next[dayIdx] = {
        ...next[dayIdx],
        exercises: [...next[dayIdx].exercises, { name: '', sets: 3, reps: '10', weight: '', notes: '' }],
      }
      return next
    })
    setOpenDays((prev) => new Set([...prev, dayIdx]))
  }

  const removeExercise = (dayIdx, exIdx) =>
    setDays((prev) => {
      const next = [...prev]
      next[dayIdx] = { ...next[dayIdx], exercises: next[dayIdx].exercises.filter((_, i) => i !== exIdx) }
      return next
    })

  const setExField = (dayIdx, exIdx, field, val) =>
    setDays((prev) =>
      prev.map((d, di) =>
        di !== dayIdx ? d : {
          ...d,
          exercises: d.exercises.map((ex, ei) => ei !== exIdx ? ex : { ...ex, [field]: val }),
        }
      )
    )

  const setDayField = (dayIdx, field, val) =>
    setDays((prev) => prev.map((d, i) => i === dayIdx ? { ...d, [field]: val } : d))

  const addDay = () => {
    const used = days.map((d) => d.name)
    const next = DAYS.find((d) => !used.includes(d)) || `Día ${days.length + 1}`
    const newIdx = days.length
    setDays((prev) => [...prev, { name: next, focus: '', exercises: [] }])
    setOpenDays((prev) => new Set([...prev, newIdx]))
  }

  const removeDay = (i) => {
    setDays((prev) => prev.filter((_, idx) => idx !== i))
    setOpenDays((prev) => {
      const next = new Set()
      for (const d of prev) {
        if (d < i) next.add(d)
        else if (d > i) next.add(d - 1)
      }
      return next
    })
  }

  const handleSave = async () => {
    if (!title.trim()) { setTitleError(true); return }
    setSaving(true)
    try {
      const body = { clientId: client._id, title, startDate, endDate, days, generalNotes }
      if (existingPlan?._id) await updatePlan(existingPlan._id, body)
      else await savePlan(body)
      onSave()
    } catch { /* ignore */ }
    finally { setSaving(false) }
  }

  const inp = "bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-600 transition-colors"
  const totalExercises = days.reduce((a, d) => a + d.exercises.length, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-6 px-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-4xl shadow-2xl">

        {/* Sticky header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur rounded-t-2xl">
          <div>
            <p className="text-cyan-500 text-xs uppercase tracking-widest font-bold mb-0.5">
              {existingPlan ? 'Editar plan' : 'Nuevo plan'}
            </p>
            <p className="text-white font-black uppercase text-sm tracking-wide">{client.name}</p>
          </div>
          <button onClick={onClose} className="text-zinc-600 hover:text-white transition-colors p-1">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* ── Section 1: Plan info ── */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-4">
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">Información del plan</p>

            <div>
              <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-1.5">
                Título <span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                value={title}
                onChange={(e) => { setTitle(e.target.value); setTitleError(false) }}
                placeholder="Ej. Mesociclo de hipertrofia — Fase 1"
                className={`w-full ${inp} ${titleError ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {titleError && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5.5" stroke="currentColor"/><path d="M6 3.5V6.5M6 8.5v.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                  El título es obligatorio
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-1.5">Inicio</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={`w-full ${inp}`} />
              </div>
              <div>
                <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-1.5">Fin</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={`w-full ${inp}`} />
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-1.5">Indicaciones generales</label>
              <textarea
                rows={2}
                value={generalNotes}
                onChange={(e) => setGeneralNotes(e.target.value)}
                placeholder="Calentamiento, progresión, notas para el cliente..."
                className={`w-full ${inp} resize-none`}
              />
            </div>
          </div>

          {/* ── Section 2: Days ── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">Días de entrenamiento</p>
              <span className="text-zinc-600 text-xs tabular-nums">{days.length} días · {totalExercises} ejercicios</span>
            </div>

            <div className="space-y-2">
              {days.map((day, di) => {
                const isOpen = openDays.has(di)
                const exCount = day.exercises.length

                return (
                  <div key={di} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">

                    {/* Day header row */}
                    <div className="flex items-center gap-2 px-4 py-3">
                      {/* Chevron toggle */}
                      <button
                        onClick={() => toggleDay(di)}
                        className="text-zinc-600 hover:text-white transition-colors flex-shrink-0 p-0.5"
                        title={isOpen ? 'Colapsar' : 'Expandir'}
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                          className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>
                          <path d="M4.5 3l5 4-5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>

                      {/* Day name dropdown */}
                      <select
                        value={day.name}
                        onChange={(e) => setDayField(di, 'name', e.target.value)}
                        className="bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-white text-xs font-bold focus:outline-none focus:border-cyan-600 flex-shrink-0"
                      >
                        {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>

                      {/* Focus / muscle group */}
                      <input
                        value={day.focus}
                        onChange={(e) => setDayField(di, 'focus', e.target.value)}
                        placeholder="Músculo o foco (ej. Pecho · Tríceps)"
                        className="flex-1 bg-transparent text-zinc-300 text-sm py-1 focus:outline-none placeholder-zinc-600 min-w-0"
                      />

                      {/* Exercise count badge */}
                      {exCount > 0 && (
                        <span className="text-zinc-500 text-xs bg-zinc-800 rounded-md px-2 py-0.5 tabular-nums flex-shrink-0">
                          {exCount} ej.
                        </span>
                      )}
                      {exCount === 0 && (
                        <span className="text-zinc-700 text-xs flex-shrink-0">Descanso</span>
                      )}

                      {/* Delete day */}
                      <button
                        onClick={() => removeDay(di)}
                        title="Eliminar día"
                        className="flex-shrink-0 text-zinc-700 hover:text-red-500 transition-colors p-1 ml-1"
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M1.75 3.5h10.5M5.25 3.5V2.333A.583.583 0 0 1 5.833 1.75h2.334A.583.583 0 0 1 8.75 2.333V3.5M3.5 3.5l.583 8.167A.583.583 0 0 0 4.667 12.25h4.666a.583.583 0 0 0 .584-.583L10.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>

                    {/* Exercises — only when expanded */}
                    {isOpen && (
                      <div className="border-t border-zinc-800 p-4 space-y-3">

                        {exCount > 0 && (
                          <>
                            {/* Column headers */}
                            <div className="grid grid-cols-12 gap-2 px-1">
                              <span className="col-span-1 text-zinc-700 text-[10px] uppercase tracking-widest text-center">#</span>
                              <span className="col-span-4 text-zinc-700 text-[10px] uppercase tracking-widest">Ejercicio</span>
                              <span className="col-span-2 text-zinc-700 text-[10px] uppercase tracking-widest text-center">Series</span>
                              <span className="col-span-2 text-zinc-700 text-[10px] uppercase tracking-widest text-center">Reps</span>
                              <span className="col-span-2 text-zinc-700 text-[10px] uppercase tracking-widest text-center">Peso</span>
                            </div>

                            {/* Exercise rows */}
                            <div className="space-y-3">
                              {day.exercises.map((ex, ei) => (
                                <div key={ei} className="space-y-1.5">
                                  {/* Main row */}
                                  <div className="grid grid-cols-12 gap-2 items-center">
                                    <span className="col-span-1 text-cyan-700 font-black text-xs text-center tabular-nums">{ei + 1}</span>
                                    <input
                                      value={ex.name}
                                      onChange={(e) => setExField(di, ei, 'name', e.target.value)}
                                      placeholder="Nombre del ejercicio"
                                      className={`col-span-4 ${inp} text-xs`}
                                    />
                                    <input
                                      type="number" min="1"
                                      value={ex.sets}
                                      onChange={(e) => setExField(di, ei, 'sets', e.target.value)}
                                      className={`col-span-2 ${inp} text-xs text-center`}
                                    />
                                    <input
                                      value={ex.reps}
                                      onChange={(e) => setExField(di, ei, 'reps', e.target.value)}
                                      placeholder="10"
                                      className={`col-span-2 ${inp} text-xs text-center`}
                                    />
                                    <input
                                      value={ex.weight}
                                      onChange={(e) => setExField(di, ei, 'weight', e.target.value)}
                                      placeholder="—"
                                      className={`col-span-2 ${inp} text-xs text-center`}
                                    />
                                    <button
                                      onClick={() => removeExercise(di, ei)}
                                      title="Eliminar ejercicio"
                                      className="col-span-1 flex items-center justify-center text-zinc-700 hover:text-red-500 transition-colors"
                                    >
                                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                      </svg>
                                    </button>
                                  </div>
                                  {/* Notes row */}
                                  <div className="grid grid-cols-12 gap-2">
                                    <span className="col-span-1" />
                                    <input
                                      value={ex.notes}
                                      onChange={(e) => setExField(di, ei, 'notes', e.target.value)}
                                      placeholder="Nota técnica (ej. cadencia 3-1-1, RPE 8, pausa en fondo...)"
                                      className={`col-span-11 ${inp} text-xs text-zinc-400 placeholder-zinc-600`}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {exCount === 0 && (
                          <p className="text-zinc-700 text-xs uppercase tracking-widest text-center py-3">
                            Sin ejercicios — se mostrará como día de descanso
                          </p>
                        )}

                        <button
                          onClick={() => addExercise(di)}
                          className="w-full mt-1 border border-dashed border-zinc-700 hover:border-cyan-700 text-zinc-600 hover:text-cyan-500 rounded-lg py-2 text-xs uppercase tracking-widest font-bold transition-colors"
                        >
                          + Agregar ejercicio
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}

              <button
                onClick={addDay}
                className="w-full border border-dashed border-zinc-700 hover:border-cyan-700 text-zinc-600 hover:text-cyan-500 rounded-xl py-3 text-xs uppercase tracking-widest font-bold transition-colors"
              >
                + Agregar día
              </button>
            </div>
          </div>
        </div>

        {/* Sticky footer */}
        <div className="sticky bottom-0 flex items-center justify-between gap-3 px-6 py-4 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur rounded-b-2xl">
          <p className="text-zinc-600 text-xs tabular-nums">
            {days.length} días · {totalExercises} ejercicios en total
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-white text-xs uppercase tracking-widest font-bold transition-colors px-4 py-2"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs uppercase tracking-widest px-6 py-2.5 rounded-xl transition-all disabled:opacity-50"
            >
              {saving ? 'Guardando...' : existingPlan ? 'Actualizar plan' : 'Crear plan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Client detail side panel ── */
function ClientPanel({ clientId, onClose }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [checkIns, setCheckIns] = useState([])
  const [showPlanEditor, setShowPlanEditor] = useState(false)
  const [coachNote, setCoachNote] = useState({})

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [detailRes, checkInsRes] = await Promise.all([
        getClientDetail(clientId),
        getClientCheckIns(clientId),
      ])
      setDetail(detailRes)
      setCheckIns(checkInsRes.checkIns)
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }, [clientId])

  useEffect(() => { load() }, [load])

  const handleCoachNote = async (checkInId) => {
    try {
      await addCoachNote(checkInId, coachNote[checkInId] || '')
      setCoachNote((prev) => ({ ...prev, [checkInId]: '' }))
      const res = await getClientCheckIns(clientId)
      setCheckIns(res.checkIns)
    } catch { /* ignore */ }
  }

  if (loading) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-8 h-8 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const { client, plan } = detail || {}

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-xl bg-zinc-950 border-l border-zinc-800 overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 bg-zinc-950/95 backdrop-blur border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-900 border border-cyan-700 flex items-center justify-center">
              <span className="text-xs font-black text-white">{getInitials(client?.name)}</span>
            </div>
            <div>
              <p className="text-white font-black text-sm uppercase">{client?.name}</p>
              <p className="text-zinc-500 text-xs">{client?.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-600 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Plan summary */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold">Plan activo</p>
              <button onClick={() => setShowPlanEditor(true)}
                className="text-cyan-500 hover:text-cyan-400 text-xs uppercase tracking-widest font-bold transition-colors">
                {plan ? 'Editar plan' : '+ Crear plan'}
              </button>
            </div>
            {plan ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <p className="text-white font-bold text-sm">{plan.title}</p>
                <p className="text-zinc-500 text-xs mt-1">
                  {plan.days?.length} días · {plan.days?.reduce((a, d) => a + d.exercises.length, 0)} ejercicios
                </p>
                {plan.generalNotes && <p className="text-zinc-600 text-xs mt-2 italic">{plan.generalNotes}</p>}
              </div>
            ) : (
              <div className="bg-zinc-900/50 border border-dashed border-zinc-800 rounded-xl px-4 py-6 text-center">
                <p className="text-zinc-600 text-xs uppercase tracking-widest">Sin plan asignado</p>
              </div>
            )}
          </div>

          {/* Check-ins */}
          <div>
            <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold mb-3">Check-ins recientes</p>
            {checkIns.length === 0 ? (
              <p className="text-zinc-700 text-xs uppercase tracking-widest py-4 text-center">Sin check-ins todavía</p>
            ) : (
              <div className="space-y-3">
                {checkIns.map((ci) => (
                  <div key={ci._id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-zinc-500 text-xs">{new Date(ci.date).toLocaleDateString('es-AR')}</p>
                      <span className="text-xs text-cyan-600 font-bold tabular-nums">
                        {ci.completedWorkouts}/{ci.totalWorkouts} entrenos
                      </span>
                    </div>
                    <div className="flex gap-4 mb-2">
                      {ci.weight && <p className="text-white font-black text-lg">{ci.weight}<span className="text-zinc-600 text-xs ml-1 font-normal">kg</span></p>}
                      {ci.bodyFat && <p className="text-white font-black text-lg">{ci.bodyFat}<span className="text-zinc-600 text-xs ml-1 font-normal">%</span></p>}
                    </div>
                    {ci.clientNotes && <p className="text-zinc-400 text-xs italic mb-3">"{ci.clientNotes}"</p>}

                    {ci.coachNotes ? (
                      <div className="bg-cyan-950/30 border border-cyan-900/40 rounded-lg px-3 py-2 mt-2">
                        <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-0.5">Tu nota</p>
                        <p className="text-cyan-200 text-xs">{ci.coachNotes}</p>
                      </div>
                    ) : (
                      <div className="flex gap-2 mt-2">
                        <input
                          value={coachNote[ci._id] || ''}
                          onChange={(e) => setCoachNote((p) => ({ ...p, [ci._id]: e.target.value }))}
                          placeholder="Agregar nota de coach..."
                          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-cyan-600 transition-colors"
                        />
                        <button onClick={() => handleCoachNote(ci._id)}
                          className="bg-cyan-800 hover:bg-cyan-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                          Enviar
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showPlanEditor && (
        <PlanEditor
          client={client}
          existingPlan={plan}
          onSave={() => { setShowPlanEditor(false); load() }}
          onClose={() => setShowPlanEditor(false)}
        />
      )}
    </>
  )
}

/* ── Main Dashboard ── */
export default function Dashboard() {
  const { logout } = useAuth()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedClientId, setSelectedClientId] = useState(null)

  useEffect(() => {
    getClients()
      .then(({ clients: data }) => setClients(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = async () => {
    await logout()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* Admin navbar */}
      <nav className="sticky top-0 z-30 bg-zinc-950/95 backdrop-blur border-b border-zinc-900 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-cyan-900 border border-cyan-700 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-black text-white">MM</span>
            </div>
            <div>
              <p className="font-black text-white uppercase tracking-wider text-sm leading-tight">Panel Admin</p>
              <p className="text-cyan-600 text-[10px] tracking-widest uppercase">Mateo Monente</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xs text-zinc-500 hover:text-white uppercase tracking-widest font-semibold transition-colors hidden sm:block">
              Ver sitio →
            </Link>
            <button onClick={handleLogout}
              className="text-xs font-bold text-zinc-500 hover:text-red-400 uppercase tracking-widest transition-colors border border-zinc-800 hover:border-red-900/60 rounded-lg px-3 py-2">
              Salir
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Page header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-cyan-600" />
            <span className="text-cyan-500 text-xs font-bold uppercase tracking-[0.35em]">Panel de control</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Mis Clientes</h1>
          <p className="text-zinc-500 mt-2">Gestioná planes, check-ins y el seguimiento de cada cliente.</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total clientes', value: clients.length },
            { label: 'Plataforma', value: 'MongoDB' },
            { label: 'Auth', value: 'Firebase' },
            { label: 'Estado', value: 'Live' },
          ].map((s) => (
            <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <p className="text-zinc-600 text-xs uppercase tracking-widest mb-2">{s.label}</p>
              <p className="text-3xl font-black text-white tabular-nums leading-none">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="font-black text-white uppercase tracking-wider text-sm">Lista de clientes</h2>
            <span className="text-zinc-600 text-xs bg-zinc-800 rounded-lg px-2.5 py-1">
              {clients.length} clientes
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-6 h-6 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : clients.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-zinc-600 text-sm uppercase tracking-widest">Ningún cliente registrado todavía</p>
              <p className="text-zinc-700 text-xs mt-2">Los clientes aparecen aquí cuando se registran en la plataforma</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800/80">
                    {['Cliente', 'Email', 'Objetivo', 'Desde', 'Acciones'].map((h) => (
                      <th key={h} className="text-left text-zinc-600 text-xs uppercase tracking-widest font-semibold px-6 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client, i) => (
                    <tr key={client._id}
                      className={`hover:bg-zinc-800/30 transition-colors ${i < clients.length - 1 ? 'border-b border-zinc-800/50' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0">
                            <span className="text-[10px] font-black text-zinc-400">{getInitials(client.name)}</span>
                          </div>
                          <span className="text-white text-sm font-semibold whitespace-nowrap">{client.name || '—'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-500 text-sm whitespace-nowrap">{client.email}</td>
                      <td className="px-6 py-4 text-zinc-500 text-sm max-w-xs truncate">
                        {client.objective || <span className="text-zinc-700">—</span>}
                      </td>
                      <td className="px-6 py-4 text-zinc-500 text-sm whitespace-nowrap">
                        {new Date(client.createdAt).toLocaleDateString('es-AR')}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedClientId(client._id)}
                          className="text-xs font-bold text-cyan-600 hover:text-cyan-400 uppercase tracking-widest transition-colors border border-cyan-900/50 hover:border-cyan-700 rounded-lg px-3 py-1.5">
                          Ver detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-zinc-700 text-xs mt-4 uppercase tracking-wider">
          Datos sincronizados con MongoDB Atlas · Auth via Firebase
        </p>
      </div>

      {selectedClientId && (
        <ClientPanel
          clientId={selectedClientId}
          onClose={() => setSelectedClientId(null)}
        />
      )}
    </div>
  )
}
