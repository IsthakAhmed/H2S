'use client'
import { useState } from 'react'
import { CreditCard, Smartphone, Loader2, CheckCircle2, XCircle, X, ShieldCheck } from 'lucide-react'

type PaymentMethod = 'UPI' | 'Card'

interface Props {
  total: number
  description: string
  onSuccess: (method: string) => void
  onClose: () => void
}

export default function PaymentGateway({ total, description, onSuccess, onClose }: Props) {
  const [method, setMethod] = useState<PaymentMethod>('UPI')
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle')
  const [upiId, setUpiId]   = useState('')
  const [cardNo, setCardNo] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv]       = useState('')
  const [cardName, setCardName] = useState('')
  const [error, setError]   = useState('')

  const validate = () => {
    setError('')
    if (method === 'UPI') {
      if (!upiId.includes('@') || upiId.length < 5)
        return 'Enter a valid UPI ID (e.g., name@upi)'
    } else {
      if (cardNo.replace(/\s/g, '').length < 16) return 'Enter a valid 16-digit card number'
      if (!expiry.match(/^\d{2}\/\d{2}$/))        return 'Enter expiry as MM/YY'
      if (cvv.length < 3)                          return 'Enter a valid CVV (3–4 digits)'
      if (!cardName.trim())                        return 'Enter the cardholder name'
    }
    return ''
  }

  const handlePay = () => {
    const err = validate()
    if (err) { setError(err); return }
    setStatus('processing')
    setTimeout(() => {
      setStatus('success')
      setTimeout(() => onSuccess(method), 900)
    }, 1500)
  }

  const handleMethodChange = (m: PaymentMethod) => { setMethod(m); setError('') }
  const handleClose = () => { if (status !== 'processing') onClose() }

  const formatCard   = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4)
    return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-sky-700 p-5 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sky-300 text-xs font-medium mb-1">Secure Payment</p>
              <p className="font-bold text-sm leading-snug max-w-[200px] truncate">{description}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-sky-300">Amount</p>
                <p className="text-xl font-bold">₹{total.toLocaleString('en-IN')}</p>
              </div>
              <button
                onClick={handleClose}
                disabled={status === 'processing'}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-30"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          {status === 'processing' && (
            <div className="flex flex-col items-center py-10 gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-sky-100 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
                </div>
              </div>
              <div className="text-center">
                <p className="font-bold text-slate-700">Processing Payment…</p>
                <p className="text-xs text-slate-400 mt-1">Please wait, do not close this window.</p>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center py-10 gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <div className="text-center">
                <p className="font-bold text-slate-700 text-lg">Payment Successful!</p>
                <p className="text-xs text-slate-400 mt-1">Generating your receipt…</p>
              </div>
            </div>
          )}

          {status === 'failed' && (
            <div className="flex flex-col items-center py-8 gap-4">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-500" />
              </div>
              <div className="text-center">
                <p className="font-bold text-slate-700">Payment Failed</p>
                <p className="text-xs text-slate-400 mt-1">Please check your details and try again.</p>
              </div>
              <button
                onClick={() => { setStatus('idle'); setError('') }}
                className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {status === 'idle' && (
            <>
              {/* Method tabs */}
              <div className="flex bg-slate-100 rounded-xl p-1 mb-5">
                {(['UPI', 'Card'] as PaymentMethod[]).map(m => (
                  <button
                    key={m}
                    onClick={() => handleMethodChange(m)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      method === m ? 'bg-sky-600 text-white shadow' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {m === 'UPI' ? <Smartphone className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                    {m}
                  </button>
                ))}
              </div>

              {/* UPI form */}
              {method === 'UPI' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 bg-sky-50 border border-sky-200 rounded-xl px-3 py-2.5 text-xs text-sky-700 font-medium">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    Secured by UPI – No data is stored on our servers
                  </div>
                  <input
                    value={upiId}
                    onChange={e => { setUpiId(e.target.value); setError('') }}
                    placeholder="yourname@upi"
                    className="input"
                    autoComplete="off"
                    inputMode="email"
                  />
                  <div className="flex flex-wrap gap-2">
                    {['@okaxis', '@paytm', '@ybl', '@ibl'].map(suffix => (
                      <button
                        key={suffix}
                        onClick={() => setUpiId(u => u.split('@')[0] + suffix)}
                        className="text-xs border border-slate-200 bg-slate-50 hover:border-sky-400 hover:text-sky-600 hover:bg-sky-50 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        {suffix}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Card form */}
              {method === 'Card' && (
                <div className="space-y-3">
                  <input
                    value={cardName}
                    onChange={e => { setCardName(e.target.value); setError('') }}
                    placeholder="Cardholder Name"
                    className="input"
                    autoComplete="cc-name"
                  />
                  <input
                    value={cardNo}
                    onChange={e => { setCardNo(formatCard(e.target.value)); setError('') }}
                    placeholder="1234 5678 9012 3456"
                    className="input font-mono tracking-wider"
                    autoComplete="cc-number"
                    inputMode="numeric"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      value={expiry}
                      onChange={e => { setExpiry(formatExpiry(e.target.value)); setError('') }}
                      placeholder="MM/YY"
                      className="input"
                      autoComplete="cc-exp"
                      inputMode="numeric"
                    />
                    <input
                      value={cvv}
                      onChange={e => { setCvv(e.target.value.replace(/\D/g, '').slice(0, 4)); setError('') }}
                      placeholder="CVV"
                      type="password"
                      className="input"
                      autoComplete="cc-csc"
                      inputMode="numeric"
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-3 flex items-start gap-2 text-red-600 bg-red-50 border border-red-200 px-3 py-2.5 rounded-xl text-xs">
                  <span className="shrink-0 mt-0.5">⚠️</span>
                  {error}
                </div>
              )}

              <button
                onClick={handlePay}
                className="mt-5 w-full bg-sky-600 hover:bg-sky-700 active:scale-[0.98] text-white font-bold py-4 rounded-xl transition-all text-sm shadow-sm hover:shadow-md"
              >
                Pay ₹{total.toLocaleString('en-IN')} via {method}
              </button>

              <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3" /> 256-bit SSL encrypted · Mock demo — no real payment
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
