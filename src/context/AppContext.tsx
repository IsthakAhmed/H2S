'use client'
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { StoredUser, MedicalProfile, Appointment, Transaction, Visit } from '@/types'
import { DEMO_USER } from '@/data/seed'

const LS_KEY = 'medipay_users'
const LS_SESSION = 'medipay_session'

interface AppContextValue {
  currentUser: StoredUser | null
  login: (phone: string, password: string) => boolean
  register: (phone: string, password: string, name: string) => boolean
  loginDemo: () => void
  logout: () => void
  updateProfile: (profile: MedicalProfile) => void
  addAppointment: (appt: Appointment) => void
  addTransaction: (tx: Transaction) => void
  getUsers: () => StoredUser[]
}

const AppContext = createContext<AppContextValue | null>(null)

function getUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '[]')
  } catch {
    return []
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(users))
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null)
  const [hydrated, setHydrated] = useState(false)

  // SSR-safe hydration
  useEffect(() => {
    setHydrated(true)
    const sessionPhone = localStorage.getItem(LS_SESSION)
    if (sessionPhone) {
      const users = getUsers()
      const found = users.find(u => u.phone === sessionPhone)
      if (found) setCurrentUser(found)
    }
  }, [])

  const persistUser = useCallback((user: StoredUser) => {
    const users = getUsers()
    const idx = users.findIndex(u => u.phone === user.phone)
    if (idx >= 0) users[idx] = user
    else users.push(user)
    saveUsers(users)
    localStorage.setItem(LS_SESSION, user.phone)
    setCurrentUser(user)
  }, [])

  const login = useCallback((phone: string, password: string): boolean => {
    const users = getUsers()
    const user = users.find(u => u.phone === phone && u.password === password)
    if (!user) return false
    localStorage.setItem(LS_SESSION, phone)
    setCurrentUser(user)
    return true
  }, [])

  const register = useCallback((phone: string, password: string, name: string): boolean => {
    const users = getUsers()
    if (users.find(u => u.phone === phone)) return false
    const newUser: StoredUser = {
      phone,
      password,
      profile: { name, age: '', phone, bloodGroup: '', allergies: [] },
      visits: [],
      appointments: [],
      transactions: [],
    }
    persistUser(newUser)
    return true
  }, [persistUser])

  const loginDemo = useCallback(() => {
    const users = getUsers()
    const existing = users.find(u => u.phone === DEMO_USER.phone)
    if (!existing) {
      const demo: StoredUser = {
        phone: DEMO_USER.phone,
        password: DEMO_USER.password,
        profile: DEMO_USER.profile,
        visits: DEMO_USER.visits as Visit[],
        appointments: [],
        transactions: [],
      }
      persistUser(demo)
    } else {
      localStorage.setItem(LS_SESSION, DEMO_USER.phone)
      setCurrentUser(existing)
    }
  }, [persistUser])

  const logout = useCallback(() => {
    localStorage.removeItem(LS_SESSION)
    setCurrentUser(null)
  }, [])

  const updateProfile = useCallback((profile: MedicalProfile) => {
    if (!currentUser) return
    const updated = { ...currentUser, profile }
    persistUser(updated)
  }, [currentUser, persistUser])

  const addAppointment = useCallback((appt: Appointment) => {
    if (!currentUser) return
    const updated = { ...currentUser, appointments: [...currentUser.appointments, appt] }
    persistUser(updated)
  }, [currentUser, persistUser])

  const addTransaction = useCallback((tx: Transaction) => {
    if (!currentUser) return
    const updated = { ...currentUser, transactions: [...currentUser.transactions, tx] }
    persistUser(updated)
  }, [currentUser, persistUser])

  if (!hydrated) return null

  return (
    <AppContext.Provider value={{
      currentUser, login, register, loginDemo, logout,
      updateProfile, addAppointment, addTransaction, getUsers,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
