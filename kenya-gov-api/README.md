# Kenya Government API Integration

A TypeScript framework for integrating with Kenya's government APIs, including eCitizen and eTIMS payment services.

## Features

- eCitizen payment processing
- eTIMS invoice payment processing
- Secure API key authentication
- Comprehensive error handling
- TypeScript support

## Installation

```bash
npm install kenya-gov-api
```

## Configuration

Create a `.env` file in your project root with the following variables:

```env
PORT=3000
API_KEY=your_api_key_here
ECITIZEN_API_URL=https://api.ecitizen.go.ke
ECITIZEN_USERNAME=your_username
ECITIZEN_PASSWORD=your_password
```

## API Usage

### Initiate a Payment

```typescript
// Example using fetch
const response = await fetch('http://localhost:3000/api/v1/payments/initiate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'your_api_key_here'
  },
  body: JSON.stringify({
    serviceId: 'SERVICE_ID',
    amount: 1000,
    currency: 'KES',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '+254712345678',
    description: 'Payment for service',
    referenceNumber: 'REF123456'
  })
});

const result = await response.json();
```

### Process eTIMS Invoice Payment

```typescript
// Example using fetch
const response = await fetch('http://localhost:3000/api/v1/payments/etims', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'your_api_key_here'
  },
  body: JSON.stringify({
    tin: 'TIN123456',
    invoiceNumber: 'INV123456',
    invoiceDate: '2024-01-01',
    customerName: 'John Doe',
    customerTin: 'CUST123456',
    items: [
      {
        description: 'Item 1',
        quantity: 1,
        unitPrice: 1000,
        taxRate: 16,
        totalAmount: 1160
      }
    ],
    totalAmount: 1160,
    taxAmount: 160,
    currency: 'KES'
  })
});

const result = await response.json();
```

### Check Payment Status

```typescript
// Example using fetch
const response = await fetch('http://localhost:3000/api/v1/payments/status/REF123456', {
  headers: {
    'x-api-key': 'your_api_key_here'
  }
});

const result = await response.json();
```

## Response Format

All API responses follow this format:

```typescript
{
  success: boolean;
  data?: any;
  error?: string;
  code?: string;
  details?: any;
}
```

## Error Handling

The API uses standard HTTP status codes:

- 200: Success
- 400: Bad Request (validation errors)
- 401: Unauthorized (invalid API key)
- 500: Internal Server Error

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Build for production: `npm run build`
5. Start production server: `npm start`

## Testing

```bash
npm test
```

## License

ISC 