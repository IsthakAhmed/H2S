'use client'
import { Transaction } from '@/types'
import { Printer, ArrowLeft, CheckCircle2, Ticket, Download, MapPin, Phone } from 'lucide-react'

interface Props {
  transaction: Transaction
  patientName: string
  patientPhone: string
  onBack: () => void
}

export default function DigitalReceipt({ transaction: tx, patientName, patientPhone, onBack }: Props) {
  const handlePrint = () => window.print()

  const date          = new Date(tx.date)
  const formattedDate = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
  const formattedTime = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })

  return (
    <>
      {/* ── Action bar (hidden when printing) ── */}
      <div className="max-w-2xl mx-auto mb-4 flex items-center gap-3 no-print">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 font-medium px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Receipts
        </button>
        <div className="flex-1" />
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Download PDF /</span>
          <Printer className="w-4 h-4" />
          Print
        </button>
      </div>

      {/* ── Receipt card (this portion prints) ── */}
      <div id="print-root" className="max-w-2xl mx-auto pb-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden print-page">

          {/* Hospital header */}
          <div className="bg-gradient-to-r from-blue-900 to-sky-700 p-6 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">🏥</span>
                  <h1 className="text-xl font-bold tracking-tight">MediPay Hospital</h1>
                </div>
                <p className="text-sky-300 text-xs flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" /> 42, Health Avenue, MediCity – 400001
                </p>
                <p className="text-sky-300 text-xs flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3" /> 1800-MEDI-PAY &nbsp;·&nbsp; www.medipay.in
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-sky-300 font-medium uppercase tracking-wide">Receipt No.</p>
                <p className="text-lg font-bold font-mono">{tx.receiptNumber}</p>
                <p className="text-xs text-sky-300 mt-1">{formattedDate}</p>
              </div>
            </div>
          </div>

          {/* Queue bypass token — prominent green banner */}
          <div className="bg-emerald-50 border-b-2 border-emerald-200 px-6 py-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
              <Ticket className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mb-0.5">Queue Bypass Token</p>
              <p className="text-emerald-800 font-bold text-sm leading-snug">{tx.queueToken}</p>
              <p className="text-xs text-emerald-600 mt-0.5">Skip the reception desk — proceed directly to the designated counter.</p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Status & timestamp */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-700 font-bold text-sm">Payment Confirmed</span>
              </div>
              <span className="text-xs text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">
                {formattedDate} at {formattedTime}
              </span>
            </div>

            {/* Patient info grid */}
            <div className="grid grid-cols-2 gap-3">
              <InfoCell label="Patient Name" value={patientName || 'N/A'} />
              <InfoCell label="Phone Number" value={patientPhone} />
              <InfoCell label="Payment Method" value={tx.paymentMethod} />
              <InfoCell label="Transaction ID" value={tx.id} mono />
            </div>

            {/* Itemized bill */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Itemized Bill</h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Description</th>
                      <th className="text-center px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-12">Qty</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tx.items.map((item, i) => (
                      <tr key={i}>
                        <td className="px-4 py-3 text-slate-700 font-medium">{item.name}</td>
                        <td className="px-3 py-3 text-center text-slate-500">{item.quantity}</td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-700">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gradient-to-r from-sky-50 to-blue-50 border-t-2 border-sky-200">
                      <td colSpan={2} className="px-4 py-3.5 font-bold text-slate-800 text-sm">
                        Total Amount Paid
                      </td>
                      <td className="px-4 py-3.5 text-right font-bold text-sky-700 text-lg">
                        ₹{tx.total.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 pt-5 text-center space-y-1">
              <p className="text-xs text-slate-400 font-medium">
                Thank you for choosing MediPay Hospital. Wishing you good health! 🌿
              </p>
              <p className="text-xs text-slate-300">
                Computer-generated receipt — no signature required.
              </p>
              <p className="text-xs text-slate-300">
                Queries: billing@medipay.in · 1800-MEDI-PAY
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function InfoCell({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="bg-slate-50 rounded-xl p-3">
      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-sm font-semibold text-slate-700 break-all ${mono ? 'font-mono text-xs' : ''}`}>{value}</p>
    </div>
  )
}
