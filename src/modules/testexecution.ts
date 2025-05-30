import { KiwiClient } from '../client';
import { 
  TestExecution, 
  TestExecutionFilter,
  Comment,
  Property
} from '../types';

/**
 * Test Execution API module
 */
export class TestExecutionAPI {
  constructor(private client: KiwiClient) {}

  /**
   * Filter test executions
   */
  async filter(query: TestExecutionFilter = {}): Promise<TestExecution[]> {
    return await this.client.authenticatedCall<TestExecution[]>(
      'TestExecution.filter', 
      [query]
    );
  }

  /**
   * Update a test execution
   */
  async update(
    executionId: number, 
    updateData: Partial<TestExecution>
  ): Promise<TestExecution> {
    return await this.client.authenticatedCall<TestExecution>(
      'TestExecution.update', 
      [executionId, updateData]
    );
  }

  /**
   * Remove/delete a test execution
   */
  async remove(executionId: number): Promise<void> {
    await this.client.authenticatedCall('TestExecution.remove', [executionId]);
  }

  /**
   * Add a comment to test execution
   */
  async addComment(executionId: number, comment: string): Promise<Comment> {
    return await this.client.authenticatedCall<Comment>(
      'TestExecution.add_comment', 
      [executionId, comment]
    );
  }

  /**
   * Get comments for test execution
   */
  async getComments(executionId: number): Promise<Comment[]> {
    return await this.client.authenticatedCall<Comment[]>(
      'TestExecution.get_comments', 
      [executionId]
    );
  }

  /**
   * Remove a comment from test execution
   */
  async removeComment(executionId: number, commentId: number): Promise<void> {
    await this.client.authenticatedCall(
      'TestExecution.remove_comment', 
      [executionId, commentId]
    );
  }

  /**
   * Add a link to test execution
   */
  async addLink(
    executionId: number, 
    linkData: { url: string; name?: string; is_defect?: boolean }
  ): Promise<any> {
    return await this.client.authenticatedCall(
      'TestExecution.add_link', 
      [executionId, linkData]
    );
  }

  /**
   * Get links for test execution
   */
  async getLinks(executionId: number): Promise<any[]> {
    return await this.client.authenticatedCall<any[]>(
      'TestExecution.get_links', 
      [executionId]
    );
  }

  /**
   * Remove a link from test execution
   */
  async removeLink(executionId: number, linkId: number): Promise<void> {
    await this.client.authenticatedCall(
      'TestExecution.remove_link', 
      [executionId, linkId]
    );
  }

  /**
   * Get properties of test execution
   */
  async properties(executionId: number): Promise<Property[]> {
    return await this.client.authenticatedCall<Property[]>(
      'TestExecution.properties', 
      [executionId]
    );
  }

  /**
   * Get test execution history
   */
  async history(executionId: number): Promise<any[]> {
    return await this.client.authenticatedCall<any[]>(
      'TestExecution.history', 
      [executionId]
    );
  }
} 
