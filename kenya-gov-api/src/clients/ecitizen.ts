import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ApiConfig, EcitizenPayment, EcitizenApplication } from '../interfaces/ecitizen';

class EcitizenApiClient {
  private client: AxiosInstance;
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      (config) => this.addAuthHeaders(config),
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error)
    );
  }

  private addAuthHeaders(config: AxiosRequestConfig): AxiosRequestConfig {
    if (this.config.username && this.config.password) {
      const credentials = Buffer.from(`${this.config.username}:${this.config.password}`).toString('base64');
      config.headers = {
        ...config.headers,
        'Authorization': `Basic ${credentials}`,
      };
    }
    return config;
  }

  private handleError(error: any): Promise<never> {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }

  async initiatePayment(paymentData: EcitizenPayment): Promise<any> {
    try {
      const response = await this.client.post('/payment/initiate', paymentData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to initiate payment: ${error}`);
    }
  }

  async getApplicationStatus(applicationId: string): Promise<any> {
    try {
      const response = await this.client.get(`/application/${applicationId}/status`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get application status: ${error}`);
    }
  }

  async getAvailableServices(): Promise<any> {
    try {
      const response = await this.client.get('/services');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get available services: ${error}`);
    }
  }

  async submitApplication(applicationData: EcitizenApplication): Promise<any> {
    try {
      const response = await this.client.post('/application/submit', applicationData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to submit application: ${error}`);
    }
  }
}

export default EcitizenApiClient;