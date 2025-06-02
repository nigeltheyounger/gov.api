import { initiatePayment } from '../../../src/services/payment';
import { EcitizenPayment } from '../../../src/interfaces/ecitizen';

describe('Payment Service', () => {
  it('should initiate a payment successfully', async () => {
    const paymentData: EcitizenPayment = {
      serviceId: 'PASSPORT_RENEWAL',
      amount: 4550,
      currency: 'KES',
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      customerPhone: '+254712345678',
      description: 'Passport renewal fee',
      referenceNumber: 'REF-2025-001',
    };

    const response = await initiatePayment(paymentData);
    expect(response).toHaveProperty('status', 'success');
    expect(response).toHaveProperty('data');
  });

  it('should throw an error for invalid payment data', async () => {
    const invalidPaymentData: EcitizenPayment = {
      serviceId: '',
      amount: -100,
      currency: 'KES',
      customerName: '',
      customerEmail: 'invalid-email',
      customerPhone: 'not-a-phone-number',
      description: 'Invalid payment',
      referenceNumber: '',
    };

    await expect(initiatePayment(invalidPaymentData)).rejects.toThrow('Invalid payment data');
  });
});