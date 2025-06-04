import express, { Request, Response } from 'express';
import { initiatePayment, processEtimsInvoicePayment, PaymentError } from '../services/payment';
import { EcitizenPayment } from '../interfaces/ecitizen';
import { EtimsInvoice } from '../interfaces/etims';

const router = express.Router();

// Middleware to validate API key
const validateApiKey = (req: Request, res: Response, next: Function) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or missing API key'
    });
  }
  next();
};

// Apply API key validation to all routes
router.use(validateApiKey);

// Initiate a payment
router.post('/initiate', async (req: Request, res: Response) => {
  try {
    const paymentData: EcitizenPayment = req.body;
    const result = await initiatePayment(paymentData);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    if (error instanceof PaymentError) {
      res.status(400).json({
        success: false,
        error: error.message,
        code: error.code,
        details: error.details
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
});

// Process eTIMS invoice payment
router.post('/etims', async (req: Request, res: Response) => {
  try {
    const invoiceData: EtimsInvoice = req.body;
    const result = await processEtimsInvoicePayment(invoiceData);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    if (error instanceof PaymentError) {
      res.status(400).json({
        success: false,
        error: error.message,
        code: error.code,
        details: error.details
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
});

// Get payment status
router.get('/status/:referenceNumber', async (req: Request, res: Response) => {
  try {
    const { referenceNumber } = req.params;
    // TODO: Implement payment status check
    res.json({
      success: true,
      data: {
        referenceNumber,
        status: 'PENDING',
        message: 'Payment status check not implemented yet'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router; 