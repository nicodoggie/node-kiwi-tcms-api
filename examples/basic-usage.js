const { config } = require('dotenv');
config({ path: '.env' });

const { KiwiTCMS } = require('../dist/index');

async function basicUsageExample() {
  try {
    console.log('🚀 Basic Kiwi TCMS Usage Example\n');

    // Initialize client (without Cloudflare for now)
    const kiwi = new KiwiTCMS({
      baseUrl: process.env.KIWI_BASE_URL,
      username: process.env.KIWI_USERNAME,    // Replace with your username
      password: process.env.KIWI_PASSWORD,    // Replace with your password
    });

    // Test basic connectivity
    console.log('📡 Testing connection...');
    const methods = await kiwi.client.testConnection();
    console.log(`✅ Connected! Found ${methods.length} available methods\n`);

    console.log(methods);
    
    // Test authentication
    console.log('🔐 Testing authentication...');
    const sessionId = await kiwi.client.login();
    console.log(`✅ Authenticated! Session ID: ${sessionId}\n`);

    // Test list products
    console.log('🧪 Fetching products...');
    const products = await kiwi.product.filter({});
    console.log(`📋 Found ${products.length} products`);
    console.log(products);

    // Test product filter
    console.log('🧪 Filtering products...');
    const filteredProducts = await kiwi.product.filter({
      name: 'VCam.ai',
    },
    {
      includePermalinks: true
    });
    console.log(`📋 Found ${filteredProducts.length} products`);
    console.log(JSON.stringify(filteredProducts, null, 2));
    
    // Test fetch test plans by product
    console.log('🧪 Fetching test plans by product...');
    const vcamTestPlans = await kiwi.testPlan.filter({
      product_id: filteredProducts[0].id
    }, {
      includePermalinks: true
    });
    console.log(`📋 Found ${vcamTestPlans.length} test plans`);
    console.log(JSON.stringify(vcamTestPlans, null, 2));

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
      console.log(`   ID: ${testPlans[0].id}`);
      console.log(`   Name: ${testPlans[0].name}`);
      console.log(`   Type: ${testPlans[0].type_name || testPlans[0].type}`);
      console.log(`   Parent: ${testPlans[0].parent_id || testPlans[0].parent}`);
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
