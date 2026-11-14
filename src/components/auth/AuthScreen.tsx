'use client'
import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { Phone, Lock, User, Stethoscope, AlertCircle, Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react'

export default function AuthScreen() {
  const { login, register, loginDemo } = useApp()
  const [mode, setMode]         = useState<'login' | 'register'>('login')
  const [phone, setPhone]       = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]         = useState('')
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)

  const validate = () => {
    if (mode === 'register' && !name.trim()) return 'Full name is required.'
    if (!phone)                              return 'Phone number is required.'
    if (phone.length !== 10 || !/^\d+$/.test(phone)) return 'Enter a valid 10-digit phone number.'
    if (!password)                           return 'Password is required.'
    if (password.length < 6)                 return 'Password must be at least 6 characters.'
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setError(''); setSuccess('')
    setLoading(true)

    // Brief artificial delay so the button spinner shows
    await new Promise(r => setTimeout(r, 400))

    if (mode === 'login') {
      const ok = login(phone, password)
      if (!ok) { setError('Invalid phone number or password.'); setLoading(false) }
    } else {
      const ok = register(phone, password, name.trim())
      if (!ok) {
        setError('Phone number already registered. Please log in.')
        setLoading(false)
      } else {
        setSuccess('Account created! Logging you in…')
      }
    }
  }

  const handleDemo = async () => {
    setDemoLoading(true)
    await new Promise(r => setTimeout(r, 300))
    loginDemo()
  }

  const switchMode = (m: 'login' | 'register') => {
    setMode(m); setError(''); setSuccess(''); setPhone(''); setPassword(''); setName('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-sky-800 to-sky-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-xl mb-4 ring-4 ring-white/20">
            <Stethoscope className="w-10 h-10 text-sky-600" />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">MediPay</h1>
          <p className="text-sky-200 mt-1 text-sm">Smart Hospital Payments &amp; Bookings</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
          {/* Mode tabs */}
          <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
            {(['login', 'register'] as const).map(m => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  mode === m ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {m === 'login' ? 'Log In' : 'Register'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Name — register only */}
            {mode === 'register' && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text" value={name}
                  onChange={e => { setName(e.target.value); setError('') }}
                  placeholder="Full Name"
                  autoComplete="name"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-shadow"
                />
              </div>
            )}

            {/* Phone */}
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="tel" value={phone}
                onChange={e => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setError('') }}
                placeholder="Phone Number (10 digits)"
                autoComplete="tel"
                inputMode="numeric"
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-shadow"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type={showPass ? 'text' : 'password'} value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                placeholder="Password (min 6 chars)"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-shadow"
              />
              <button
                type="button"
                onClick={() => setShowPass(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                tabIndex={-1}
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Error / Success */}
            {error && (
              <div className="flex items-start gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="flex items-start gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5 text-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-600 hover:bg-sky-700 disabled:opacity-70 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Please wait…' : mode === 'login' ? 'Log In' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Demo login */}
          <button
            onClick={handleDemo}
            disabled={demoLoading}
            className="w-full border-2 border-emerald-500 text-emerald-700 hover:bg-emerald-50 disabled:opacity-70 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {demoLoading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Stethoscope className="w-4 h-4" />
            }
            {demoLoading ? 'Loading demo…' : 'One-Click Demo Patient Login'}
          </button>
          <p className="text-center text-xs text-slate-400 mt-2">
            Pre-loaded with sample profile, visits &amp; allergy data
          </p>
        </div>

        <p className="text-center text-sky-300/60 text-xs mt-6">
          MediPay Hospital Management System v1.0
        </p>
      </div>
    </div>
  )
}
