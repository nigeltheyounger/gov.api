// filepath: /kenya-gov-api/kenya-gov-api/src/clients/base.ts
import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

// Configuration interface for API clients
interface ApiConfig {
  baseUrl: string;
  apiKey?: string;
  username?: string;
  password?: string;
  timeout?: number;
}

// Base API client class
export abstract class BaseApiClient {
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

  protected abstract addAuthHeaders(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig;

  protected handleError(error: any): Promise<never> {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
}