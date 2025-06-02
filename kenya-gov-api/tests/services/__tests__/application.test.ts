import { submitApplication, getApplicationStatus } from '../../../src/services/application';
import { EcitizenApplication } from '../../../src/interfaces/ecitizen';

describe('Application Service', () => {
  const mockApplicationData: EcitizenApplication = {
    serviceId: 'PASSPORT_RENEWAL',
    applicantName: 'John Doe',
    applicantEmail: 'john.doe@example.com',
    applicantPhone: '+254712345678',
    applicationData: {
      // Add necessary application data fields here
    },
    attachments: [],
  };

  it('should submit an application successfully', async () => {
    const result = await submitApplication(mockApplicationData);
    expect(result).toHaveProperty('status', 'success');
    expect(result).toHaveProperty('applicationId');
  });

  it('should get application status successfully', async () => {
    const applicationId = 'APP-123456';
    const result = await getApplicationStatus(applicationId);
    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('applicationId', applicationId);
  });
});