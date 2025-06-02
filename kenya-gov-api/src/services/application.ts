import { EcitizenApplication } from '../interfaces/ecitizen';
import { EcitizenApiClient } from '../clients/ecitizen';

export class ApplicationService {
  private ecitizenClient: EcitizenApiClient;

  constructor(ecitizenClient: EcitizenApiClient) {
    this.ecitizenClient = ecitizenClient;
  }

  async submitApplication(applicationData: EcitizenApplication): Promise<any> {
    try {
      const response = await this.ecitizenClient.submitApplication(applicationData);
      return response;
    } catch (error) {
      throw new Error(`Failed to submit application: ${error.message}`);
    }
  }

  async getApplicationStatus(applicationId: string): Promise<any> {
    try {
      const response = await this.ecitizenClient.getApplicationStatus(applicationId);
      return response;
    } catch (error) {
      throw new Error(`Failed to get application status: ${error.message}`);
    }
  }
}