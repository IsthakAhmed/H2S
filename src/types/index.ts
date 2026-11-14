// ─── Auth ───────────────────────────────────────────────────────────────────
export interface StoredUser {
  phone: string
  password: string
  profile: MedicalProfile
  visits: Visit[]
  appointments: Appointment[]
  transactions: Transaction[]
}

// ─── Profile ─────────────────────────────────────────────────────────────────
export interface MedicalProfile {
  name: string
  age: number | ''
  phone: string
  bloodGroup: string
  allergies: string[]
}

// ─── Visits ──────────────────────────────────────────────────────────────────
export interface Visit {
  id: string
  date: string
  doctor: string
  reason: string
  notes: string
}

// ─── Doctors ─────────────────────────────────────────────────────────────────
export type Specialization =
  | 'Cardiology'
  | 'General Medicine'
  | 'Orthopedics'
  | 'Pediatrics'
  | 'Dermatology'
  | 'Neurology'

export interface TimeSlot {
  id: string
  time: string
  available: boolean
}

export interface Doctor {
  id: string
  name: string
  specialization: Specialization
  qualifications: string
  experience: number
  fee: number
  room: string
  slots: TimeSlot[]
  avatar: string
}

// ─── Appointments ─────────────────────────────────────────────────────────────
export interface Appointment {
  id: string
  doctorId: string
  doctorName: string
  specialization: string
  date: string
  slot: string
  room: string
  fee: number
  status: 'pending' | 'paid'
  transactionId?: string
}

// ─── Services / Lab Tests ─────────────────────────────────────────────────────
export type ServiceCategory = 'Lab Test' | 'Checkup' | 'Imaging' | 'Cardiac'

export interface Service {
  id: string
  name: string
  category: ServiceCategory
  price: number
  duration: string
  description: string
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
export interface CartItem {
  service: Service
  quantity: number
}

// ─── Payments ─────────────────────────────────────────────────────────────────
export type PaymentMethod = 'UPI' | 'Card' | 'Cash'
export type PaymentStatus = 'pending' | 'processing' | 'success' | 'failed'

export interface Transaction {
  id: string
  receiptNumber: string
  date: string
  items: ReceiptItem[]
  total: number
  paymentMethod: PaymentMethod
  queueToken: string
  type: 'appointment' | 'services'
  appointmentId?: string
}

export interface ReceiptItem {
  name: string
  price: number
  quantity: number
}

// ─── Navigation ───────────────────────────────────────────────────────────────
export type NavTab = 'home' | 'doctors' | 'services' | 'profile' | 'receipts'
