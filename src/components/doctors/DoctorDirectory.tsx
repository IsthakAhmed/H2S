'use client'
import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { SEED_DOCTORS } from '@/data/seed'
import { Doctor, Appointment, Transaction } from '@/types'
import { Clock, IndianRupee, Award, MapPin, ChevronDown, ChevronUp, CheckCircle2, Info } from 'lucide-react'
import PaymentGateway from '@/components/billing/PaymentGateway'

const SPEC_COLORS: Record<string, string> = {
  Cardiology:        'bg-red-100 text-red-700 border-red-200',
  'General Medicine':'bg-blue-100 text-blue-700 border-blue-200',
  Orthopedics:       'bg-amber-100 text-amber-700 border-amber-200',
  Pediatrics:        'bg-pink-100 text-pink-700 border-pink-200',
  Dermatology:       'bg-green-100 text-green-700 border-green-200',
  Neurology:         'bg-purple-100 text-purple-700 border-purple-200',
}

function genReceiptNo() { return 'RCP' + Date.now().toString().slice(-8) }
function genToken(room: string) {
  const zone = room.startsWith('Room') ? 'OPD' : 'OPD'
  const num  = Math.floor(Math.random() * 50) + 1
  return `Token #${zone}-${String(num).padStart(2, '0')} – ${room}`
}

export default function DoctorDirectory({ onViewReceipt }: { onViewReceipt: (tx: Transaction) => void }) {
  const { currentUser, addAppointment, addTransaction } = useApp()
  const [expanded, setExpanded]       = useState<string | null>(null)
  const [selectedSlots, setSlots]     = useState<Record<string, string>>({})
  const [payTarget, setPayTarget]     = useState<Doctor | null>(null)

  const toggle = (id: string) => setExpanded(e => e === id ? null : id)

  const handlePaymentSuccess = (method: string) => {
    if (!payTarget || !currentUser) return
    const slotId = selectedSlots[payTarget.id]
    const slot   = payTarget.slots.find(s => s.id === slotId)
    if (!slot) return

    const appt: Appointment = {
      id: 'appt_' + Date.now(),
      doctorId: payTarget.id,
      doctorName: payTarget.name,
      specialization: payTarget.specialization,
      date: new Date().toISOString().slice(0, 10),
      slot: slot.time,
      room: payTarget.room,
      fee: payTarget.fee,
      status: 'paid',
    }

    const tx: Transaction = {
      id: 'tx_' + Date.now(),
      receiptNumber: genReceiptNo(),
      date: new Date().toISOString(),
      items: [{ name: `Consultation – ${payTarget.name} (${payTarget.specialization})`, price: payTarget.fee, quantity: 1 }],
      total: payTarget.fee,
      paymentMethod: method as 'UPI' | 'Card' | 'Cash',
      queueToken: genToken(payTarget.room),
      type: 'appointment',
      appointmentId: appt.id,
    }

    addAppointment(appt)
    addTransaction(tx)
    setPayTarget(null)
    setSlots(s => { const c = { ...s }; delete c[payTarget.id]; return c })
    onViewReceipt(tx)
  }

  const availableCount = SEED_DOCTORS.reduce(
    (n, d) => n + d.slots.filter(s => s.available).length, 0
  )

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-2">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Doctor Availability</h2>
          <p className="text-sm text-slate-500 mt-0.5">Select a doctor, pick a slot & pay to confirm.</p>
        </div>
        <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2.5 py-1 rounded-full shrink-0 mt-1">
          {availableCount} slots open
        </span>
      </div>

      {/* Doctor cards */}
      {SEED_DOCTORS.map(doc => {
        const isOpen      = expanded === doc.id
        const selSlotId   = selectedSlots[doc.id]
        const isBooked    = currentUser?.appointments.some(a => a.doctorId === doc.id && a.status === 'paid')
        const availSlots  = doc.slots.filter(s => s.available).length
        const colorClass  = SPEC_COLORS[doc.specialization] || 'bg-slate-100 text-slate-600 border-slate-200'

        return (
          <div
            key={doc.id}
            className={`bg-white rounded-2xl shadow-sm border transition-all duration-200 ${
              isOpen ? 'border-sky-300 shadow-sky-100 shadow-md' : 'border-slate-100 hover:border-slate-200'
            }`}
          >
            {/* Card header / toggle */}
            <button
              onClick={() => toggle(doc.id)}
              className="w-full text-left p-4 sm:p-5 flex items-center gap-4"
            >
              {/* Avatar */}
              <div className="text-3xl w-12 h-12 flex items-center justify-center bg-slate-50 rounded-xl shrink-0 border border-slate-100">
                {doc.avatar}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-slate-800 text-sm">{doc.name}</h3>
                  {isBooked && (
                    <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Booked
                    </span>
                  )}
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block mt-1 border ${colorClass}`}>
                  {doc.specialization}
                </span>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <IndianRupee className="w-3 h-3" />₹{doc.fee.toLocaleString('en-IN')}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="w-3 h-3" />{doc.room}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Award className="w-3 h-3" />{doc.experience} yrs exp
                  </span>
                  <span className={`text-xs font-medium ${availSlots > 0 ? 'text-emerald-600' : 'text-red-400'}`}>
                    {availSlots > 0 ? `${availSlots} slots` : 'Full today'}
                  </span>
                </div>
              </div>

              <div className="shrink-0 text-slate-400">
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {/* Expanded detail */}
            {isOpen && (
              <div className="border-t border-slate-100 p-4 sm:p-5 space-y-4">
                {/* Qualifications */}
                <div className="flex items-start gap-2 bg-slate-50 rounded-xl p-3">
                  <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-500">{doc.qualifications}</p>
                </div>

                {/* Slots */}
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    Available Time Slots
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {doc.slots.map(slot => (
                      <button
                        key={slot.id}
                        disabled={!slot.available}
                        onClick={() => setSlots(s => ({ ...s, [doc.id]: slot.id }))}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          !slot.available
                            ? 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed line-through'
                            : selSlotId === slot.id
                            ? 'border-sky-500 bg-sky-600 text-white shadow-sm'
                            : 'border-sky-200 bg-sky-50 text-sky-700 hover:border-sky-400 hover:bg-sky-100'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        {slot.time}
                        {!slot.available && <span className="ml-0.5">(Full)</span>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <button
                  disabled={!selSlotId || !!isBooked}
                  onClick={() => setPayTarget(doc)}
                  className={`w-full font-semibold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2 ${
                    isBooked
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default'
                      : selSlotId
                      ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-sm hover:shadow-md'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isBooked ? (
                    <><CheckCircle2 className="w-4 h-4" /> Appointment Booked</>
                  ) : selSlotId ? (
                    <><IndianRupee className="w-4 h-4" /> Pay ₹{doc.fee.toLocaleString('en-IN')} &amp; Confirm</>
                  ) : (
                    'Select a Time Slot First'
                  )}
                </button>
              </div>
            )}
          </div>
        )
      })}

      {/* Payment modal */}
      {payTarget && (
        <PaymentGateway
          total={payTarget.fee}
          description={`Consultation – ${payTarget.name} (${payTarget.specialization})`}
          onSuccess={handlePaymentSuccess}
          onClose={() => setPayTarget(null)}
        />
      )}
    </div>
  )
}
