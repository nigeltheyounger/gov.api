import { EcitizenPayment } from '../interfaces/ecitizen';
import { EtimsInvoice } from '../interfaces/etims';
import EcitizenApiClient from '../clients/ecitizen';
import { ApiConfig } from '../interfaces/config';

// Initialize the Ecitizen API client
const ecitizenClient = new EcitizenApiClient({
  baseUrl: process.env.ECITIZEN_API_URL || 'https://api.ecitizen.go.ke',
  username: process.env.ECITIZEN_USERNAME,
  password: process.env.ECITIZEN_PASSWORD,
  timeout: 30000
});

// Custom error class for payment-related errors
export class PaymentError extends Error {
  constructor(message: string, public code: string, public details?: any) {
    super(message);
    this.name = 'PaymentError';
  }
}

// Function to validate payment data
export function validatePaymentData(paymentData: EcitizenPayment): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!paymentData.serviceId) {
    errors.push('Service ID is required');
  }

  if (!paymentData.amount || paymentData.amount <= 0) {
    errors.push('Valid amount is required');
  }

  if (!paymentData.currency) {
    errors.push('Currency is required');
  }

  if (!paymentData.customerName) {
    errors.push('Customer name is required');
  }

  if (!paymentData.customerEmail) {
    errors.push('Customer email is required');
  } else if (!isValidEmail(paymentData.customerEmail)) {
    errors.push('Invalid email format');
  }

  if (!paymentData.customerPhone) {
    errors.push('Customer phone is required');
  } else if (!isValidPhone(paymentData.customerPhone)) {
    errors.push('Invalid phone number format');
  }

  if (!paymentData.referenceNumber) {
    errors.push('Reference number is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Function to initiate a payment
export async function initiatePayment(paymentData: EcitizenPayment): Promise<any> {
  try {
    // Validate payment data
    const validation = validatePaymentData(paymentData);
    if (!validation.isValid) {
      throw new PaymentError('Invalid payment data', 'VALIDATION_ERROR', validation.errors);
    }

    // Check if service is available
    const services = await ecitizenClient.getAvailableServices();
    const serviceExists = services.some((service: any) => service.id === paymentData.serviceId);
    
    if (!serviceExists) {
      throw new PaymentError('Service not found', 'SERVICE_NOT_FOUND');
    }

    // Initiate payment through eCitizen API
    const response = await ecitizenClient.initiatePayment(paymentData);
    
    // Handle the payment response
    return handlePaymentResponse(response);
  } catch (error) {
    if (error instanceof PaymentError) {
      throw error;
    }
    throw new PaymentError(
      'Failed to initiate payment',
      'PAYMENT_INITIATION_FAILED',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

// Function to handle payment response
export function handlePaymentResponse(response: any): any {
  if (!response) {
    throw new PaymentError('Empty payment response', 'INVALID_RESPONSE');
  }

  // Check payment status
  if (response.status === 'SUCCESS') {
    return {
      success: true,
      transactionId: response.transactionId,
      paymentUrl: response.paymentUrl,
      message: 'Payment initiated successfully'
    };
  } else if (response.status === 'FAILED') {
    throw new PaymentError(
      response.message || 'Payment initiation failed',
      'PAYMENT_FAILED',
      response.details
    );
  } else {
    throw new PaymentError(
      'Unknown payment status',
      'UNKNOWN_STATUS',
      response
    );
  }
}

// Function to process eTIMS invoice payment
export async function processEtimsInvoicePayment(invoiceData: EtimsInvoice): Promise<any> {
  try {
    // Validate invoice data
    if (!invoiceData.tin || !invoiceData.invoiceNumber || !invoiceData.items.length) {
      throw new PaymentError('Invalid invoice data', 'INVALID_INVOICE');
    }

    // Convert eTIMS invoice to eCitizen payment format
    const paymentData: EcitizenPayment = {
      serviceId: 'ETIMS_PAYMENT',
      amount: invoiceData.totalAmount,
      currency: invoiceData.currency,
      customerName: invoiceData.customerName,
      customerEmail: '', // This would need to be provided separately
      customerPhone: '', // This would need to be provided separately
      description: `Payment for eTIMS Invoice ${invoiceData.invoiceNumber}`,
      referenceNumber: invoiceData.invoiceNumber
    };

    // Process the payment
    return await initiatePayment(paymentData);
  } catch (error) {
    if (error instanceof PaymentError) {
      throw error;
    }
    throw new PaymentError(
      'Failed to process eTIMS invoice payment',
      'ETIMS_PAYMENT_FAILED',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

// Helper function to validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper function to validate phone number format (Kenya format)
function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(?:\+254|0)[17]\d{8}$/;
  return phoneRegex.test(phone);
}