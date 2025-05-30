import { KiwiClient } from '../client';
import { 
  TestRun, 
  TestRunFilter,
  TestRunFilterOptions,
  TestRunWithPermalinks,
  FilterOutputOptions,
  TestCase,
  TestExecution,
  Tag
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
  async filter(query?: TestRunFilter): Promise<TestRun[]>;
  /**
   * Filter test runs with output options
   */
  async filter(query: TestRunFilter | undefined, options: FilterOutputOptions): Promise<TestRun[] | TestRunWithPermalinks[]>;
  async filter(query: TestRunFilter = {}, options?: FilterOutputOptions): Promise<TestRun[] | TestRunWithPermalinks[]> {
    const testRuns = await this.client.authenticatedCall<TestRun[]>(
      'TestRun.filter', 
      [query]
    );

    if (options?.includePermalinks) {
      // Get URL API instance from the main client
      const urlApi = this.getUrlApi();
      return urlApi.injectPermalinksArray('run', testRuns, 'summary');
    }

    return testRuns;
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
} 
