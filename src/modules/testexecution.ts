import { KiwiClient } from '../client';
import { 
  TestExecution, 
  TestExecutionFilter,
  Comment
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
   * Add a comment to test execution
   */
  async addComment(executionId: number, comment: string): Promise<Comment> {
    return await this.client.authenticatedCall<Comment>(
      'TestExecution.add_comment', 
      [executionId, comment]
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
  async getLinks(query: any = {}): Promise<any[]> {
    return await this.client.authenticatedCall<any[]>(
      'TestExecution.get_links', 
      [query]
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
} 
