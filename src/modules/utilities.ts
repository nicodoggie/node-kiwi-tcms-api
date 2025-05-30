import { KiwiClient } from '../client';
import { Attachment } from '../types';

/**
 * Attachment API module
 */
export class AttachmentAPI {
  constructor(private client: KiwiClient) {}

  /**
   * Remove an attachment
   */
  async remove(attachmentId: number): Promise<void> {
    await this.client.authenticatedCall(
      'Attachment.remove_attachment', 
      [attachmentId]
    );
  }
}

/**
 * Markdown API module
 */
export class MarkdownAPI {
  constructor(private client: KiwiClient) {}

  /**
   * Render markdown to HTML
   */
  async render(markdownText: string): Promise<string> {
    return await this.client.authenticatedCall<string>(
      'Markdown.render', 
      [markdownText]
    );
  }
}

/**
 * Kiwi TCMS system utilities
 */
export class KiwiUtilsAPI {
  constructor(private client: KiwiClient) {}

  /**
   * Get Kiwi TCMS version
   */
  async version(): Promise<string> {
    return await this.client.call<string>('Kiwi.version');
  }

  /**
   * Extract tracker information from URL
   */
  async trackerFromUrl(url: string): Promise<any> {
    return await this.client.authenticatedCall(
      'Utils.tracker_from_url', 
      [url]
    );
  }
} 
