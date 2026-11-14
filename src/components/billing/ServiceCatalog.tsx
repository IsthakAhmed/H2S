'use client'
import { useState } from 'react'
import { SEED_SERVICES } from '@/data/seed'
import { Service, CartItem, Transaction } from '@/types'
import { Plus, Minus, ShoppingCart, Trash2, FlaskConical, Heart, Scan, Stethoscope, X, ChevronRight } from 'lucide-react'
import PaymentGateway from '@/components/billing/PaymentGateway'
import { useApp } from '@/context/AppContext'

const CAT_ICONS: Record<string, React.ElementType> = {
  'Lab Test': FlaskConical,
  Checkup:   Stethoscope,
  Imaging:   Scan,
  Cardiac:   Heart,
}
const CAT_COLORS: Record<string, string> = {
  'Lab Test': 'bg-blue-100 text-blue-700 border-blue-200',
  Checkup:   'bg-emerald-100 text-emerald-700 border-emerald-200',
  Imaging:   'bg-purple-100 text-purple-700 border-purple-200',
  Cardiac:   'bg-red-100 text-red-700 border-red-200',
}

function genReceiptNo() { return 'RCP' + Date.now().toString().slice(-8) }
function genToken() {
  const zones = ['LAB', 'IMG', 'SCAN']
  return `Token #${zones[Math.floor(Math.random() * zones.length)]}-${String(Math.floor(Math.random() * 50) + 1).padStart(2, '0')}`
}

export default function ServiceCatalog({ onViewReceipt }: { onViewReceipt: (tx: Transaction) => void }) {
  const { addTransaction } = useApp()
  const [cart, setCart]           = useState<CartItem[]>([])
  const [showCart, setShowCart]   = useState(false)
  const [showPayment, setShowPayment] = useState(false)

  const addToCart = (svc: Service) => setCart(c => {
    const hit = c.find(i => i.service.id === svc.id)
    return hit ? c.map(i => i.service.id === svc.id ? { ...i, quantity: i.quantity + 1 } : i)
                : [...c, { service: svc, quantity: 1 }]
  })

  const removeFromCart = (id: string) => setCart(c => c.filter(i => i.service.id !== id))
  const decrement      = (id: string) => setCart(c =>
    c.map(i => i.service.id === id ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0)
  )

  const total     = cart.reduce((s, i) => s + i.service.price * i.quantity, 0)
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0)

  const handlePaymentSuccess = (method: string) => {
    const tx: Transaction = {
      id: 'tx_' + Date.now(),
      receiptNumber: genReceiptNo(),
      date: new Date().toISOString(),
      items: cart.map(i => ({ name: i.service.name, price: i.service.price, quantity: i.quantity })),
      total,
      paymentMethod: method as 'UPI' | 'Card' | 'Cash',
      queueToken: genToken(),
      type: 'services',
    }
    addTransaction(tx)
    setCart([])
    setShowPayment(false)
    setShowCart(false)
    onViewReceipt(tx)
  }

  return (
    <div className="max-w-2xl mx-auto pb-2">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Lab Tests &amp; Checkups</h2>
          <p className="text-sm text-slate-500 mt-0.5">Add to cart and pay securely online.</p>
        </div>
        {/* Cart FAB */}
        <button
          onClick={() => setShowCart(true)}
          className="relative flex items-center gap-2 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm"
        >
          <ShoppingCart className="w-4 h-4" />
          <span className="hidden sm:inline">Cart</span>
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold ring-2 ring-white">
              {itemCount}
            </span>
          )}
        </button>
      </div>

      {/* Service list */}
      <div className="space-y-3">
        {SEED_SERVICES.map(svc => {
          const Icon    = CAT_ICONS[svc.category] || FlaskConical
          const inCart  = cart.find(i => i.service.id === svc.id)
          const color   = CAT_COLORS[svc.category] || 'bg-slate-100 text-slate-600 border-slate-200'

          return (
            <div key={svc.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-5 flex items-center gap-4 hover:border-slate-200 transition-colors">
              <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-slate-500" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-slate-800 leading-snug">{svc.name}</h3>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${color}`}>
                    {svc.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">{svc.description}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-sm font-bold text-sky-700">₹{svc.price.toLocaleString('en-IN')}</span>
                  <span className="text-xs text-slate-400 border-l border-slate-200 pl-3">Report in {svc.duration}</span>
                </div>
              </div>

              {/* Quantity control */}
              <div className="shrink-0">
                {inCart ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => decrement(svc.id)}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 active:scale-90 flex items-center justify-center transition-all"
                    >
                      <Minus className="w-3 h-3 text-slate-600" />
                    </button>
                    <span className="text-sm font-bold w-5 text-center text-slate-800">{inCart.quantity}</span>
                    <button
                      onClick={() => addToCart(svc)}
                      className="w-7 h-7 rounded-lg bg-sky-600 hover:bg-sky-700 active:scale-90 text-white flex items-center justify-center transition-all"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(svc)}
                    className="bg-sky-600 hover:bg-sky-700 active:scale-90 text-white p-2.5 rounded-xl transition-all shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Sticky bottom bar when cart has items */}
      {itemCount > 0 && !showCart && (
        <div className="fixed bottom-16 inset-x-0 px-4 z-20 max-w-2xl mx-auto">
          <button
            onClick={() => setShowCart(true)}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-4 rounded-2xl shadow-xl flex items-center justify-between px-5 transition-colors"
          >
            <span className="bg-sky-500 text-white text-xs font-bold w-6 h-6 rounded-lg flex items-center justify-center">
              {itemCount}
            </span>
            <span>View Cart</span>
            <span className="font-bold">₹{total.toLocaleString('en-IN')}</span>
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      {showCart && (
        <div
          className="fixed inset-0 bg-black/40 z-40 flex items-end sm:items-center justify-center"
          onClick={() => setShowCart(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-sky-600" />
                Your Cart
              </h3>
              <button
                onClick={() => setShowCart(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-10">
                <ShoppingCart className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                <p className="text-slate-400 font-medium">Your cart is empty</p>
                <p className="text-xs text-slate-300 mt-1">Add services from the catalog</p>
              </div>
            ) : (
              <>
                <div className="space-y-2.5 mb-5">
                  {cart.map(item => (
                    <div key={item.service.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-700 truncate">{item.service.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          ₹{item.service.price.toLocaleString('en-IN')} × {item.quantity} =&nbsp;
                          <strong className="text-slate-600">₹{(item.service.price * item.quantity).toLocaleString('en-IN')}</strong>
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button onClick={() => decrement(item.service.id)} className="w-6 h-6 rounded bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => addToCart(item.service)} className="w-6 h-6 rounded bg-sky-100 hover:bg-sky-200 flex items-center justify-center transition-colors">
                          <Plus className="w-3 h-3 text-sky-700" />
                        </button>
                        <button onClick={() => removeFromCart(item.service.id)} className="ml-1 p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t border-slate-200 pt-4 pb-3 flex justify-between items-center">
                  <span className="font-bold text-slate-800">Total</span>
                  <span className="font-bold text-sky-700 text-xl">₹{total.toLocaleString('en-IN')}</span>
                </div>

                <button
                  onClick={() => setShowPayment(true)}
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  Proceed to Pay ₹{total.toLocaleString('en-IN')}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {showPayment && (
        <PaymentGateway
          total={total}
          description={`${itemCount} service${itemCount > 1 ? 's' : ''} from catalog`}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  )
}
