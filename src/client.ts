import * as xmlrpc from 'xmlrpc';
import { KiwiConfig } from './types';

/**
 * Base XML-RPC client for Kiwi TCMS
 */
export class KiwiClient {
  private client: xmlrpc.Client;
  private config: KiwiConfig;
  private sessionId?: string;

  constructor(config: KiwiConfig) {
    this.config = {
      timeout: 30000,
      ...config,
    };

    // Parse URL to get host, port, and path
    const url = new URL(this.config.baseUrl);
    const isSecure = url.protocol === 'https:';
    const port = url.port ? parseInt(url.port) : (isSecure ? 443 : 80);
    
    // Handle different possible XML-RPC endpoints
    let path = url.pathname;
    if (path.endsWith('/xml-rpc/')) {
      path = '/xml-rpc'; // Remove trailing slash to avoid redirects
    } else if (path.endsWith('/xml-rpc')) {
      path = '/xml-rpc';
    } else if (path === '/' || path === '') {
      path = '/xml-rpc'; // Default to /xml-rpc without trailing slash
    } else {
      path = `${path.replace(/\/$/, '')}/xml-rpc`;
    }

    // Debug logging
    console.log(`🔧 XML-RPC Client Configuration:`);
    console.log(`   Base URL: ${config.baseUrl}`);
    console.log(`   Host: ${url.hostname}`);
    console.log(`   Port: ${port}`);
    console.log(`   Path: ${path}`);
    console.log(`   Secure: ${isSecure}`);
    console.log(`   Full endpoint: ${url.protocol}//${url.hostname}:${port}${path}`);

    // Prepare headers
    const headers: { [key: string]: string } = {
      'User-Agent': 'Node.js Kiwi TCMS Client',
      ...this.config.headers,
    };

    // Add Cloudflare Access credentials if provided
    if (this.config.cloudflareClientId && this.config.cloudflareClientSecret) {
      headers['CF-Access-Client-Id'] = this.config.cloudflareClientId;
      headers['CF-Access-Client-Secret'] = this.config.cloudflareClientSecret;
      console.log(`   Cloudflare Access: Enabled`);
    } else {
      console.log(`   Cloudflare Access: Disabled`);
    }

    console.log(`   Headers:`, Object.keys(headers));

    // Create client configuration
    const clientConfig: any = {
      host: url.hostname,
      path: path,
      parser: xmlrpc.dateFormatter.iso8601,
      timeout: this.config.timeout,
      headers: headers,
    };

    // Only set port if it's not the default for the protocol
    if ((isSecure && port !== 443) || (!isSecure && port !== 80)) {
      clientConfig.port = port;
    }

    // Set secure connection for HTTPS
    if (isSecure) {
      clientConfig.isSecure = true;
    }

    console.log(`   Final client config:`, clientConfig);

    this.client = xmlrpc.createClient(clientConfig);
  }

  /**
   * Make an XML-RPC method call
   */
  async call<T = any>(method: string, params: any[] = []): Promise<T> {
    return new Promise((resolve, reject) => {
      this.client.methodCall(method, params, (error: any, value: any) => {
        if (error) {
          // Enhanced error reporting
          let errorMessage = `XML-RPC Error: ${error.message}`;
          
          if (error.body) {
            console.error('Response body that caused the error:');
            console.error(error.body.substring(0, 500) + '...');
            
            if (error.body.includes('<title>') || error.body.includes('<html>')) {
              errorMessage += '\n\nReceived HTML response instead of XML-RPC. This usually means:';
              errorMessage += '\n1. Wrong endpoint URL';
              errorMessage += '\n2. Authentication/authorization failure';
              errorMessage += '\n3. Cloudflare Access blocking the request';
              errorMessage += '\n4. Server returning error page instead of XML-RPC response';
            }
          }
          
          if (error.res) {
            errorMessage += `\nHTTP Status: ${error.res.statusCode}`;
          }
          
          reject(new Error(errorMessage));
        } else {
          resolve(value);
        }
      });
    });
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
   */
  async authenticatedCall<T = any>(
    method: string, 
    params: any[] = []
  ): Promise<T> {
    if (!this.sessionId) {
      await this.login();
    }

    // Add session ID as first parameter for authenticated calls
    const authParams = [this.sessionId, ...params];
    
    try {
      return await this.call<T>(method, authParams);
    } catch (error) {
      // If authentication error, try to re-login once
      if ((error as Error).message.includes('Authentication') || 
          (error as Error).message.includes('Session')) {
        this.sessionId = undefined;
        await this.login();
        const retryParams = [this.sessionId, ...params];
        return await this.call<T>(method, retryParams);
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
   * Get server version information
   */
  async getVersion(): Promise<string> {
    try {
      // According to Kiwi TCMS docs, this should be the correct method
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
} 
