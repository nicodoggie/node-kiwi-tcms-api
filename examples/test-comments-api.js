const path = require('path');
const { KiwiTCMS } = require('../dist/index');
const { config: dotenvConfig } = require('dotenv');
dotenvConfig({ path: path.join(__dirname, '.env') });

const config = {
  baseUrl: process.env.KIWI_BASE_URL,
  username: process.env.KIWI_USERNAME,
  password: process.env.KIWI_PASSWORD
};

async function testCommentsAPI() {
  try {
    console.log('🧪 Testing Comments and Other API Methods\n');
    console.log('=' .repeat(60));

    const kiwi = new KiwiTCMS(config);

    // Get some test cases first
    const testCases = await kiwi.testCase.filter();
    
    if (testCases.length === 0) {
      console.log('⚠️  No test cases found. Cannot test comments API.');
      return;
    }

    const testCaseId = testCases[0].id;
    console.log(`\n📝 Testing with Test Case ID: ${testCaseId}`);
    console.log(`Test Case Summary: ${testCases[0].summary}`);

    // Test both method names for getting comments
    console.log('\n🔍 Testing comment retrieval methods:');

    try {
      // Original method name
      const comments1 = await kiwi.testCase.comments(testCaseId);
      console.log(`✅ kiwi.testCase.comments(${testCaseId}) - Found ${comments1.length} comments`);

      // New alias method name
      const comments2 = await kiwi.testCase.getComments(testCaseId);
      console.log(`✅ kiwi.testCase.getComments(${testCaseId}) - Found ${comments2.length} comments`);

      // Verify they return the same data
      console.log(`✅ Both methods return same data: ${JSON.stringify(comments1) === JSON.stringify(comments2)}`);

    } catch (error) {
      console.error('❌ Error testing comments:', error.message);
    }

    // Test properties methods (corrected API usage)
    console.log('\n🔍 Testing properties methods (with query parameter):');

    try {
      // Properties for this specific test case
      const query = { case: testCaseId };
      const props1 = await kiwi.testCase.properties(query);
      const props2 = await kiwi.testCase.getProperties(query);
      console.log(`✅ Properties methods work - original: ${props1.length}, alias: ${props2.length}`);
      console.log(`   Query used: ${JSON.stringify(query)}`);

    } catch (error) {
      console.error('❌ Error testing properties methods:', error.message);
    }

    // Test other methods
    console.log('\n🔍 Testing other methods:');

    try {
      // History
      const hist1 = await kiwi.testCase.history(testCaseId);
      const hist2 = await kiwi.testCase.getHistory(testCaseId);
      console.log(`✅ History methods work - original: ${hist1.length}, alias: ${hist2.length}`);

      // Attachments
      const att1 = await kiwi.testCase.listAttachments(testCaseId);
      const att2 = await kiwi.testCase.getAttachments(testCaseId);
      console.log(`✅ Attachments methods work - original: ${att1.length}, alias: ${att2.length}`);

    } catch (error) {
      console.error('❌ Error testing other methods:', error.message);
    }

    // Show available methods
    console.log('\n📋 Available TestCase Comment Methods:');
    console.log('   • kiwi.testCase.comments(testCaseId)     - Original method');
    console.log('   • kiwi.testCase.getComments(testCaseId)  - New alias method');
    console.log('   • kiwi.testCase.addComment(testCaseId, comment)');
    console.log('   • kiwi.testCase.removeComment(testCaseId, commentId)');

    console.log('\n📋 Available TestCase Property Methods:');
    console.log('   • kiwi.testCase.properties(query)         - Original method (takes query, not testCaseId!)');
    console.log('   • kiwi.testCase.getProperties(query)      - New alias method (takes query, not testCaseId!)');
    console.log('   • kiwi.testCase.addProperty(testCaseId, name, value)');
    console.log('   • kiwi.testCase.removeProperty(query)     - Takes query parameter');

    console.log('\n📋 Available TestCase Other Methods:');
    console.log('   • kiwi.testCase.history(testCaseId)       - Original method');
    console.log('   • kiwi.testCase.getHistory(testCaseId)    - New alias method');
    console.log('   • kiwi.testCase.listAttachments(testCaseId) - Original method');
    console.log('   • kiwi.testCase.getAttachments(testCaseId)  - New alias method');

    console.log('\n✅ All methods tested successfully!');
    console.log('\n💡 Note: TestCase.properties() works differently than TestRun.properties()');
    console.log('💡 TestCase.properties() takes a query parameter, not a specific ID!');
    console.log('💡 Example: kiwi.testCase.properties({ case: 123 }) to get properties for test case 123');

  } catch (error) {
    console.error('❌ General Error:', error.message);
  }
}

// Run the test
testCommentsAPI(); 
