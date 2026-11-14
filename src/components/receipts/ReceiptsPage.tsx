'use client'
import { useApp } from '@/context/AppContext'
import { Transaction } from '@/types'
import DigitalReceipt from '@/components/receipts/DigitalReceipt'
import { Receipt, Calendar, IndianRupee, ArrowRight, Ticket } from 'lucide-react'

interface Props {
  onViewReceipt: (tx: Transaction) => void
  viewingReceipt: Transaction | null
  onBackFromReceipt: () => void
}

export default function ReceiptsPage({ onViewReceipt, viewingReceipt, onBackFromReceipt }: Props) {
  const { currentUser } = useApp()

  if (!currentUser) return null

  // Show individual receipt
  if (viewingReceipt) {
    return (
      <DigitalReceipt
        transaction={viewingReceipt}
        patientName={currentUser.profile.name || 'Patient'}
        patientPhone={currentUser.phone}
        onBack={onBackFromReceipt}
      />
    )
  }

  const txs = [...currentUser.transactions].reverse()

  return (
    <div className="max-w-2xl mx-auto pb-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-800">My Receipts</h2>
          <p className="text-sm text-slate-500 mt-0.5">All past payments &amp; transaction history.</p>
        </div>
        {txs.length > 0 && (
          <span className="text-xs bg-sky-100 text-sky-700 font-semibold px-2.5 py-1 rounded-full">
            {txs.length} receipt{txs.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {txs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
          <Receipt className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-500 font-semibold">No receipts yet</p>
          <p className="text-sm text-slate-300 mt-1">
            Complete a payment to see your receipts here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {txs.map(tx => {
            const date = new Date(tx.date)
            return (
              <button
                key={tx.id}
                onClick={() => onViewReceipt(tx)}
                className="w-full bg-white rounded-2xl border border-slate-100 p-5 text-left hover:border-sky-300 hover:shadow-md active:scale-[0.99] transition-all shadow-sm group"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0 group-hover:bg-sky-100 transition-colors">
                    <Receipt className="w-5 h-5 text-sky-600" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-mono text-slate-400">{tx.receiptNumber}</p>
                        <p className="text-sm font-bold text-slate-700 mt-0.5">
                          {tx.type === 'appointment' ? '👨‍⚕️ Doctor Appointment' : '🧪 Lab Tests / Checkup'}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-sky-500 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                    </div>

                    <p className="text-xs text-slate-400 mt-1 truncate">
                      {tx.items.map(i => i.name).join(' · ')}
                    </p>

                    {/* Meta row */}
                    <div className="flex items-center gap-3 flex-wrap mt-2.5">
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Calendar className="w-3 h-3" />
                        {date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-bold text-sky-700">
                        <IndianRupee className="w-3 h-3" />
                        ₹{tx.total.toLocaleString('en-IN')}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                        tx.paymentMethod === 'UPI'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {tx.paymentMethod}
                      </span>
                    </div>

                    {/* Queue token */}
                    <div className="flex items-center gap-1.5 mt-2">
                      <Ticket className="w-3 h-3 text-emerald-500 shrink-0" />
                      <p className="text-xs text-emerald-600 font-semibold truncate">{tx.queueToken}</p>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
