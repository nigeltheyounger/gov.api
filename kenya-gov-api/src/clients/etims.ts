import { InternalAxiosRequestConfig, AxiosHeaders } from 'axios';
import { BaseApiClient } from './base';
import { ApiConfig } from '../interfaces/config';
import { EtimsInvoice } from '../interfaces/etims';

export class EtimsApiClient extends BaseApiClient {
  constructor(config: ApiConfig) {
    super({
      ...config,
      baseUrl: config.baseUrl || 'https://developer.go.ke/apis/eTims',
    });
  }

  protected addAuthHeaders(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    if (this.config.apiKey) {
      const headers = new AxiosHeaders(config.headers);
      headers.set('Authorization', `Bearer ${this.config.apiKey}`);
      headers.set('X-API-Key', this.config.apiKey);
      config.headers = headers;
    }
    return config;
  }

  async getTaxpayerInfo(tin: string): Promise<any> {
    try {
      const response = await this.client.get(`/taxpayer/${tin}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get taxpayer info: ${error}`);
    }
  }

  async submitInvoice(invoiceData: EtimsInvoice): Promise<any> {
    try {
      const response = await this.client.post('/invoice/submit', invoiceData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to submit invoice: ${error}`);
    }
  }

  async getInvoiceStatus(invoiceId: string): Promise<any> {
    try {
      const response = await this.client.get(`/invoice/${invoiceId}/status`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get invoice status: ${error}`);
    }
  }

  async getTaxRates(): Promise<any> {
    try {
      const response = await this.client.get('/tax-rates');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get tax rates: ${error}`);
    }
  }
}

export default EtimsApiClient;