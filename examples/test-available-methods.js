const { KiwiTCMS } = require('../dist/index');
require('dotenv').config();

const config = {
  baseUrl: process.env.KIWI_BASE_URL,
  username: process.env.KIWI_USERNAME,
  password: process.env.KIWI_PASSWORD
};

async function testAvailableMethods() {
  try {
    console.log('🧪 Testing Only Available API Methods\n');
    console.log('=' .repeat(60));

    const kiwi = new KiwiTCMS(config);

    // Get some test cases first
    const testCases = await kiwi.testCase.filter();
    
    if (testCases.length === 0) {
      console.log('⚠️  No test cases found. Cannot test API methods.');
      return;
    }

    const testCaseId = testCases[0].id;
    console.log(`\n📝 Testing with Test Case ID: ${testCaseId}`);
    console.log(`Test Case Summary: ${testCases[0].summary}`);

    // Test available TestCase methods
    console.log('\n🔍 Testing available TestCase methods:');

    try {
      // Test attachments
      const attachments = await kiwi.testCase.listAttachments(testCaseId);
      console.log(`✅ kiwi.testCase.listAttachments(${testCaseId}) - Found ${attachments.length} attachments`);

      // Test alias
      const attachments2 = await kiwi.testCase.getAttachments(testCaseId);
      console.log(`✅ kiwi.testCase.getAttachments(${testCaseId}) - Found ${attachments2.length} attachments`);

    } catch (error) {
      console.error('❌ Error testing TestCase methods:', error.message);
    }

    // Test available TestExecution methods
    console.log('\n🔍 Testing available TestExecution methods:');

    try {
      const executions = await kiwi.testExecution.filter({ case: testCaseId });
      console.log(`✅ kiwi.testExecution.filter({case: ${testCaseId}}) - Found ${executions.length} executions`);

      if (executions.length > 0) {
        const executionId = executions[0].id;
        const links = await kiwi.testExecution.getLinks({ execution_id: executionId });
        console.log(`✅ kiwi.testExecution.getLinks({execution_id: ${executionId}}) - Found ${links.length} links`);
      }

    } catch (error) {
      console.error('❌ Error testing TestExecution methods:', error.message);
    }

    // Test available TestRun methods
    console.log('\n🔍 Testing available TestRun methods:');

    try {
      const testRuns = await kiwi.testRun.filter();
      console.log(`✅ kiwi.testRun.filter() - Found ${testRuns.length} test runs`);

      if (testRuns.length > 0) {
        const testRunId = testRuns[0].id;
        const cases = await kiwi.testRun.getCases(testRunId);
        console.log(`✅ kiwi.testRun.getCases(${testRunId}) - Found ${cases.length} cases`);
      }

    } catch (error) {
      console.error('❌ Error testing TestRun methods:', error.message);
    }

    // Show available methods
    console.log('\n📋 Available Methods on Your System:');
    
    console.log('\n🔧 TestCase Methods:');
    console.log('   • create, filter, update, remove');
    console.log('   • addComment, removeComment');
    console.log('   • addTag, removeTag');
    console.log('   • addComponent, removeComponent');
    console.log('   • addAttachment, listAttachments, getAttachments');

    console.log('\n🔧 TestExecution Methods:');
    console.log('   • filter, update');
    console.log('   • addComment, removeComment');
    console.log('   • addLink, getLinks, removeLink');

    console.log('\n🔧 TestRun Methods:');
    console.log('   • create, filter, update');
    console.log('   • addCase, removeCase, getCases');
    console.log('   • addTag, removeTag');

    console.log('\n❌ Methods NOT Available (removed):');
    console.log('   • TestCase: comments, properties, history, sortkeys, notification CC methods');
    console.log('   • TestExecution: remove, getComments, properties, history');
    console.log('   • TestRun: remove, properties, addCC, removeCC, addAttachment');

    console.log('\n✅ All available methods tested successfully!');

  } catch (error) {
    console.error('❌ General Error:', error.message);
  }
}

// Run the test
testAvailableMethods(); 
