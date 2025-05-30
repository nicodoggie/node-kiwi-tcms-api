const { KiwiTCMS } = require('../dist/index');
require('dotenv').config();

/**
 * Legacy-Safe Example for Kiwi TCMS 8.7 and older
 * 
 * This script only uses API methods confirmed to work on older Kiwi TCMS versions.
 * Perfect for testing compatibility with legacy installations.
 */

const config = {
  baseUrl: process.env.KIWI_BASE_URL,
  username: process.env.KIWI_USERNAME,
  password: process.env.KIWI_PASSWORD
};

async function legacySafeExample() {
  try {
    console.log('🔧 Kiwi TCMS 8.7+ Legacy-Safe Example\n');
    console.log('=' .repeat(60));

    const kiwi = new KiwiTCMS(config);

    // Test basic connectivity and authentication
    console.log('🔐 Testing authentication...');
    await kiwi.login();
    console.log('✅ Successfully authenticated');

    // Test basic TestCase operations (safe on 8.7+)
    console.log('\n📋 Testing TestCase operations:');
    
    // Filter test cases
    const testCases = await kiwi.testCase.filter({ }); // Get first few
    console.log(`✅ Found ${testCases.length} test cases`);
    
    if (testCases.length > 0) {
      const testCase = testCases[0];
      console.log(`   📝 Sample: "${testCase.summary}" (ID: ${testCase.id})`);
      
      // Test attachments (safe on 8.7+)
      const attachments = await kiwi.testCase.listAttachments(testCase.id);
      console.log(`   📎 Attachments: ${attachments.length}`);
      
      // Test adding a comment (safe on 8.7+)
      const comment = await kiwi.testCase.addComment(testCase.id, 
        `Test comment from Node.js API - ${new Date().toISOString()}`);
      console.log(`   💬 Added comment: ${comment.id}`);
    }

    // Test TestExecution operations (safe on 8.7+)
    console.log('\n⚡ Testing TestExecution operations:');
    
    const executions = await kiwi.testExecution.filter({ });
    console.log(`✅ Found ${executions.length} test executions`);
    
    if (executions.length > 0) {
      const execution = executions[0];
      console.log(`   🏃 Sample execution ID: ${execution.id}`);
      
      // Test links (safe on 8.7+)
      const links = await kiwi.testExecution.getLinks({ execution_id: execution.id });
      console.log(`   🔗 Links: ${links.length}`);
    }

    // Test TestRun operations (safe on 8.7+)
    console.log('\n🚀 Testing TestRun operations:');
    
    const testRuns = await kiwi.testRun.filter({ });
    console.log(`✅ Found ${testRuns.length} test runs`);
    
    if (testRuns.length > 0) {
      const testRun = testRuns[0];
      console.log(`   🏃 Sample: "${testRun.summary}" (ID: ${testRun.id})`);
      
      // Test getting cases in run (safe on 8.7+)
      const casesInRun = await kiwi.testRun.getCases(testRun.id);
      console.log(`   📋 Cases in run: ${casesInRun.length}`);
    }

    // Test basic management entities (safe on 8.7+)
    console.log('\n📊 Testing management entities:');
    
    const products = await kiwi.product.filter();
    console.log(`✅ Products: ${products.length}`);
    
    const builds = await kiwi.build.filter();
    console.log(`✅ Builds: ${builds.length}`);
    
    const priorities = await kiwi.priority.filter();
    console.log(`✅ Priorities: ${priorities.length}`);

    // Test URL generation (always works - client-side)
    console.log('\n🔗 Testing URL generation:');
    if (testCases.length > 0) {
      const testCaseUrl = kiwi.url.generateTestCaseUrl(testCases[0].id);
      const slug = kiwi.url.createSlug(testCases[0].summary);
      const shortLink = kiwi.url.generateShortLink('case', testCases[0].id, slug);
      
      console.log(`✅ Test case URL: ${testCaseUrl}`);
      console.log(`✅ Short link: ${shortLink}`);
    }

    console.log('\n🎉 All legacy-safe operations completed successfully!');
    console.log('\n💡 Your Kiwi TCMS 8.7 installation supports all tested methods.');
    console.log('💡 For newer features, consider upgrading to Kiwi TCMS 10.x or later.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 This might indicate:');
    console.log('   • Authentication issues');
    console.log('   • Network connectivity problems'); 
    console.log('   • Even older Kiwi TCMS version than 8.7');
    console.log('   • Missing permissions for your user account');
  }
}

// Run the legacy-safe example
legacySafeExample(); 
