import { AxiosRequestConfig } from 'axios';
import crypto from 'crypto';

// Function to add authentication headers to the request config
export function addAuthHeaders(config: AxiosRequestConfig, apiKey?: string, username?: string, password?: string): AxiosRequestConfig {
    if (apiKey) {
        config.headers = {
            ...config.headers,
            'Authorization': `Bearer ${apiKey}`,
            'X-API-Key': apiKey,
        };
    } else if (username && password) {
        const credentials = Buffer.from(`${username}:${password}`).toString('base64');
        config.headers = {
            ...config.headers,
            'Authorization': `Basic ${credentials}`,
        };
    }
    return config;
}

// Function to generate a secure hash using SHA-256
export function generateSecureHash(data: any): string {
    const hashString = Object.keys(data)
        .sort()
        .map(key => `${key}=${data[key]}`)
        .join('&');
    
    return crypto.createHash('sha256').update(hashString).digest('hex');
}