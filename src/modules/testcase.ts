import { KiwiClient } from '../client';
import { 
  TestCase, 
  TestCaseFilter, 
  TestCaseFilterOptions,
  TestCaseWithPermalinks,
  FilterOutputOptions,
  Comment, 
  Attachment,
  Tag,
  Component
} from '../types';

/**
 * Test Case API module
 */
export class TestCaseAPI {
  constructor(private client: KiwiClient) {}

  /**
   * Create a new test case
   */
  async create(testCaseData: Partial<TestCase>): Promise<TestCase> {
    return await this.client.authenticatedCall<TestCase>(
      'TestCase.create', 
      [testCaseData]
    );
  }

  /**
   * Filter test cases
   */
  async filter(query?: TestCaseFilter): Promise<TestCase[]>;
  /**
   * Filter test cases with output options
   */
  async filter(query: TestCaseFilter | undefined, options: FilterOutputOptions): Promise<TestCase[] | TestCaseWithPermalinks[]>;
  async filter(query: TestCaseFilter = {}, options?: FilterOutputOptions): Promise<TestCase[] | TestCaseWithPermalinks[]> {
    const testCases = await this.client.authenticatedCall<TestCase[]>(
      'TestCase.filter', 
      [query]
    );

    if (options?.includePermalinks) {
      // Get URL API instance from the main client
      const urlApi = this.getUrlApi();
      return urlApi.injectPermalinksArray('case', testCases, 'summary');
    }

    return testCases;
  }

  /**
   * Get the URL API instance for permalink injection
   * @private
   */
  private getUrlApi() {
    // Import here to avoid circular dependencies
    const { UrlAPI } = require('./utilities');
    return new UrlAPI(this.client);
  }

  /**
   * Update a test case
   */
  async update(
    testCaseId: number, 
    updateData: Partial<TestCase>
  ): Promise<TestCase> {
    return await this.client.authenticatedCall<TestCase>(
      'TestCase.update', 
      [testCaseId, updateData]
    );
  }

  /**
   * Remove/delete a test case
   */
  async remove(testCaseId: number): Promise<void> {
    await this.client.authenticatedCall('TestCase.remove', [testCaseId]);
  }

  /**
   * Add a comment to test case
   */
  async addComment(testCaseId: number, comment: string): Promise<Comment> {
    return await this.client.authenticatedCall<Comment>(
      'TestCase.add_comment', 
      [testCaseId, comment]
    );
  }

  /**
   * Remove a comment from test case
   */
  async removeComment(testCaseId: number, commentId: number): Promise<void> {
    await this.client.authenticatedCall(
      'TestCase.remove_comment', 
      [testCaseId, commentId]
    );
  }

  /**
   * Add a tag to test case
   */
  async addTag(testCaseId: number, tag: string): Promise<Tag> {
    return await this.client.authenticatedCall<Tag>(
      'TestCase.add_tag', 
      [testCaseId, tag]
    );
  }

  /**
   * Remove a tag from test case
   */
  async removeTag(testCaseId: number, tag: string): Promise<void> {
    await this.client.authenticatedCall(
      'TestCase.remove_tag', 
      [testCaseId, tag]
    );
  }

  /**
   * Add a component to test case
   */
  async addComponent(
    testCaseId: number, 
    componentId: number
  ): Promise<Component> {
    return await this.client.authenticatedCall<Component>(
      'TestCase.add_component', 
      [testCaseId, componentId]
    );
  }

  /**
   * Remove a component from test case
   */
  async removeComponent(
    testCaseId: number, 
    componentId: number
  ): Promise<void> {
    await this.client.authenticatedCall(
      'TestCase.remove_component', 
      [testCaseId, componentId]
    );
  }

  /**
   * Add an attachment to test case
   */
  async addAttachment(
    testCaseId: number, 
    filename: string, 
    b64content: string
  ): Promise<Attachment> {
    return await this.client.authenticatedCall<Attachment>(
      'TestCase.add_attachment', 
      [testCaseId, filename, b64content]
    );
  }

  /**
   * List attachments for test case
   */
  async listAttachments(testCaseId: number): Promise<Attachment[]> {
    return await this.client.authenticatedCall<Attachment[]>(
      'TestCase.list_attachments', 
      [testCaseId]
    );
  }

  /**
   * Get attachments for test case (alias for listAttachments method)
   */
  async getAttachments(testCaseId: number): Promise<Attachment[]> {
    return this.listAttachments(testCaseId);
  }
} 
