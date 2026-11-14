import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MediPay – Smart Hospital Payments',
  description: 'Book doctors, pay for lab tests, and get instant digital receipts.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-800 antialiased">{children}</body>
    </html>
  )
}
