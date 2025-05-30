import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import { parseString } from 'xml2js';

export interface AxiosXmlRpcConfig {
  url: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export class AxiosXmlRpcClient {
  private client: AxiosInstance;
  private url: string;
  private cookieJar: CookieJar;

  constructor(config: AxiosXmlRpcConfig) {
    this.url = config.url;
    this.cookieJar = new CookieJar();

    // Create axios instance with cookie support
    this.client = wrapper(axios.create({
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'text/xml',
        'User-Agent': 'Node.js Kiwi TCMS Client (axios)',
        ...config.headers,
      },
      // Axios handles redirects automatically
      maxRedirects: 5,
      validateStatus: (status) => status >= 200 && status < 300,
      // Enable cookie jar for session management
      jar: this.cookieJar,
      withCredentials: true,
    }));

    console.log('🍪 AxiosXmlRpcClient initialized with cookie support');
  }

  async methodCall(method: string, params: any[] = []): Promise<any> {
    const xmlPayload = this.buildXmlRpcRequest(method, params);

    try {
      const response = await this.client.post(this.url, xmlPayload);

      if (!response.data || typeof response.data !== 'string') {
        throw new Error('Invalid response: expected XML string');
      }

      return this.parseXmlRpcResponse(response.data);
    } catch (error: any) {
      if (error.response) {
        throw new Error(`XML-RPC call failed: ${error.response.status} ${error.response.statusText}`);
      }
      throw error;
    }
  }

  private buildXmlRpcRequest(method: string, params: any[]): string {
    let xml = '<?xml version="1.0"?>\n<methodCall>\n';
    xml += `  <methodName>${this.escapeXml(method)}</methodName>\n`;
    xml += '  <params>\n';

    for (const param of params) {
      xml += '    <param>\n';
      xml += this.serializeValue(param, '      ');
      xml += '    </param>\n';
    }

    xml += '  </params>\n';
    xml += '</methodCall>';

    return xml;
  }

  private serializeValue(value: any, indent: string): string {
    let xml = `${indent}<value>`;

    if (value === null || value === undefined) {
      xml += '<nil/>';
    } else if (typeof value === 'string') {
      xml += `<string>${this.escapeXml(value)}</string>`;
    } else if (typeof value === 'number') {
      if (Number.isInteger(value)) {
        xml += `<int>${value}</int>`;
      } else {
        xml += `<double>${value}</double>`;
      }
    } else if (typeof value === 'boolean') {
      xml += `<boolean>${value ? '1' : '0'}</boolean>`;
    } else if (value instanceof Date) {
      xml += `<dateTime.iso8601>${value.toISOString()}</dateTime.iso8601>`;
    } else if (Array.isArray(value)) {
      xml += '<array><data>\n';
      for (const item of value) {
        xml += this.serializeValue(item, indent + '  ');
      }
      xml += `${indent}</data></array>`;
    } else if (typeof value === 'object') {
      xml += '<struct>\n';
      for (const [key, val] of Object.entries(value)) {
        xml += `${indent}  <member>\n`;
        xml += `${indent}    <name>${this.escapeXml(key)}</name>\n`;
        xml += this.serializeValue(val, indent + '    ');
        xml += `${indent}  </member>\n`;
      }
      xml += `${indent}</struct>`;
    }

    xml += '</value>\n';
    return xml;
  }

  private async parseXmlRpcResponse(xmlString: string): Promise<any> {
    return new Promise((resolve, reject) => {
      parseString(xmlString, { explicitArray: false, mergeAttrs: true }, (err, result) => {
        if (err) {
          reject(new Error(`XML parsing error: ${err.message}`));
          return;
        }

        try {
          if (result.methodResponse) {
            if (result.methodResponse.fault) {
              // Handle fault response
              const fault = this.parseXmlRpcValue(result.methodResponse.fault.value);
              throw new Error(`XML-RPC Fault: ${fault.faultString} (Code: ${fault.faultCode})`);
            }

            if (result.methodResponse.params) {
              // Handle successful response
              const params = result.methodResponse.params;
              if (params.param) {
                const value = Array.isArray(params.param) ? params.param[0] : params.param;
                return resolve(this.parseXmlRpcValue(value.value));
              }
            }

            // Handle empty response
            resolve(null);
          } else {
            reject(new Error('Invalid XML-RPC response format'));
          }
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  private parseXmlRpcValue(valueObj: any): any {
    if (!valueObj || typeof valueObj !== 'object') {
      return valueObj;
    }

    // Handle different XML-RPC types
    if (valueObj.string !== undefined) {
      return valueObj.string;
    }
    if (valueObj.int !== undefined) {
      return parseInt(valueObj.int);
    }
    if (valueObj.i4 !== undefined) {
      return parseInt(valueObj.i4);
    }
    if (valueObj.double !== undefined) {
      return parseFloat(valueObj.double);
    }
    if (valueObj.boolean !== undefined) {
      return valueObj.boolean === '1' || valueObj.boolean === 1;
    }
    if (valueObj['dateTime.iso8601'] !== undefined) {
      return new Date(valueObj['dateTime.iso8601']);
    }
    if (valueObj.array !== undefined) {
      if (valueObj.array.data && valueObj.array.data.value) {
        const values = Array.isArray(valueObj.array.data.value)
          ? valueObj.array.data.value
          : [valueObj.array.data.value];
        return values.map((v: any) => this.parseXmlRpcValue(v));
      }
      return [];
    }
    if (valueObj.struct !== undefined) {
      const result: any = {};
      if (valueObj.struct.member) {
        const members = Array.isArray(valueObj.struct.member)
          ? valueObj.struct.member
          : [valueObj.struct.member];

        for (const member of members) {
          if (member.name && member.value !== undefined) {
            result[member.name] = this.parseXmlRpcValue(member.value);
          }
        }
      }
      return result;
    }

    // Handle XML-RPC nil values - convert to JavaScript null
    if (valueObj.nil !== undefined) {
      return null;
    }

    // Handle text nodes or direct values - preserve objects when possible
    if (typeof valueObj === 'string') {
      return valueObj;
    }

    // If it's an object but not a recognized XML-RPC type, check if it's a direct value
    // This handles cases where xml2js might parse values differently
    if (typeof valueObj === 'object' && valueObj !== null) {
      // Check if this is a text node (common in xml2js output)
      if ('_' in valueObj && Object.keys(valueObj).length === 1) {
        return valueObj._;
      }

      // Check if this is an XML-RPC nil value (alternative representation)
      if ('nil' in valueObj) {
        return null;
      }

      // If it has multiple properties or no special structure, treat as a complex object
      // Recursively process all properties to handle nested structures
      const result: any = {};
      for (const [key, value] of Object.entries(valueObj)) {
        result[key] = this.parseXmlRpcValue(value);
      }
      return result;
    }

    // For any other types (number, boolean, etc), return as-is
    return valueObj;
  }

  private escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
} 
