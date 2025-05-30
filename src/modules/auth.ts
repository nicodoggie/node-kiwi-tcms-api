import { KiwiClient } from '../client';

/**
 * Authentication API module
 */
export class AuthAPI {
  constructor(private client: KiwiClient) {}

  /**
   * Login to Kiwi TCMS
   * @param username - Username
   * @param password - Password
   * @returns Session ID
   */
  async login(username: string, password: string): Promise<string> {
    return await this.client.call<string>('Auth.login', [username, password]);
  }

  /**
   * Logout from Kiwi TCMS
   */
  async logout(): Promise<void> {
    await this.client.call('Auth.logout');
  }
} 
