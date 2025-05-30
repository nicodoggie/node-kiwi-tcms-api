import { KiwiClient } from '../client';

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

/**
 * URL generation utilities for creating permalinks and slugs
 */
export class UrlAPI {
  constructor(private client: KiwiClient) { }

  /**
   * Generate a permalink URL for a test case
   * @param testCaseId - The ID of the test case
   * @returns The full URL to the test case
   */
  generateTestCaseUrl(testCaseId: number): string {
    const baseUrl = this.getBaseWebUrl();
    return `${baseUrl}/case/${testCaseId}/`;
  }

  /**
   * Generate a permalink URL for a test plan
   * @param testPlanId - The ID of the test plan
   * @returns The full URL to the test plan
   */
  generateTestPlanUrl(testPlanId: number): string {
    const baseUrl = this.getBaseWebUrl();
    return `${baseUrl}/plan/${testPlanId}/`;
  }

  /**
   * Generate a permalink URL for a test run
   * @param testRunId - The ID of the test run
   * @returns The full URL to the test run
   */
  generateTestRunUrl(testRunId: number): string {
    const baseUrl = this.getBaseWebUrl();
    return `${baseUrl}/run/${testRunId}/`;
  }

  /**
   * Generate a permalink URL for a test execution
   * @param testRunId - The ID of the test run
   * @param testCaseId - The ID of the test case
   * @returns The full URL to the test execution
   */
  generateTestExecutionUrl(testRunId: number, testCaseId: number): string {
    const baseUrl = this.getBaseWebUrl();
    return `${baseUrl}/run/${testRunId}/#testcase-${testCaseId}`;
  }

  /**
   * Generate a permalink URL for a bug report
   * @param bugId - The ID of the bug
   * @returns The full URL to the bug report
   */
  generateBugUrl(bugId: number): string {
    const baseUrl = this.getBaseWebUrl();
    return `${baseUrl}/bugs/${bugId}/`;
  }

  /**
   * Create a URL-friendly slug from a string
   * @param text - The text to convert to a slug
   * @param maxLength - Maximum length of the slug (default: 50)
   * @returns A URL-friendly slug
   */
  createSlug(text: string, maxLength: number = 50): string {
    return text
      .toLowerCase()
      .trim()
      // Replace spaces and special characters with hyphens
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, '')
      // Limit length
      // .substring(0, maxLength)
      // Remove trailing hyphen if truncated
      .replace(/-+$/, '');
  }

  /**
   * Generate a short link for sharing
   * @param entityType - Type of entity ('case', 'plan', 'run', 'bug')
   * @param entityId - ID of the entity
   * @param slug - Optional slug for readability
   * @returns A shareable short URL format
   */
  generateShortLink(
    entityType: 'case' | 'plan' | 'run' | 'bug',
    entityId: number,
    slug?: string
  ): string {
    const baseUrl = this.getBaseWebUrl();
    return `${baseUrl}/${entityType}/${entityId}/${slug}`;
  }

  /**
   * Parse a Kiwi TCMS URL to extract entity information
   * @param url - The Kiwi TCMS URL to parse
   * @returns Object with entity type and ID, or null if not a valid URL
   */
  parseKiwiUrl(url: string): { type: string; id: number; slug?: string } | null {
    try {
      const urlObj = new URL(url);
      const pathMatch = urlObj.pathname.match(/\/(case|plan|run|bugs?)\/(\d+)(?:\/([^\/]+))?/);

      if (pathMatch) {
        const [, type, idStr, slug] = pathMatch;
        const normalizedType = type === 'bugs' ? 'bug' : type;
        return {
          type: normalizedType,
          id: parseInt(idStr, 10),
          ...(slug && { slug })
        };
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Get the base web URL from the XML-RPC URL
   * @private
   */
  private getBaseWebUrl(): string {
    // Extract base URL from client config
    const xmlRpcUrl = this.client.getConfig().baseUrl;

    // Remove '/xml-rpc/' suffix to get base web URL
    return xmlRpcUrl.replace(/\/xml-rpc\/?$/, '');
  }

  /**
   * Inject permalink properties into an entity object
   * @param entityType - Type of entity ('case', 'plan', 'run', 'bug')
   * @param entity - The entity object to enhance
   * @param nameField - Field name to use for slug generation (e.g., 'summary', 'name')
   * @returns The entity with permalink properties added
   */
  injectPermalinks<T extends { id: number }>(
    entityType: 'case' | 'plan' | 'run' | 'bug',
    entity: T,
    nameField: keyof T
  ): T & { permalink: string; shortLink: string; slug: string } {
    const name = entity[nameField] as string;
    const slug = this.createSlug(name || `${entityType}/${entity.id}`);

    let permalink: string;
    switch (entityType) {
      case 'case':
        permalink = this.generateTestCaseUrl(entity.id);
        break;
      case 'plan':
        permalink = this.generateTestPlanUrl(entity.id);
        break;
      case 'run':
        permalink = this.generateTestRunUrl(entity.id);
        break;
      case 'bug':
        permalink = this.generateBugUrl(entity.id);
        break;
      default:
        permalink = `${this.getBaseWebUrl()}/${entityType}/${entity.id}/`;
    }

    const shortLink = this.generateShortLink(entityType, entity.id, slug);

    return {
      ...entity,
      permalink,
      shortLink,
      slug
    };
  }

  /**
   * Inject permalinks into an array of entities
   * @param entityType - Type of entity ('case', 'plan', 'run', 'bug')
   * @param entities - Array of entities to enhance
   * @param nameField - Field name to use for slug generation
   * @returns Array of entities with permalink properties added
   */
  injectPermalinksArray<T extends { id: number }>(
    entityType: 'case' | 'plan' | 'run' | 'bug',
    entities: T[],
    nameField: keyof T
  ): Array<T & { permalink: string; shortLink: string; slug: string }> {
    return entities.map(entity => this.injectPermalinks(entityType, entity, nameField));
  }
} 
