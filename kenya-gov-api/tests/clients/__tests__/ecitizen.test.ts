import { EcitizenApiClient } from '../../../src/clients/ecitizen';
import { ApiConfig } from '../../../src/interfaces/config';

describe('EcitizenApiClient', () => {
  let client: EcitizenApiClient;
  const config: ApiConfig = {
    baseUrl: 'https://api.ecitizen.go.ke',
    username: 'testuser',
    password: 'testpassword',
    timeout: 30000,
  };

  beforeEach(() => {
    client = new EcitizenApiClient(config);
  });

  it('should initiate a payment successfully', async () => {
    const paymentData = {
      serviceId: 'PASSPORT_RENEWAL',
      amount: 4550,
      currency: 'KES',
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      customerPhone: '+254712345678',
      description: 'Passport renewal fee',
      referenceNumber: 'REF-2025-001',
    };

    const result = await client.initiatePayment(paymentData);
    expect(result).toHaveProperty('status', 'success');
  });

  it('should get application status successfully', async () => {
    const applicationId = 'APP-2025-001';
    const result = await client.getApplicationStatus(applicationId);
    expect(result).toHaveProperty('status', 'pending');
  });

  it('should get available services successfully', async () => {
    const result = await client.getAvailableServices();
    expect(result).toBeInstanceOf(Array);
  });

  it('should submit an application successfully', async () => {
    const applicationData = {
      serviceId: 'PASSPORT_RENEWAL',
      applicantName: 'John Doe',
      applicantEmail: 'john.doe@example.com',
      applicantPhone: '+254712345678',
      applicationData: {},
    };

    const result = await client.submitApplication(applicationData);
    expect(result).toHaveProperty('status', 'submitted');
  });
});