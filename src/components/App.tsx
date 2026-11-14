'use client'
import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { Transaction } from '@/types'
import { Home, Stethoscope, FlaskConical, User, Receipt, LogOut, Hospital, Bell } from 'lucide-react'
import AuthScreen from '@/components/auth/AuthScreen'
import MedicalProfile from '@/components/profile/MedicalProfile'
import DoctorDirectory from '@/components/doctors/DoctorDirectory'
import ServiceCatalog from '@/components/billing/ServiceCatalog'
import ReceiptsPage from '@/components/receipts/ReceiptsPage'
import { AppProvider } from '@/context/AppContext'
import { NavTab, StoredUser } from '@/types'

// ─── Nav definition ──────────────────────────────────────────────────────────
const NAV_ITEMS: { tab: NavTab; label: string; icon: React.ElementType }[] = [
  { tab: 'home',     label: 'Home',     icon: Home },
  { tab: 'doctors',  label: 'Doctors',  icon: Stethoscope },
  { tab: 'services', label: 'Tests',    icon: FlaskConical },
  { tab: 'receipts', label: 'Receipts', icon: Receipt },
  { tab: 'profile',  label: 'Profile',  icon: User },
]

// ─── Inner shell (needs context) ─────────────────────────────────────────────
function AppInner() {
  const { currentUser, logout } = useApp()
  const [activeTab, setActiveTab]       = useState<NavTab>('home')
  const [pendingReceipt, setPending]    = useState<Transaction | null>(null)
  const [viewingReceipt, setViewing]    = useState<Transaction | null>(null)

  if (!currentUser) return <AuthScreen />

  const handleViewReceipt = (tx: Transaction) => {
    setPending(tx)
    setActiveTab('receipts')
  }

  const navigate = (tab: NavTab) => {
    setActiveTab(tab)
    if (tab !== 'receipts') { setPending(null); setViewing(null) }
  }

  const displayReceipt = pendingReceipt ?? viewingReceipt

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ── Top bar ── */}
      <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Hospital className="w-5 h-5 text-sky-600" />
            <span className="font-bold text-blue-900 text-lg tracking-tight">MediPay</span>
          </div>

          {/* Active tab label — desktop breadcrumb feel */}
          <span className="hidden sm:inline text-slate-300 text-sm">|</span>
          <span className="hidden sm:inline text-sm text-slate-500 font-medium capitalize">
            {activeTab}
          </span>

          <div className="ml-auto flex items-center gap-1">
            {/* Notification dot for new receipt */}
            {pendingReceipt && (
              <button
                onClick={() => navigate('receipts')}
                className="relative p-2 text-sky-600 hover:bg-sky-50 rounded-xl transition-colors"
                title="View new receipt"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            )}

            <div className="text-sm text-slate-500 font-medium max-w-[120px] truncate px-2">
              {currentUser.profile.name || currentUser.phone}
            </div>

            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 pt-6 pb-28">
        {activeTab === 'home'     && <HomePage setTab={navigate} user={currentUser} />}
        {activeTab === 'doctors'  && <DoctorDirectory onViewReceipt={handleViewReceipt} />}
        {activeTab === 'services' && <ServiceCatalog onViewReceipt={handleViewReceipt} />}
        {activeTab === 'receipts' && (
          <ReceiptsPage
            onViewReceipt={tx => { setViewing(tx); setPending(null) }}
            viewingReceipt={displayReceipt}
            onBackFromReceipt={() => { setViewing(null); setPending(null) }}
          />
        )}
        {activeTab === 'profile' && <MedicalProfile />}
      </main>

      {/* ── Bottom nav ── */}
      <nav className="no-print fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-30 safe-area-pb">
        <div className="max-w-2xl mx-auto flex">
          {NAV_ITEMS.map(({ tab, label, icon: Icon }) => {
            const active = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => navigate(tab)}
                className={`relative flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors ${
                  active ? 'text-sky-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {/* Active pill indicator */}
                {active && <span className="tab-indicator" />}

                <span className={`p-1 rounded-lg transition-colors ${active ? 'bg-sky-50' : ''}`}>
                  <Icon className="w-5 h-5" />
                </span>
                <span className={`text-[10px] font-semibold ${active ? 'text-sky-600' : 'text-slate-400'}`}>
                  {label}
                </span>

                {/* Unread badge */}
                {tab === 'receipts' && pendingReceipt && (
                  <span className="absolute top-2 right-[22%] w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                )}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

// ─── Home page ───────────────────────────────────────────────────────────────
function HomePage({ setTab, user }: { setTab: (t: NavTab) => void; user: StoredUser }) {
  const totalSpent  = user.transactions.reduce((s, t) => s + t.total, 0)
  const bookedAppts = user.appointments.filter(a => a.status === 'paid').length
  const receipts    = user.transactions.length
  const firstName   = user.profile.name ? user.profile.name.split(' ')[0] : 'Patient'

  return (
    <div className="space-y-5 pb-2">
      {/* Welcome hero */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-sky-600 rounded-2xl p-6 text-white relative overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/5 rounded-full" />
        <div className="absolute -bottom-8 -right-2 w-24 h-24 bg-white/5 rounded-full" />
        <p className="text-sky-300 text-sm font-medium">Good {getGreeting()},</p>
        <h2 className="text-2xl font-bold mt-0.5">{firstName} 👋</h2>
        <p className="text-sky-200 text-xs mt-2 max-w-[200px]">Your health journey, all in one place.</p>
        {user.profile.bloodGroup && (
          <span className="inline-block mt-3 bg-red-500/80 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {user.profile.bloodGroup}
          </span>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Appointments" value={String(bookedAppts)} color="text-sky-700" />
        <StatCard label="Receipts" value={String(receipts)} color="text-purple-700" />
        <StatCard label="Total Paid" value={`₹${formatINR(totalSpent)}`} color="text-emerald-600" small />
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide mb-3">Quick Actions</h3>
        <div className="space-y-3">
          <QuickCard
            emoji="👨‍⚕️"
            title="Book a Doctor"
            desc="Browse 6 specialists & book an appointment"
            color="from-sky-50 to-blue-50 border-sky-200"
            badge="6 available"
            onClick={() => setTab('doctors')}
          />
          <QuickCard
            emoji="🧪"
            title="Lab Tests & Checkups"
            desc="CBC, MRI, ECG, Full Body Checkup & more"
            color="from-emerald-50 to-teal-50 border-emerald-200"
            badge="6 services"
            onClick={() => setTab('services')}
          />
          <QuickCard
            emoji="🧾"
            title="My Receipts"
            desc="View & print your payment receipts"
            color="from-purple-50 to-violet-50 border-purple-200"
            badge={receipts > 0 ? `${receipts} receipt${receipts > 1 ? 's' : ''}` : undefined}
            onClick={() => setTab('receipts')}
          />
          <QuickCard
            emoji="👤"
            title="Medical Profile"
            desc="Update your health info & allergies"
            color="from-orange-50 to-amber-50 border-orange-200"
            onClick={() => setTab('profile')}
          />
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color, small }: { label: string; value: string; color: string; small?: boolean }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-3 shadow-sm text-center">
      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">{label}</p>
      <p className={`font-bold mt-1 ${color} ${small ? 'text-sm' : 'text-2xl'}`}>{value}</p>
    </div>
  )
}

function QuickCard({ emoji, title, desc, color, badge, onClick }: {
  emoji: string; title: string; desc: string; color: string; badge?: string; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-gradient-to-r border rounded-2xl p-4 flex items-center gap-4 hover:shadow-md active:scale-[0.99] transition-all ${color}`}
    >
      <span className="text-2xl shrink-0">{emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-slate-800 text-sm">{title}</p>
          {badge && (
            <span className="text-[10px] font-bold bg-white/70 text-slate-600 px-1.5 py-0.5 rounded-full border border-slate-200">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-0.5 truncate">{desc}</p>
      </div>
      <span className="text-slate-300 shrink-0">›</span>
    </button>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

function formatINR(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n.toLocaleString('en-IN')
}

// ─── Root export ─────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}
