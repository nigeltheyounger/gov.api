import { EtimsApiClient } from '../../../src/clients/etims';
import { ApiConfig, EtimsInvoice } from '../../../src/interfaces/etims';

describe('EtimsApiClient', () => {
  let client: EtimsApiClient;
  const config: ApiConfig = {
    baseUrl: 'https://developer.go.ke/apis/eTims',
    apiKey: 'test-api-key',
    timeout: 30000,
  };

  beforeEach(() => {
    client = new EtimsApiClient(config);
  });

  it('should get taxpayer information', async () => {
    const tin = 'A000000001Z';
    const taxpayerInfo = await client.getTaxpayerInfo(tin);
    expect(taxpayerInfo).toBeDefined();
    expect(taxpayerInfo.tin).toBe(tin);
  });

  it('should submit an invoice', async () => {
    const invoiceData: EtimsInvoice = {
      tin: 'A000000001Z',
      invoiceNumber: 'INV-2025-001',
      invoiceDate: '2025-06-02',
      customerName: 'Sample Customer',
      customerTin: 'A000000002Z',
      items: [
        {
          description: 'Software Development Services',
          quantity: 1,
          unitPrice: 100000,
          taxRate: 16,
          totalAmount: 116000,
        },
      ],
      totalAmount: 116000,
      taxAmount: 16000,
      currency: 'KES',
    };

    const result = await client.submitInvoice(invoiceData);
    expect(result).toBeDefined();
    expect(result.invoiceNumber).toBe(invoiceData.invoiceNumber);
  });

  it('should get invoice status', async () => {
    const invoiceId = 'INV-2025-001';
    const status = await client.getInvoiceStatus(invoiceId);
    expect(status).toBeDefined();
    expect(status.invoiceId).toBe(invoiceId);
  });

  it('should get tax rates', async () => {
    const rates = await client.getTaxRates();
    expect(rates).toBeDefined();
    expect(Array.isArray(rates)).toBe(true);
  });
});