import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { syncUser } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // firebaseUser = objeto de Firebase Auth (o null)
  // profile = objeto de MongoDB (o null)
  const [firebaseUser, setFirebaseUser] = useState(undefined) // undefined = loading
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser)

      if (fbUser) {
        try {
          const token = await fbUser.getIdToken()
          const { user } = await syncUser(token)
          setProfile(user)
        } catch {
          setProfile(null)
        }
      } else {
        setProfile(null)
      }
    })

    return unsub
  }, [])

  const logout = async () => {
    await signOut(auth)
    setProfile(null)
  }

  const isAdmin = profile?.role === 'admin' || firebaseUser?.email === import.meta.env.VITE_ADMIN_EMAIL
  const loading = firebaseUser === undefined

  return (
    <AuthContext.Provider value={{ firebaseUser, profile, isAdmin, loading, logout, setProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
