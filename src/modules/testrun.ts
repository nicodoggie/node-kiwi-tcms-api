import { KiwiClient } from '../client';
import { 
  TestRun, 
  TestRunFilter,
  TestCase,
  TestExecution,
  Property,
  Attachment,
  Tag,
  User
} from '../types';

/**
 * Test Run API module
 */
export class TestRunAPI {
  constructor(private client: KiwiClient) {}

  /**
   * Create a new test run
   */
  async create(testRunData: Partial<TestRun>): Promise<TestRun> {
    return await this.client.authenticatedCall<TestRun>(
      'TestRun.create', 
      [testRunData]
    );
  }

  /**
   * Filter test runs
   */
  async filter(query: TestRunFilter = {}): Promise<TestRun[]> {
    return await this.client.authenticatedCall<TestRun[]>(
      'TestRun.filter', 
      [query]
    );
  }

  /**
   * Update a test run
   */
  async update(
    testRunId: number, 
    updateData: Partial<TestRun>
  ): Promise<TestRun> {
    return await this.client.authenticatedCall<TestRun>(
      'TestRun.update', 
      [testRunId, updateData]
    );
  }

  /**
   * Remove/delete a test run
   */
  async remove(testRunId: number): Promise<void> {
    await this.client.authenticatedCall('TestRun.remove', [testRunId]);
  }

  /**
   * Add a test case to test run
   */
  async addCase(testRunId: number, testCaseId: number): Promise<TestExecution> {
    return await this.client.authenticatedCall<TestExecution>(
      'TestRun.add_case', 
      [testRunId, testCaseId]
    );
  }

  /**
   * Remove a test case from test run
   */
  async removeCase(testRunId: number, testCaseId: number): Promise<void> {
    await this.client.authenticatedCall(
      'TestRun.remove_case', 
      [testRunId, testCaseId]
    );
  }

  /**
   * Get test cases in test run
   */
  async getCases(testRunId: number): Promise<TestCase[]> {
    return await this.client.authenticatedCall<TestCase[]>(
      'TestRun.get_cases', 
      [testRunId]
    );
  }

  /**
   * Add a tag to test run
   */
  async addTag(testRunId: number, tag: string): Promise<Tag> {
    return await this.client.authenticatedCall<Tag>(
      'TestRun.add_tag', 
      [testRunId, tag]
    );
  }

  /**
   * Remove a tag from test run
   */
  async removeTag(testRunId: number, tag: string): Promise<void> {
    await this.client.authenticatedCall(
      'TestRun.remove_tag', 
      [testRunId, tag]
    );
  }

  /**
   * Add an attachment to test run
   */
  async addAttachment(
    testRunId: number, 
    filename: string, 
    b64content: string
  ): Promise<Attachment> {
    return await this.client.authenticatedCall<Attachment>(
      'TestRun.add_attachment', 
      [testRunId, filename, b64content]
    );
  }

  /**
   * Add CC (carbon copy) user to test run
   */
  async addCC(testRunId: number, userId: number): Promise<User> {
    return await this.client.authenticatedCall<User>(
      'TestRun.add_cc', 
      [testRunId, userId]
    );
  }

  /**
   * Remove CC user from test run
   */
  async removeCC(testRunId: number, userId: number): Promise<void> {
    await this.client.authenticatedCall(
      'TestRun.remove_cc', 
      [testRunId, userId]
    );
  }

  /**
   * Get properties of test run
   */
  async properties(testRunId: number): Promise<Property[]> {
    return await this.client.authenticatedCall<Property[]>(
      'TestRun.properties', 
      [testRunId]
    );
  }

  /**
   * Annotate test executions with properties
   */
  async annotateExecutionsWithProperties(
    testRunId: number, 
    executions: TestExecution[]
  ): Promise<TestExecution[]> {
    return await this.client.authenticatedCall<TestExecution[]>(
      'TestRun.annotate_executions_with_properties', 
      [testRunId, executions]
    );
  }
} 
