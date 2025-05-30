import { KiwiClient } from '../client';
import { 
  TestCase, 
  TestCaseFilter, 
  Comment, 
  Property, 
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
  async filter(query: TestCaseFilter = {}): Promise<TestCase[]> {
    return await this.client.authenticatedCall<TestCase[]>(
      'TestCase.filter', 
      [query]
    );
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
   * Get comments for test case
   */
  async comments(testCaseId: number): Promise<Comment[]> {
    return await this.client.authenticatedCall<Comment[]>(
      'TestCase.comments', 
      [testCaseId]
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
   * Add a property to test case
   */
  async addProperty(
    testCaseId: number, 
    name: string, 
    value: string
  ): Promise<void> {
    await this.client.authenticatedCall(
      'TestCase.add_property', 
      [testCaseId, name, value]
    );
  }

  /**
   * Get properties of test case
   */
  async properties(testCaseId: number): Promise<Property[]> {
    return await this.client.authenticatedCall<Property[]>(
      'TestCase.properties', 
      [testCaseId]
    );
  }

  /**
   * Remove a property from test case
   */
  async removeProperty(
    testCaseId: number, 
    name: string
  ): Promise<void> {
    await this.client.authenticatedCall(
      'TestCase.remove_property', 
      [testCaseId, name]
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
   * Get test case history
   */
  async history(testCaseId: number): Promise<any[]> {
    return await this.client.authenticatedCall<any[]>(
      'TestCase.history', 
      [testCaseId]
    );
  }

  /**
   * Add notification CC to test case
   */
  async addNotificationCC(
    testCaseId: number, 
    userIds: number[]
  ): Promise<void> {
    await this.client.authenticatedCall(
      'TestCase.add_notification_cc', 
      [testCaseId, userIds]
    );
  }

  /**
   * Get notification CC list for test case
   */
  async getNotificationCC(testCaseId: number): Promise<number[]> {
    return await this.client.authenticatedCall<number[]>(
      'TestCase.get_notification_cc', 
      [testCaseId]
    );
  }

  /**
   * Remove notification CC from test case
   */
  async removeNotificationCC(
    testCaseId: number, 
    userIds: number[]
  ): Promise<void> {
    await this.client.authenticatedCall(
      'TestCase.remove_notification_cc', 
      [testCaseId, userIds]
    );
  }

  /**
   * Get sortkeys for test cases
   */
  async sortkeys(): Promise<any> {
    return await this.client.authenticatedCall('TestCase.sortkeys');
  }
} 
