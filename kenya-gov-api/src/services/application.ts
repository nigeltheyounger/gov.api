import { EcitizenApplication } from '../interfaces/ecitizen';
import EcitizenApiClient from '../clients/ecitizen';
import { AxiosError } from 'axios';

interface ApplicationResponse {
  id: string;
  status: string;
  message?: string;
  data?: any;
}

export class ApplicationService {
  private ecitizenClient: EcitizenApiClient;

  constructor(ecitizenClient: EcitizenApiClient) {
    this.ecitizenClient = ecitizenClient;
  }

  async submitApplication(applicationData: EcitizenApplication): Promise<ApplicationResponse> {
    try {
      const response = await this.ecitizenClient.submitApplication(applicationData);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(`Failed to submit application: ${error.response?.data?.message || error.message}`);
      }
      throw new Error('Failed to submit application: Unknown error occurred');
    }
  }

  async getApplicationStatus(applicationId: string): Promise<ApplicationResponse> {
    try {
      const response = await this.ecitizenClient.getApplicationStatus(applicationId);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(`Failed to get application status: ${error.response?.data?.message || error.message}`);
      }
      throw new Error('Failed to get application status: Unknown error occurred');
    }
  }
}