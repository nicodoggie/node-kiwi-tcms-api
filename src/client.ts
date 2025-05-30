import axios from 'axios';
import { KiwiConfig } from './types';
import { AxiosXmlRpcClient } from './axios-xmlrpc-client';

/**
 * Base XML-RPC client for Kiwi TCMS
 */
export class KiwiClient {
  private client?: AxiosXmlRpcClient;
  private config: KiwiConfig;
  private sessionId?: string;
  private cfAuthCookie?: string;

  constructor(config: KiwiConfig) {
    this.config = {
      timeout: 30000,
      ...config,
    };

    // We'll initialize the client after getting CF auth if needed
  }

  /**
   * Get Cloudflare Access authorization cookie using axios
   */
  private async getCloudflareAuthCookie(): Promise<string | undefined> {
    if (!this.config.cloudflareClientId || !this.config.cloudflareClientSecret) {
      return undefined;
    }

    try {
      console.log('🔐 Getting Cloudflare Access authorization cookie...');

      const url = new URL(this.config.baseUrl);
      const testUrl = `${url.protocol}//${url.hostname}${url.pathname || '/'}`;

      const response = await axios.get(testUrl, {
        headers: {
          'CF-Access-Client-Id': this.config.cloudflareClientId,
          'CF-Access-Client-Secret': this.config.cloudflareClientSecret,
          'User-Agent': 'Node.js Kiwi TCMS Client',
        },
        timeout: this.config.timeout,
        maxRedirects: 10, // axios handles redirects automatically
        validateStatus: () => true, // Accept any status code
      });

      console.log(`📊 Cloudflare Auth Response: ${response.status} ${response.statusText}`);

      // Extract CF_Authorization cookie
      const cookies = response.headers['set-cookie'];
      if (cookies) {
        for (const cookie of cookies) {
          if (cookie.startsWith('CF_Authorization=')) {
            const cfAuth = cookie.split(';')[0]; // Get just the CF_Authorization=value part
            console.log('✅ Got Cloudflare Authorization cookie');
            return cfAuth;
          }
        }
      }

      // Also check if we're already authenticated (no cookie needed)
      if (response.status === 200) {
        console.log('✅ Cloudflare Access already authenticated (no cookie needed)');
        return 'authenticated';
      }

      console.log('⚠️  No CF_Authorization cookie found in response');
      console.log('Response headers:', response.headers);
      return undefined;

    } catch (error) {
      console.error('❌ Failed to get Cloudflare auth cookie:', (error as Error).message);
      return undefined;
    }
  }

  /**
   * Initialize the XML-RPC client with proper authentication
   */
  private async initializeClient(): Promise<void> {
    if (this.client) {
      return; // Already initialized
    }

    // Get Cloudflare auth cookie if needed
    if (this.config.cloudflareClientId && this.config.cloudflareClientSecret) {
      this.cfAuthCookie = await this.getCloudflareAuthCookie();
    }

    // Parse URL to get host, port, and path
    const url = new URL(this.config.baseUrl);

    // Debug logging
    console.log(`🔧 XML-RPC Client Configuration:`);
    console.log(`   Base URL: ${this.config.baseUrl}`);
    console.log(`   Host: ${url.hostname}`);
    console.log(`   Protocol: ${url.protocol}`);
    console.log(`   Path: ${url.pathname}`);

    // Prepare headers
    const headers: { [key: string]: string } = {
      'User-Agent': 'Node.js Kiwi TCMS Client',
      ...this.config.headers,
    };

    // Add Cloudflare Access credentials if provided and no cookie obtained
    if (this.config.cloudflareClientId && this.config.cloudflareClientSecret && !this.cfAuthCookie) {
      headers['CF-Access-Client-Id'] = this.config.cloudflareClientId;
      headers['CF-Access-Client-Secret'] = this.config.cloudflareClientSecret;
      console.log(`   Cloudflare Access: Using headers`);
    } else if (this.cfAuthCookie && this.cfAuthCookie !== 'authenticated') {
      headers['Cookie'] = this.cfAuthCookie;
      console.log(`   Cloudflare Access: Using cookie`);
    } else {
      console.log(`   Cloudflare Access: Disabled`);
    }

    console.log(`   Headers:`, Object.keys(headers));

    // Create our custom AxiosXmlRpcClient
    this.client = new AxiosXmlRpcClient({
      url: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: headers,
    });

    console.log(`✅ AxiosXmlRpcClient initialized successfully`);
  }

  /**
   * Make an XML-RPC method call
   */
  async call<T = any>(method: string, params: any[] = []): Promise<T> {
    // Ensure client is initialized before making calls
    await this.initializeClient();

    if (!this.client) {
      throw new Error('Failed to initialize XML-RPC client');
    }

    try {
      const result = await this.client.methodCall(method, params);
      return result as T;
    } catch (error: any) {
      // Enhanced error reporting
      let errorMessage = `XML-RPC Error: ${error.message}`;

      console.error('\n🔍 Debugging XML-RPC Call:');
      console.error(`   Method: ${method}`);
      console.error(`   Params: ${JSON.stringify(params)}`);
      console.error(`   Error: ${error.message}`);

      if (error.response) {
        console.error(`   HTTP Status: ${error.response.status} ${error.response.statusText}`);
        if (error.response.headers) {
          console.error('   Response Headers:', error.response.headers);
        }
      }

      console.error('\n' + '='.repeat(60));

      throw new Error(errorMessage);
    }
  }

  /**
   * Authenticate with the Kiwi TCMS server
   */
  async login(): Promise<string> {
    if (!this.config.username || !this.config.password) {
      throw new Error('Username and password are required for authentication');
    }

    try {
      const sessionId = await this.call<string>('Auth.login', [
        this.config.username,
        this.config.password,
      ]);
      
      this.sessionId = sessionId;
      return sessionId;
    } catch (error) {
      throw new Error(`Authentication failed: ${(error as Error).message}`);
    }
  }

  /**
   * Logout from the Kiwi TCMS server
   */
  async logout(): Promise<void> {
    if (this.sessionId) {
      try {
        await this.call('Auth.logout');
        this.sessionId = undefined;
      } catch (error) {
        // Ignore logout errors, but clear session
        this.sessionId = undefined;
      }
    }
  }

  /**
   * Make an authenticated XML-RPC call
   * Note: Kiwi TCMS uses session cookies for authentication, not session ID parameters
   */
  async authenticatedCall<T = any>(
    method: string, 
    params: any[] = []
  ): Promise<T> {
    if (!this.sessionId) {
      await this.login();
    }

    // Don't pass session ID as parameter - Kiwi TCMS uses session cookies
    try {
      return await this.call<T>(method, params);
    } catch (error) {
      // If authentication error, try to re-login once
      if ((error as Error).message.includes('Authentication') || 
          (error as Error).message.includes('Session')) {
        this.sessionId = undefined;
        await this.login();
        // Retry with original params (no session ID)
        return await this.call<T>(method, params);
      }
      throw error;
    }
  }

  /**
   * Get the current session ID
   */
  getSessionId(): string | undefined {
    return this.sessionId;
  }

  /**
   * Check if client is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.sessionId;
  }

  /**
   * Set session ID manually (useful for token-based auth)
   */
  setSessionId(sessionId: string): void {
    this.sessionId = sessionId;
  }

  /**
   * Test connectivity to the server
   */
  async testConnection(): Promise<string[]> {
    try {
      const methods = await this.call<string[]>('system.listMethods');
      return methods;
    } catch (error) {
      throw new Error(`Failed to connect to Kiwi TCMS server: ${(error as Error).message}`);
    }
  }

  async getVersion(): Promise<string> {
    try {
      return await this.call<string>('Kiwi.version');
    } catch (error) {
      throw new Error(`Failed to get Kiwi TCMS version: ${(error as Error).message}`);
    }
  }

  /**
   * List available XML-RPC methods (useful for debugging)
   */
  async listMethods(): Promise<string[]> {
    try {
      return await this.call<string[]>('system.listMethods');
    } catch (error) {
      throw new Error(`Failed to list methods: ${(error as Error).message}`);
    }
  }

  /**
   * Set a custom header for all requests
   */
  setHeader(name: string, value: string): void {
    if (!this.config.headers) {
      this.config.headers = {};
    }
    this.config.headers[name] = value;
    
    // Note: xmlrpc client doesn't support dynamic header updates
    // Headers are set during client creation only
    console.warn('Header changes require recreating the client. Consider creating a new KiwiClient instance.');
  }

  /**
   * Set Cloudflare Access credentials
   */
  setCloudflareAccess(clientId: string, clientSecret: string): void {
    this.config.cloudflareClientId = clientId;
    this.config.cloudflareClientSecret = clientSecret;
    console.warn('Cloudflare Access credential changes require recreating the client. Consider creating a new KiwiClient instance.');
  }

  /**
   * Get current headers configuration
   */
  getHeaders(): { [key: string]: string } | undefined {
    return this.config.headers;
  }

  /**
   * Get the current configuration
   */
  getConfig(): KiwiConfig {
    return { ...this.config };
  }
} 
