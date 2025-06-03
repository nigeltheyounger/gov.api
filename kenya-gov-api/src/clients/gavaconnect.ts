import axios, { AxiosInstance, AxiosRequestConfig, AxiosHeaders, InternalAxiosRequestConfig } from 'axios';
import { ApiConfig } from '../interfaces/config';
import { GavaConnectUserProfile } from '../interfaces/gavaconnect';
import { BaseApiClient } from './base';

export class GavaConnectApiClient extends BaseApiClient {
  constructor(config: ApiConfig) {
    super({
      ...config,
      baseUrl: config.baseUrl || 'https://api.gavaconnect.go.ke',
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

  // Get user profile
  async getUserProfile(userId: string): Promise<GavaConnectUserProfile> {
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