import { auth } from './firebase'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

/**
 * Wrapper sobre fetch que adjunta automáticamente el token de Firebase
 * en el header Authorization.
 */
async function apiFetch(path, options = {}, token = null) {
  if (!token) {
    await auth.authStateReady()
    const user = auth.currentUser
    token = user ? await user.getIdToken() : null
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || `Error ${res.status}`)
  }

  return data
}

// ── Auth ─────────────────────────────────────────────────────
export const syncUser = (token) => apiFetch('/api/auth/sync', { method: 'POST' }, token)

// ── Clientes (admin) ─────────────────────────────────────────
export const getClients = () => apiFetch('/api/clients')
export const getClientDetail = (id) => apiFetch(`/api/clients/${id}`)
export const updateClient = (id, body) =>
  apiFetch(`/api/clients/${id}`, { method: 'PUT', body: JSON.stringify(body) })

// ── Planes ───────────────────────────────────────────────────
export const getMyPlan = () => apiFetch('/api/plans/me')
export const getClientPlan = (clientId) => apiFetch(`/api/plans/${clientId}`)
export const savePlan = (body) =>
  apiFetch('/api/plans', { method: 'POST', body: JSON.stringify(body) })
export const updatePlan = (id, body) =>
  apiFetch(`/api/plans/${id}`, { method: 'PUT', body: JSON.stringify(body) })
export const deletePlan = (id) => apiFetch(`/api/plans/${id}`, { method: 'DELETE' })

// ── Check-ins ─────────────────────────────────────────────────
export const getMyCheckIns = () => apiFetch('/api/checkins/me')
export const getClientCheckIns = (clientId) => apiFetch(`/api/checkins/${clientId}`)
export const createCheckIn = (body) =>
  apiFetch('/api/checkins', { method: 'POST', body: JSON.stringify(body) })
export const addCoachNote = (id, coachNotes) =>
  apiFetch(`/api/checkins/${id}/coach`, { method: 'PATCH', body: JSON.stringify({ coachNotes }) })
