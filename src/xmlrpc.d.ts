declare module 'xmlrpc' {
  export interface ClientOptions {
    host: string;
    port: number;
    path: string;
    parser?: any;
    timeout?: number;
    isSecure?: boolean;
    headers?: { [key: string]: string };
  }

  export interface Client {
    methodCall(
      method: string, 
      params: any[], 
      callback: (error: any, value: any) => void
    ): void;
  }

  export function createClient(options: ClientOptions): Client;

  export const dateFormatter: {
    iso8601: any;
  };
} 
