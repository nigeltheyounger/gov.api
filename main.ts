

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import crypto from 'crypto';

// Configuration interface for API clients
interface ApiConfig {
  baseUrl: string;
  apiKey?: string;
  username?: string;
  password?: string;
  timeout?: number;
}

// Base API client class
abstract class BaseApiClient {
  protected client: AxiosInstance;
  protected config: ApiConfig;

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

    // Add request interceptor for authentication
    this.client.interceptors.request.use(
      (config) => this.addAuthHeaders(config),
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error)
    );
  }

  protected abstract addAuthHeaders(config: AxiosRequestConfig): AxiosRequestConfig;

  protected handleError(error: any): Promise<never> {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
}

// eTIMS API Client for Electronic Tax Invoice Management System
class EtimsApiClient extends BaseApiClient {
  constructor(config: ApiConfig) {
    super({
      ...config,
      baseUrl: config.baseUrl || 'https://developer.go.ke/apis/eTims',
    });
  }

  protected addAuthHeaders(config: AxiosRequestConfig): AxiosRequestConfig {
    if (this.config.apiKey) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${this.config.apiKey}`,
        'X-API-Key': this.config.apiKey,
      };
    }
    return config;
  }

  // Get taxpayer information
  async getTaxpayerInfo(tin: string): Promise<any> {
    try {
      const response = await this.client.get(`/taxpayer/${tin}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get taxpayer info: ${error}`);
    }
  }

  // Submit electronic invoice
  async submitInvoice(invoiceData: EtimsInvoice): Promise<any> {
    try {
      const response = await this.client.post('/invoice/submit', invoiceData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to submit invoice: ${error}`);
    }
  }

  // Get invoice status
  async getInvoiceStatus(invoiceId: string): Promise<any> {
    try {
      const response = await this.client.get(`/invoice/${invoiceId}/status`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get invoice status: ${error}`);
    }
  }

  // Get tax rates
  async getTaxRates(): Promise<any> {
    try {
      const response = await this.client.get('/tax-rates');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get tax rates: ${error}`);
    }
  }
}

// eCitizen API Client for government services
class EcitizenApiClient extends BaseApiClient {
  constructor(config: ApiConfig) {
    super({
      ...config,
      baseUrl: config.baseUrl || 'https://api.ecitizen.go.ke',
    });
  }

  protected addAuthHeaders(config: AxiosRequestConfig): AxiosRequestConfig {
    if (this.config.username && this.config.password) {
      const credentials = Buffer.from(`${this.config.username}:${this.config.password}`).toString('base64');
      config.headers = {
        ...config.headers,
        'Authorization': `Basic ${credentials}`,
      };
    }
    return config;
  }

  // Generate secure hash for payment requests
  private generateSecureHash(data: any): string {
    const hashString = Object.keys(data)
      .sort()
      .map(key => `${key}=${data[key]}`)
      .join('&');
    
    return crypto.createHash('sha256').update(hashString).digest('hex');
  }

  // Initiate payment for government service
  async initiatePayment(paymentData: EcitizenPayment): Promise<any> {
    try {
      const dataWithHash = {
        ...paymentData,
        hash: this.generateSecureHash(paymentData),
      };
      
      const response = await this.client.post('/payment/initiate', dataWithHash);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to initiate payment: ${error}`);
    }
  }

  // Get service application status
  async getApplicationStatus(applicationId: string): Promise<any> {
    try {
      const response = await this.client.get(`/application/${applicationId}/status`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get application status: ${error}`);
    }
  }

  // Get available services
  async getAvailableServices(): Promise<any> {
    try {
      const response = await this.client.get('/services');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get available services: ${error}`);
    }
  }

  // Submit service application
  async submitApplication(applicationData: EcitizenApplication): Promise<any> {
    try {
      const response = await this.client.post('/application/submit', applicationData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to submit application: ${error}`);
    }
  }
}

// GavaConnect API Client for integrated government services
class GavaConnectApiClient extends BaseApiClient {
  constructor(config: ApiConfig) {
    super({
      ...config,
      baseUrl: config.baseUrl || 'https://api.gavaconnect.go.ke',
    });
  }

  protected addAuthHeaders(config: AxiosRequestConfig): AxiosRequestConfig {
    if (this.config.apiKey) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${this.config.apiKey}`,
        'X-API-Key': this.config.apiKey,
      };
    }
    return config;
  }

  // Get user profile
  async getUserProfile(userId: string): Promise<any> {
    try {
      const response = await this.client.get(`/user/${userId}/profile`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get user profile: ${error}`);
    }
  }

  // Get integrated services
  async getIntegratedServices(): Promise<any> {
    try {
      const response = await this.client.get('/services/integrated');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get integrated services: ${error}`);
    }
  }
}

// Data interfaces
interface EtimsInvoice {
  tin: string;
  invoiceNumber: string;
  invoiceDate: string;
  customerName: string;
  customerTin?: string;
  items: EtimsInvoiceItem[];
  totalAmount: number;
  taxAmount: number;
  currency: string;
}

interface EtimsInvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  totalAmount: number;
}

interface EcitizenPayment {
  serviceId: string;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  description: string;
  referenceNumber: string;
}

interface EcitizenApplication {
  serviceId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  applicationData: Record<string, any>;
  attachments?: ApplicationAttachment[];
}

interface ApplicationAttachment {
  name: string;
  type: string;
  data: string; // Base64 encoded
}

// Main application class
class KenyaGovernmentApiApp {
  private etimsClient?: EtimsApiClient;
  private ecitizenClient?: EcitizenApiClient;
  private gavaConnectClient?: GavaConnectApiClient;

  constructor() {
    this.initializeClients();
  }

  private initializeClients(): void {
    // Initialize eTIMS client
    this.etimsClient = new EtimsApiClient({
      baseUrl: process.env.ETIMS_BASE_URL || 'https://developer.go.ke/apis/eTims',
      apiKey: process.env.ETIMS_API_KEY,
      timeout: 30000,
    });

    // Initialize eCitizen client
    this.ecitizenClient = new EcitizenApiClient({
      baseUrl: process.env.ECITIZEN_BASE_URL || 'https://api.ecitizen.go.ke',
      username: process.env.ECITIZEN_USERNAME,
      password: process.env.ECITIZEN_PASSWORD,
      timeout: 30000,
    });

    // Initialize GavaConnect client
    this.gavaConnectClient = new GavaConnectApiClient({
      baseUrl: process.env.GAVACONNECT_BASE_URL || 'https://api.gavaconnect.go.ke',
      apiKey: process.env.GAVACONNECT_API_KEY,
      timeout: 30000,
    });
  }

  // eTIMS operations
  async submitTaxInvoice(invoiceData: EtimsInvoice): Promise<any> {
    if (!this.etimsClient) {
      throw new Error('eTIMS client not initialized');
    }
    return await this.etimsClient.submitInvoice(invoiceData);
  }

  async getTaxpayerInformation(tin: string): Promise<any> {
    if (!this.etimsClient) {
      throw new Error('eTIMS client not initialized');
    }
    return await this.etimsClient.getTaxpayerInfo(tin);
  }

  // eCitizen operations
  async makeGovernmentPayment(paymentData: EcitizenPayment): Promise<any> {
    if (!this.ecitizenClient) {
      throw new Error('eCitizen client not initialized');
    }
    return await this.ecitizenClient.initiatePayment(paymentData);
  }

  async submitGovernmentApplication(applicationData: EcitizenApplication): Promise<any> {
    if (!this.ecitizenClient) {
      throw new Error('eCitizen client not initialized');
    }
    return await this.ecitizenClient.submitApplication(applicationData);
  }

  // Utility methods
  async healthCheck(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};

    try {
      if (this.etimsClient) {
        await this.etimsClient.getTaxRates();
        results.etims = true;
      }
    } catch {
      results.etims = false;
    }

    try {
      if (this.ecitizenClient) {
        await this.ecitizenClient.getAvailableServices();
        results.ecitizen = true;
      }
    } catch {
      results.ecitizen = false;
    }

    try {
      if (this.gavaConnectClient) {
        await this.gavaConnectClient.getIntegratedServices();
        results.gavaconnect = true;
      }
    } catch {
      results.gavaconnect = false;
    }

    return results;
  }
}

// Usage example
async function main() {
  const app = new KenyaGovernmentApiApp();

  try {
    // Check API health
    const healthStatus = await app.healthCheck();
    console.log('API Health Status:', healthStatus);

    // Example: Submit tax invoice
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

    const invoiceResult = await app.submitTaxInvoice(invoiceData);
    console.log('Invoice submitted:', invoiceResult);

    // Example: Make government payment
    const paymentData: EcitizenPayment = {
      serviceId: 'PASSPORT_RENEWAL',
      amount: 4550,
      currency: 'KES',
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      customerPhone: '+254712345678',
      description: 'Passport renewal fee',
      referenceNumber: 'REF-2025-001',
    };

    const paymentResult = await app.makeGovernmentPayment(paymentData);
    console.log('Payment initiated:', paymentResult);

  } catch (error) {
    console.error('Application error:', error);
  }
}

// Export classes for use in other modules
export {
  KenyaGovernmentApiApp,
  EtimsApiClient,
  EcitizenApiClient,
  GavaConnectApiClient,
  EtimsInvoice,
  EcitizenPayment,
  EcitizenApplication,
};

// Run the application if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}