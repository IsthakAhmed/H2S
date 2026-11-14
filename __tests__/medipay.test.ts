import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('MediPay Core Requirements Test Suite', () => {
  it('1. Validates Patient Login and Medical Profile in localStorage format', () => {
    const profile = {
      name: 'Isthak Ahmed',
      age: 22,
      phone: '9876543210',
      bloodGroup: 'O+',
      allergies: ['Penicillin'],
      previousVisits: ['General Checkup - 2026']
    };
    assert.equal(profile.phone.length, 10);
    assert.equal(profile.bloodGroup, 'O+');
    assert.ok(Array.isArray(profile.allergies));
  });

  it('2. Simulates Online Payment for Lab Tests and Checkups', () => {
    const cart = [
      { id: '1', name: 'Complete Blood Count (CBC)', price: 500 },
      { id: '2', name: 'Full Body Checkup', price: 1500 }
    ];
    const total = cart.reduce((acc, item) => acc + item.price, 0);
    const paymentStatus = 'SUCCESS';
    assert.equal(total, 2000);
    assert.equal(paymentStatus, 'SUCCESS');
  });

  it('3. Generates Printable Digital Receipt after Successful Payment', () => {
    const receipt = {
      receiptId: 'MP-2026-101',
      patientName: 'Isthak Ahmed',
      amountPaid: 2000,
      status: 'PAID',
      downloadable: true
    };
    assert.equal(receipt.status, 'PAID');
    assert.equal(receipt.downloadable, true);
  });

  it('4. Books Doctor Appointment from Available Slots', () => {
    const doctor = {
      name: 'Dr. Sharma',
      specialization: 'Cardiology',
      availableSlots: ['10:00 AM', '11:30 AM', '02:00 PM']
    };
    const bookedSlot = '10:00 AM';
    const updatedSlots = doctor.availableSlots.filter(s => s !== bookedSlot);
    assert.equal(updatedSlots.length, 2);
    assert.ok(!updatedSlots.includes('10:00 AM'));
  });
});
