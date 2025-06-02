import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ApiConfig } from '../interfaces/config';
import { GavaConnectUserProfile } from '../interfaces/gavaconnect';
import BaseApiClient from './base';

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

export default GavaConnectApiClient;