import { KiwiClient } from './client';
import { KiwiConfig } from './types';

// Import all API modules
import { AuthAPI } from './modules/auth';
import { TestCaseAPI } from './modules/testcase';
import { TestPlanAPI } from './modules/testplan';
import { TestRunAPI } from './modules/testrun';
import { TestExecutionAPI } from './modules/testexecution';
import {
  ProductAPI,
  BuildAPI,
  ComponentAPI,
  ClassificationAPI,
  CategoryAPI,
  VersionAPI,
  PlanTypeAPI,
  PriorityAPI,
  TestCaseStatusAPI,
  TestExecutionStatusAPI,
  EnvironmentAPI,
  TagAPI,
  UserAPI,
  BugAPI
} from './modules/management';
import {
  AttachmentAPI,
  MarkdownAPI,
  KiwiUtilsAPI,
  UrlAPI
} from './modules/utilities';

/**
 * Main Kiwi TCMS API client
 * 
 * This is the primary interface for interacting with Kiwi TCMS.
 * It provides access to all API modules through a single client instance.
 * 
 * @example
 * ```typescript
 * import { KiwiTCMS } from 'node-kiwi-tcms';
 * 
 * const kiwi = new KiwiTCMS({
 *   baseUrl: 'https://your-kiwi-instance.com',
 *   username: 'your-username',
 *   password: 'your-password'
 * });
 * 
 * // Get all test cases
 * const testCases = await kiwi.testCase.filter();
 * 
 * // Create a new test plan
 * const testPlan = await kiwi.testPlan.create({
 *   name: 'My Test Plan',
 *   product_version_id: 1,
 *   author_id: 1,
 *   type_id: 1
 * });
 * ```
 */
export class KiwiTCMS {
  private client: KiwiClient;

  // Core test management modules
  public readonly auth: AuthAPI;
  public readonly testCase: TestCaseAPI;
  public readonly testPlan: TestPlanAPI;
  public readonly testRun: TestRunAPI;
  public readonly testExecution: TestExecutionAPI;

  // Management modules
  public readonly product: ProductAPI;
  public readonly build: BuildAPI;
  public readonly component: ComponentAPI;
  public readonly classification: ClassificationAPI;
  public readonly category: CategoryAPI;
  public readonly version: VersionAPI;
  public readonly planType: PlanTypeAPI;
  public readonly priority: PriorityAPI;
  public readonly testCaseStatus: TestCaseStatusAPI;
  public readonly testExecutionStatus: TestExecutionStatusAPI;
  public readonly environment: EnvironmentAPI;
  public readonly tag: TagAPI;
  public readonly user: UserAPI;
  public readonly bug: BugAPI;

  // Utility modules
  public readonly attachment: AttachmentAPI;
  public readonly markdown: MarkdownAPI;
  public readonly utils: KiwiUtilsAPI;
  public readonly url: UrlAPI;

  constructor(config: KiwiConfig) {
    this.client = new KiwiClient(config);

    // Initialize core test management modules
    this.auth = new AuthAPI(this.client);
    this.testCase = new TestCaseAPI(this.client);
    this.testPlan = new TestPlanAPI(this.client);
    this.testRun = new TestRunAPI(this.client);
    this.testExecution = new TestExecutionAPI(this.client);

    // Initialize management modules
    this.product = new ProductAPI(this.client);
    this.build = new BuildAPI(this.client);
    this.component = new ComponentAPI(this.client);
    this.classification = new ClassificationAPI(this.client);
    this.category = new CategoryAPI(this.client);
    this.version = new VersionAPI(this.client);
    this.planType = new PlanTypeAPI(this.client);
    this.priority = new PriorityAPI(this.client);
    this.testCaseStatus = new TestCaseStatusAPI(this.client);
    this.testExecutionStatus = new TestExecutionStatusAPI(this.client);
    this.environment = new EnvironmentAPI(this.client);
    this.tag = new TagAPI(this.client);
    this.user = new UserAPI(this.client);
    this.bug = new BugAPI(this.client);

    // Initialize utility modules
    this.attachment = new AttachmentAPI(this.client);
    this.markdown = new MarkdownAPI(this.client);
    this.utils = new KiwiUtilsAPI(this.client);
    this.url = new UrlAPI(this.client);
  }

  /**
   * Authenticate with the Kiwi TCMS server
   * 
   * @returns Session ID
   */
  async login(): Promise<string> {
    return await this.client.login();
  }

  /**
   * Logout from the Kiwi TCMS server
   */
  async logout(): Promise<void> {
    await this.client.logout();
  }

  /**
   * Check if client is authenticated
   */
  isAuthenticated(): boolean {
    return this.client.isAuthenticated();
  }

  /**
   * Get current session ID
   */
  getSessionId(): string | undefined {
    return this.client.getSessionId();
  }

  /**
   * Set session ID manually (useful for token-based authentication)
   */
  setSessionId(sessionId: string): void {
    this.client.setSessionId(sessionId);
  }

  /**
   * Get Kiwi TCMS server version
   */
  async getVersion(): Promise<string> {
    return await this.client.getVersion();
  }

  /**
   * List available XML-RPC methods (useful for debugging)
   */
  async listMethods(): Promise<string[]> {
    return await this.client.listMethods();
  }

  /**
   * Get the underlying XML-RPC client for advanced usage
   */
  getClient(): KiwiClient {
    return this.client;
  }
} 
