const { KiwiTCMS } = require('../dist/index');
const { config: dotenvConfig } = require('dotenv');
dotenvConfig({ path: '.env' });

const config = {
  baseUrl: process.env.KIWI_BASE_URL,
  username: process.env.KIWI_USERNAME,
  password: process.env.KIWI_PASSWORD
};

async function debugPermalinks() {
  try {
    console.log('🔍 Debugging Permalink Generation\n');
    console.log('=' .repeat(60));

    // First, let's check the configuration
    console.log('\n📊 Configuration Check:');
    console.log('Base URL:', config.baseUrl);
    console.log('Username:', config.username);
    console.log('Password:', config.password ? '***' : 'undefined');

    if (!config.baseUrl) {
      console.error('❌ ERROR: KIWI_BASE_URL is not set in environment variables');
      console.log('\n💡 Create a .env file with:');
      console.log('KIWI_BASE_URL=https://your-kiwi-instance.com/xml-rpc/');
      console.log('KIWI_USERNAME=your-username');
      console.log('KIWI_PASSWORD=your-password');
      return;
    }

    const kiwi = new KiwiTCMS(config);

    // Test the URL API directly first
    console.log('\n🔧 Testing URL API directly:');
    
    // Test basic URL generation
    const testCaseUrl = kiwi.url.generateTestCaseUrl(123);
    const testPlanUrl = kiwi.url.generateTestPlanUrl(456);
    
    console.log('Test Case URL:', testCaseUrl);
    console.log('Test Plan URL:', testPlanUrl);
    
    // Test slug creation
    const testSlug = kiwi.url.createSlug('Test Login with Special Characters!');
    console.log('Test Slug:', testSlug);
    
    // Test short link generation
    const shortLink = kiwi.url.generateShortLink('case', 123, testSlug);
    console.log('Short Link:', shortLink);

    if (testCaseUrl === 'undefined/case/123/' || testCaseUrl.includes('undefined')) {
      console.error('\n❌ ERROR: Base URL is being resolved as undefined');
      console.log('This suggests the client.getConfig().baseUrl is not working properly');
      
      // Check client config directly
      const clientConfig = kiwi.getClient().getConfig();
      console.log('\n🔍 Client Config Debug:');
      console.log('Client baseUrl:', clientConfig.baseUrl);
      console.log('Client config keys:', Object.keys(clientConfig));
      return;
    }

    // Now test with actual API calls
    console.log('\n📡 Testing with API calls:');
    
    try {
      // Try to get a small number of test cases
      const basicTestCases = await kiwi.testCase.filter();
      console.log(`✅ Retrieved ${basicTestCases.length} test cases`);
      
      if (basicTestCases.length > 0) {
        const firstCase = basicTestCases[0];
        console.log('\n🔍 First test case details:');
        console.log('ID:', firstCase.id);
        console.log('Summary:', firstCase.summary);
        console.log('Has permalink property?', 'permalink' in firstCase);
        
        // Now test with permalink injection
        console.log('\n✨ Testing permalink injection:');
        const enhancedTestCases = await kiwi.testCase.filter({}, { 
          includePermalinks: true 
        });
        
        if (enhancedTestCases.length > 0) {
          const enhancedCase = enhancedTestCases[0];
          console.log('\n📎 Enhanced case details:');
          console.log('ID:', enhancedCase.id);
          console.log('Summary:', enhancedCase.summary);
          console.log('Permalink:', enhancedCase.permalink);
          console.log('Short Link:', enhancedCase.shortLink);
          console.log('Slug:', enhancedCase.slug);
          
          // Check if any are undefined
          if (!enhancedCase.permalink || !enhancedCase.shortLink || !enhancedCase.slug) {
            console.error('\n❌ ERROR: Some permalink properties are undefined!');
            console.log('Permalink defined?', !!enhancedCase.permalink);
            console.log('Short Link defined?', !!enhancedCase.shortLink);
            console.log('Slug defined?', !!enhancedCase.slug);
            
            // Debug the name field used for slug generation
            console.log('\n🔍 Debugging slug generation:');
            console.log('Summary for slug:', enhancedCase.summary);
            console.log('Summary type:', typeof enhancedCase.summary);
            console.log('Summary length:', enhancedCase.summary?.length);
          } else {
            console.log('\n✅ SUCCESS: All permalink properties are generated correctly!');
          }
        }
      } else {
        console.log('⚠️  No test cases found. Cannot test permalink injection.');
      }
      
    } catch (apiError) {
      console.error('\n❌ API Error:', apiError.message);
      console.log('\n💡 Make sure your credentials are correct and you can connect to Kiwi TCMS.');
    }

  } catch (error) {
    console.error('❌ General Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the debugging
debugPermalinks(); 
