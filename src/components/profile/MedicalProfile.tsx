'use client'
import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { MedicalProfile as MedicalProfileType } from '@/types'
import {
  User, Droplets, AlertTriangle, Calendar, Edit3, Check, X, Plus,
  ChevronRight, Stethoscope, CheckCircle2,
} from 'lucide-react'

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export default function MedicalProfile() {
  const { currentUser, updateProfile } = useApp()
  const [editing, setEditing]       = useState(false)
  const [saved, setSaved]           = useState(false)
  const [form, setForm]             = useState<MedicalProfileType>(
    currentUser?.profile ?? { name: '', age: '', phone: '', bloodGroup: '', allergies: [] }
  )
  const [newAllergy, setNewAllergy] = useState('')

  if (!currentUser) return null
  const profile = currentUser.profile

  const startEdit = () => { setForm({ ...profile }); setEditing(true); setSaved(false) }

  const save = () => {
    updateProfile(form)
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const addAllergy = () => {
    const a = newAllergy.trim()
    if (a && !form.allergies.includes(a)) setForm(f => ({ ...f, allergies: [...f.allergies, a] }))
    setNewAllergy('')
  }

  const removeAllergy = (a: string) => setForm(f => ({ ...f, allergies: f.allergies.filter(x => x !== a) }))

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-2">
      {/* Hero card */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-sky-600 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/5 rounded-full" />
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold shrink-0 ring-2 ring-white/30">
            {profile.name ? profile.name[0].toUpperCase() : <User className="w-7 h-7" />}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold truncate">{profile.name || 'Complete Your Profile'}</h2>
            <p className="text-sky-200 text-sm">{profile.phone}</p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {profile.bloodGroup && (
                <span className="inline-flex items-center gap-1 bg-red-500/80 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  <Droplets className="w-3 h-3" /> {profile.bloodGroup}
                </span>
              )}
              {profile.age && (
                <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                  Age {profile.age}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={editing ? save : startEdit}
            className="bg-white/20 hover:bg-white/30 text-white p-2.5 rounded-xl transition-colors shrink-0"
            title={editing ? 'Save' : 'Edit profile'}
          >
            {editing ? <Check className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Save success toast */}
      {saved && (
        <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Profile saved successfully!
        </div>
      )}

      {/* Profile form / view */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-800">Personal Details</h3>
          {editing ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditing(false)}
                className="text-xs text-slate-500 hover:text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="text-xs text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg transition-colors font-semibold"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <button
              onClick={startEdit}
              className="text-xs text-sky-600 hover:text-sky-700 border border-sky-200 px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          )}
        </div>

        {editing ? (
          <div className="space-y-4">
            <Field label="Full Name">
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="input"
                placeholder="Your full name"
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Age">
                <input
                  type="number" min="0" max="150"
                  value={form.age}
                  onChange={e => setForm(f => ({ ...f, age: parseInt(e.target.value) || '' }))}
                  className="input"
                  placeholder="Age"
                />
              </Field>
              <Field label="Blood Group">
                <select
                  value={form.bloodGroup}
                  onChange={e => setForm(f => ({ ...f, bloodGroup: e.target.value }))}
                  className="input bg-white"
                >
                  <option value="">Select</option>
                  {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Allergies">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {form.allergies.map(a => (
                    <span key={a} className="flex items-center gap-1 bg-orange-100 text-orange-700 text-xs font-medium px-2.5 py-1 rounded-full">
                      {a}
                      <button
                        onClick={() => removeAllergy(a)}
                        className="hover:text-red-500 transition-colors"
                        type="button"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {form.allergies.length === 0 && (
                    <span className="text-xs text-slate-400 italic">No allergies added</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    value={newAllergy}
                    onChange={e => setNewAllergy(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                    placeholder="Type allergy and press Enter"
                    className="input flex-1"
                  />
                  <button
                    onClick={addAllergy}
                    type="button"
                    className="bg-sky-600 hover:bg-sky-700 text-white px-3 rounded-xl transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Field>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            <InfoRow icon={User} label="Full Name" value={profile.name} />
            <InfoRow icon={Calendar} label="Age" value={profile.age ? `${profile.age} years old` : ''} />
            <InfoRow icon={Droplets} label="Blood Group" value={profile.bloodGroup} />
            <div className="py-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                </div>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Allergies</span>
              </div>
              <div className="ml-10">
                {profile.allergies.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">No allergies recorded</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.allergies.map(a => (
                      <span key={a} className="bg-orange-100 text-orange-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                        {a}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Previous Visits */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800">Visit History</h3>
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {currentUser.visits.length} visit{currentUser.visits.length !== 1 ? 's' : ''}
          </span>
        </div>

        {currentUser.visits.length === 0 ? (
          <div className="text-center py-8">
            <Stethoscope className="w-10 h-10 text-slate-200 mx-auto mb-2" />
            <p className="text-sm text-slate-400">No previous visits recorded.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentUser.visits.map(v => (
              <div key={v.id} className="border border-slate-100 rounded-xl p-4 hover:border-sky-200 hover:bg-sky-50/30 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-700 truncate">{v.doctor}</p>
                    <p className="text-xs text-sky-600 font-medium mt-0.5">{v.reason}</p>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 shrink-0">
                    <Calendar className="w-3 h-3" />
                    <span className="text-xs">{v.date}</span>
                  </div>
                </div>
                {v.notes && (
                  <div className="mt-2 flex items-start gap-2">
                    <ChevronRight className="w-3 h-3 text-slate-300 mt-0.5 shrink-0" />
                    <p className="text-xs text-slate-500">{v.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">{label}</label>
      {children}
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-sky-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">{label}</p>
        {value
          ? <p className="text-sm font-semibold text-slate-700 mt-0.5">{value}</p>
          : <p className="text-sm text-slate-300 italic mt-0.5">Not set</p>
        }
      </div>
    </div>
  )
}
