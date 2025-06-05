import express, { Request, Response } from 'express';

const router = express.Router();

// Middleware to validate API key
const validateApiKey = (req: Request, res: Response, next: Function) => {
  const apiKey = req.headers['x-api-key'];
  const validApiKey = process.env.API_KEY || 'test_api_key_123';
  if (!apiKey || apiKey !== validApiKey) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or missing API key'
    });
  }
  next();
};

// Apply API key validation to all routes
router.use(validateApiKey);

// Get all available services
router.get('/', async (req: Request, res: Response) => {
  try {
    // Mock data for demonstration
    const services = [
      {
        id: 'PASSPORT',
        name: 'Passport Application',
        description: 'Apply for a new passport or renew an existing one',
        category: 'Travel Documents',
        status: 'active'
      },
      {
        id: 'ID_CARD',
        name: 'National ID Card',
        description: 'Apply for a new National ID card or replace a lost one',
        category: 'Identity Documents',
        status: 'active'
      },
      {
        id: 'DRIVERS_LICENSE',
        name: 'Driver\'s License',
        description: 'Apply for a new driver\'s license or renew an existing one',
        category: 'Transportation',
        status: 'active'
      },
      {
        id: 'BUSINESS_REG',
        name: 'Business Registration',
        description: 'Register a new business or update existing registration',
        category: 'Business',
        status: 'active'
      },
      {
        id: 'TAX_PAYMENT',
        name: 'Tax Payment',
        description: 'Pay various government taxes and fees',
        category: 'Finance',
        status: 'active'
      }
    ];

    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router; 