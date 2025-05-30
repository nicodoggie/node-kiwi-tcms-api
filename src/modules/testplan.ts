import { KiwiClient } from '../client';
import { 
  TestPlan, 
  TestPlanFilter, 
  TestCase,
  Attachment,
  Tag
} from '../types';

/**
 * Test Plan API module
 */
export class TestPlanAPI {
  constructor(private client: KiwiClient) {}

  /**
   * Create a new test plan
   */
  async create(testPlanData: Partial<TestPlan>): Promise<TestPlan> {
    return await this.client.authenticatedCall<TestPlan>(
      'TestPlan.create', 
      [testPlanData]
    );
  }

  /**
   * Filter test plans
   */
  async filter(query: TestPlanFilter = {}): Promise<TestPlan[]> {
    return await this.client.authenticatedCall<TestPlan[]>(
      'TestPlan.filter', 
      [query]
    );
  }

  /**
   * Update a test plan
   */
  async update(
    testPlanId: number, 
    updateData: Partial<TestPlan>
  ): Promise<TestPlan> {
    return await this.client.authenticatedCall<TestPlan>(
      'TestPlan.update', 
      [testPlanId, updateData]
    );
  }

  /**
   * Add a test case to test plan
   */
  async addCase(testPlanId: number, testCaseId: number): Promise<void> {
    await this.client.authenticatedCall(
      'TestPlan.add_case', 
      [testPlanId, testCaseId]
    );
  }

  /**
   * Remove a test case from test plan
   */
  async removeCase(testPlanId: number, testCaseId: number): Promise<void> {
    await this.client.authenticatedCall(
      'TestPlan.remove_case', 
      [testPlanId, testCaseId]
    );
  }

  /**
   * Update test case order in test plan
   */
  async updateCaseOrder(
    testPlanId: number, 
    caseOrders: { case_id: number; sortkey: number }[]
  ): Promise<void> {
    await this.client.authenticatedCall(
      'TestPlan.update_case_order', 
      [testPlanId, caseOrders]
    );
  }

  /**
   * Add a tag to test plan
   */
  async addTag(testPlanId: number, tag: string): Promise<Tag> {
    return await this.client.authenticatedCall<Tag>(
      'TestPlan.add_tag', 
      [testPlanId, tag]
    );
  }

  /**
   * Remove a tag from test plan
   */
  async removeTag(testPlanId: number, tag: string): Promise<void> {
    await this.client.authenticatedCall(
      'TestPlan.remove_tag', 
      [testPlanId, tag]
    );
  }

  /**
   * Add an attachment to test plan
   */
  async addAttachment(
    testPlanId: number, 
    filename: string, 
    b64content: string
  ): Promise<Attachment> {
    return await this.client.authenticatedCall<Attachment>(
      'TestPlan.add_attachment', 
      [testPlanId, filename, b64content]
    );
  }

  /**
   * List attachments for test plan
   */
  async listAttachments(testPlanId: number): Promise<Attachment[]> {
    return await this.client.authenticatedCall<Attachment[]>(
      'TestPlan.list_attachments', 
      [testPlanId]
    );
  }

  /**
   * Get test plan tree structure
   */
  async tree(testPlanId?: number): Promise<any> {
    const params = testPlanId ? [testPlanId] : [];
    return await this.client.authenticatedCall('TestPlan.tree', params);
  }
} 
