const { KiwiTCMS } = require('../dist/index');

async function basicUsageExample() {
  try {
    console.log('🚀 Basic Kiwi TCMS Usage Example\n');

    // Initialize client (without Cloudflare for now)
    const kiwi = new KiwiTCMS({
      baseUrl: 'https://kiwi.splitmedialabs.com/xml-rpc/',
      username: 'username',    // Replace with your username
      password: 'password',    // Replace with your password
    });

    // Test basic connectivity
    console.log('📡 Testing connection...');
    const methods = await kiwi.client.testConnection();
    console.log(`✅ Connected! Found ${methods.length} available methods\n`);

    // Test authentication
    console.log('🔐 Testing authentication...');
    const sessionId = await kiwi.client.login();
    console.log(`✅ Authenticated! Session ID: ${sessionId}\n`);

    // Test fetching test cases
    console.log('🧪 Fetching test cases...');
    const testCases = await kiwi.testCase.filter({});
    console.log(`📋 Found ${testCases.length} test cases`);
    
    if (testCases.length > 0) {
      console.log('\n📝 First test case:');
      console.log(`   ID: ${testCases[0].id}`);
      console.log(`   Summary: ${testCases[0].summary}`);
      console.log(`   Status: ${testCases[0].case_status_name || testCases[0].case_status}`);
    }

    // Test fetching test plans
    console.log('\n📊 Fetching test plans...');
    const testPlans = await kiwi.testPlan.filter({});
    console.log(`📋 Found ${testPlans.length} test plans`);
    
    if (testPlans.length > 0) {
      console.log('\n📋 First test plan:');
      console.log(`   ID: ${testPlans[0].plan_id}`);
      console.log(`   Name: ${testPlans[0].name}`);
      console.log(`   Type: ${testPlans[0].type_name || testPlans[0].type}`);
    }

    // Clean logout
    console.log('\n🔓 Logging out...');
    await kiwi.client.logout();
    console.log('✅ Logged out successfully');

    console.log('\n🎉 Example completed successfully!');

  } catch (error) {
    console.error('❌ Error in basic usage example:');
    console.error(error.message);
    
    // Additional debugging information
    if (error.message.includes('YOUR_USERNAME')) {
      console.error('\n💡 Please edit this file and replace YOUR_USERNAME and YOUR_PASSWORD with your actual credentials');
    }
  }
}

// Run the example
basicUsageExample(); 
