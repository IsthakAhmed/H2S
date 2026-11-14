# MediPay — Hospital Online Payment, Appointment & Digital Receipt System

MediPay is a lightweight healthcare web application built with Next.js 14 (App Router), TypeScript, and Tailwind CSS (<10 MB repository). It allows patients to bypass hospital reception queues by paying for checkups and lab tests online, booking doctor slots, managing their medical profile, and downloading instant digital receipts.

## Core Features Implemented (Problem Statement Alignment)

1. **Online Payment for Checkups & Lab Tests:** Patients can select diagnostic lab tests and health checkups and pay online via a simulated UPI/Card payment system to avoid reception queues.
2. **Automatic Digital Receipt Generation:** Immediately after successful payment, an itemized digital receipt with a Queue Bypass Token is generated and can be downloaded as a PDF or printed using `@media print`.
3. **Patient Login & Registration System:** Patients can register a new account or log in using their phone number and password stored in `localStorage`.
4. **Basic Medical Profile Management:** Patients can save, view, and edit their Name, Age, Phone, Blood Group, Allergies, and Previous Visits in `localStorage`.
5. **Doctors Availability Directory:** Displays a list of hospital doctors with their specialization, consultation fees, and available time slots.
6. **Doctor Appointment Slot Booking:** Patients can book appointments directly from available doctor time slots, locking the slot in `localStorage`.

## Tech Stack & Requirements Met
- **Framework:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Storage:** Client-side `localStorage` for patient profiles, authentication, and bookings (no external database)
- **Lightweight:** Strict <10 MB repository footprint using native print APIs and `lucide-react`
- **UI/UX:** Clean, modern, mobile-friendly healthcare theme (blues and whites) with WCAG accessibility attributes
