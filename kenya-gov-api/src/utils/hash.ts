import crypto from 'crypto';

/**
 * Creates a SHA-256 hash of the given data.
 * @param data - The data to hash.
 * @returns The SHA-256 hash of the data.
 */
export function createSHA256Hash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
}