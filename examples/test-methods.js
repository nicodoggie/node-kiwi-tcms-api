const { KiwiTCMS } = require('../dist/index');

const config = {
  baseUrl: 'https://kiwi.splitmedialabs.com/xml-rpc/', // Keep the exact trailing slash!
  cloudflareClientId: 'test.access',
  cloudflareClientSecret: 'test', // Use the working secret!
  username: 'username',
  password: 'password'
};

console.log('🧪 Testing with the EXACT curl configuration that works...\n');

// Test different endpoint configurations, starting with the exact redirect target
const testEndpoints = [
  'https://kiwi.splitmedialabs.com/xml-rpc/',  // EXACT redirect target (with slash!)
];

async function testEndpoint(baseUrl) {
  console.log(`\n🔍 Testing endpoint: ${baseUrl}`);
  console.log('=' .repeat(60));
  
  try {
    const kiwi = new KiwiTCMS({ ...config, baseUrl });
    
    console.log('\n📡 Testing system.listMethods...');
    const methods = await kiwi.listMethods();
    console.log(`✅ Success! Found ${methods.length} methods.`);
    console.log('First few methods:', methods.slice(0, 5));
    
    if (methods.includes('Kiwi.version')) {
      console.log('\n🔍 Testing Kiwi.version...');
      const version = await kiwi.getVersion(); 
      console.log(`✅ Kiwi TCMS Version: ${version}`);
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    if (error.code) console.error(`   Code: ${error.code}`);
    if (error.statusCode) console.error(`   Status: ${error.statusCode}`);
    if (error.body) {
      console.error(`   Body snippet: ${error.body.substring(0, 200)}...`);
    }
    return false;
  }
}

async function main() {
  console.log('🎯 Testing with EXACT curl configuration...');
  console.log(`Using Client ID: ${config.cloudflareClientId}`);
  console.log(`Using Client Secret: ${config.cloudflareClientSecret.substring(0, 10)}...`);
  console.log(`Target URL: ${config.baseUrl}`);
  console.log('📝 Note: Using the same secret and URL as the working curl command');
  
  let successCount = 0;
  
  for (const endpoint of testEndpoints) {
    const success = await testEndpoint(endpoint);
    if (success) {
      successCount++;
      console.log('\n🎉 SUCCESS! This endpoint works!');
      console.log(`✅ Working URL: ${endpoint}`);
      console.log('\n💡 You can use this URL in your baseUrl configuration.\n');
      break; // Stop on first success
    }
  }
  
  if (successCount === 0) {
    console.log('\n❌ Still not working. Let\'s analyze what\'s different:');
    console.log('   1. Check if the exact same request works with curl');
    console.log('   2. Compare request headers between curl and xmlrpc client');
    console.log('   3. Look for differences in HTTP/1.1 vs HTTP/2');
    console.log('   4. Check if xmlrpc client has different SSL/TLS behavior');
  } else {
    console.log('🎉 Connection successful! The redirect issue has been resolved.');
    console.log('🔧 Update your configuration to use the working URL above.');
  }
}

main().catch(console.error); 
