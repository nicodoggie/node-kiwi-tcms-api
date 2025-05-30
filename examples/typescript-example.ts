import { 
  KiwiTCMS, 
  TestCase, 
  TestPlan, 
  TestRun,
  TestExecution,
  KiwiConfig 
} from '../src';

// Configuration with environment variables
const config: KiwiConfig = {
  baseUrl: process.env.KIWI_BASE_URL || 'https://kiwi.example.com',
  username: process.env.KIWI_USERNAME,
  password: process.env.KIWI_PASSWORD,
  timeout: 30000
};

async function advancedExample() {
  const kiwi = new KiwiTCMS(config);

  try {
    // Create a complete test workflow
    
    // 1. Create a test case
    const testCase: TestCase = await kiwi.testCase.create({
      summary: 'API Integration Test',
      text: 'Test API endpoints for user authentication',
      setup: 'Ensure test environment is running',
      breakdown: 'Clean up test data',
      case_status_id: 1,
      category_id: 1,
      priority_id: 2,
      author_id: 1,
      default_tester_id: 1,
      is_automated: true,
      script: 'test_user_auth.py',
      notes: 'Created via API'
    });

    console.log('Created test case:', testCase.id);

    // 2. Add tags and components
    await kiwi.testCase.addTag(testCase.id, 'api');
    await kiwi.testCase.addTag(testCase.id, 'authentication');
    await kiwi.testCase.addComponent(testCase.id, 1);

    // 3. Create a test plan
    const testPlan: TestPlan = await kiwi.testPlan.create({
      name: 'API Test Plan v2.0',
      text: 'Comprehensive API testing for version 2.0',
      product_version_id: 1,
      author_id: 1,
      type_id: 1,
      is_active: true
    });

    console.log('Created test plan:', testPlan.id);

    // 4. Add test case to plan
    await kiwi.testPlan.addCase(testPlan.id, testCase.id);

    // 5. Create a test run
    const testRun: TestRun = await kiwi.testRun.create({
      summary: 'Sprint 10 API Tests',
      notes: 'Testing new authentication endpoints',
      plan_id: testPlan.id,
      build_id: 1,
      manager_id: 1,
      default_tester_id: 1,
      start_date: new Date().toISOString()
    });

    console.log('Created test run:', testRun.id);

    // 6. Get test executions and update status
    const executions: TestExecution[] = await kiwi.testExecution.filter({
      run_id: testRun.id
    });

    if (executions.length > 0) {
      const execution = executions[0];
      
      // Update execution status to PASS
      await kiwi.testExecution.update(execution.id, {
        status_id: 2, // PASS
        tested_by_id: 1,
        stop_date: new Date().toISOString()
      });

      // Add a comment
      await kiwi.testExecution.addComment(
        execution.id, 
        'All API endpoints working correctly'
      );

      console.log('Updated test execution:', execution.id);
    }

    // 7. Query with complex filters
    const recentTestCases = await kiwi.testCase.filter({
      'create_date__gte': '2024-01-01',
      'summary__icontains': 'api',
      'is_automated': true,
      'priority__value': 'High'
    });

    console.log(`Found ${recentTestCases.length} recent automated API tests`);

    // 8. Bulk operations example
    const allTestCases = await kiwi.testCase.filter({ 
      category_id: 1 
    });

    for (const tc of allTestCases.slice(0, 5)) { // Limit to first 5
      await kiwi.testCase.addTag(tc.id, 'bulk-tagged');
    }

    console.log('Added bulk tags to test cases');

  } catch (error) {
    console.error('Error in advanced example:', error);
  } finally {
    // Always logout
    await kiwi.logout();
    console.log('Logged out successfully');
  }
}

// Error handling example
async function errorHandlingExample() {
  const kiwi = new KiwiTCMS(config);

  try {
    // This will fail due to missing required fields
    await kiwi.testCase.create({
      summary: 'Incomplete test case'
      // Missing required fields like case_status_id, etc.
    });
  } catch (error) {
    console.error('Expected error caught:', error.message);
  }

  // Session management example
  if (!kiwi.isAuthenticated()) {
    const sessionId = await kiwi.login();
    console.log('Authenticated with session:', sessionId);
  }

  await kiwi.logout();
}

// Run examples
async function main() {
  console.log('=== Advanced TypeScript Example ===');
  await advancedExample();
  
  console.log('\n=== Error Handling Example ===');
  await errorHandlingExample();
}

main().catch(console.error); 
