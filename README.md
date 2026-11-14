# 🏥 MediPay — Smart Hospital Payments

A production-ready hospital web application built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**. MediPay lets patients register, book doctor appointments, pay for lab tests, and get instant digital receipts — all in a lightweight, mobile-first SPA.

---

## ✨ Features

| Feature | Details |
|---------|---------|
| **Patient Auth** | Phone + password login/register with one-click demo account |
| **Medical Profile** | Editable name, age, blood group, allergies (tag system), visit history |
| **Doctor Booking** | 6 specialists across 6 departments, slot selection, real-time availability |
| **Lab Tests & Checkups** | 6 services (CBC, MRI, ECG, X-Ray, Full Body, Lipid Profile) with cart |
| **Mock Payments** | Simulated UPI & Card flows with 1.5s processing state |
| **Digital Receipts** | Auto-generated after payment with itemized breakdown + queue bypass token |
| **PDF / Print** | Native `window.print()` with `@media print` CSS — zero extra bundle cost |
| **localStorage** | All data persisted locally; SSR-safe hydration with `useEffect` guard |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18 (v22 recommended)
- **npm** ≥ 10

### Installation

```bash
# 1. Clone or open the workspace
cd USTM_Hackathon

# 2. Install dependencies (Windows — use node bridge if npm.ps1 is blocked)
node -e "const {execSync}=require('child_process'); console.log(execSync('npm install', {stdio:'pipe'}).toString())"

# 3. Start the development server
node node_modules/next/dist/bin/next dev --port 3000
```

Then open **http://localhost:3000** in your browser.

### Quick Test (Demo Login)

Click **"One-Click Demo Patient Login"** on the auth screen — it loads a pre-built patient profile with:
- Name: Arjun Demo Kumar | Blood Group: O+ | Allergies: Penicillin, Pollen, Shellfish
- 2 previous visit records

---

## 🗂 Project Structure

```
src/
├── app/
│   ├── globals.css        # Tailwind base + @media print rules
│   ├── layout.tsx         # Root layout & metadata
│   └── page.tsx           # SSR-disabled entry (dynamic import)
├── components/
│   ├── App.tsx            # App shell, bottom nav, home page
│   ├── auth/
│   │   └── AuthScreen.tsx          # Login / Register / Demo
│   ├── billing/
│   │   ├── PaymentGateway.tsx      # UPI & Card payment modal
│   │   └── ServiceCatalog.tsx      # Lab tests catalog + cart
│   ├── doctors/
│   │   └── DoctorDirectory.tsx     # 6 doctors with slot booking
│   ├── profile/
│   │   └── MedicalProfile.tsx      # Editable profile + visit history
│   └── receipts/
│       ├── DigitalReceipt.tsx      # Printable receipt component
│       └── ReceiptsPage.tsx        # Receipt list + detail view
├── context/
│   └── AppContext.tsx     # SSR-safe localStorage state management
├── data/
│   └── seed.ts            # Doctor, service & demo patient data
└── types/
    └── index.ts           # Shared TypeScript interfaces
```

---

## 🖨 PDF / Print Receipt

After any successful payment, a receipt is auto-displayed. Click **"Download PDF / Print Receipt"** — the browser's native print dialog opens. Select **"Save as PDF"** in the destination to download.

Navigation bars and UI chrome are automatically hidden during print via `@media print` CSS rules.

---

## 🔧 Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | Next.js 14 App Router | SSR + SPA patterns, file-based routing |
| Language | TypeScript | Full type safety |
| Styling | Tailwind CSS | Utility-first, no runtime CSS-in-JS |
| Icons | lucide-react | Tree-shakable, lightweight |
| Storage | localStorage | Zero backend, instant setup |
| PDF | `window.print()` | Zero bundle cost — no jspdf/html2canvas |

> **Bundle size:** ~105 npm packages, no heavy UI frameworks.

---

## 🏗 Build for Production

```bash
node node_modules/next/dist/bin/next build
node node_modules/next/dist/bin/next start
```

---

## 📋 User Journey

1. **Register** with phone + password → auto-logged in
2. **Update profile** (name, age, blood group, allergies)
3. **Browse doctors** → select specialization → pick a time slot
4. **Pay** via mock UPI or Card → 1.5s simulated processing
5. **Receipt generated** automatically with queue bypass token
6. **Print/download** as PDF via browser native print
7. **Browse lab tests** → add to cart → pay → new receipt

---

## 📄 License

MIT — built for USTM Hackathon 2026.
