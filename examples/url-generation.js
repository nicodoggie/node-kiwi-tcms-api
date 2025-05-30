const { KiwiTCMS } = require('../dist/index');

const config = {
  baseUrl: 'https://kiwi.splitmedialabs.com/xml-rpc/',
  cloudflareClientId: 'test.access',
  cloudflareClientSecret: 'test',
  username: 'your-username',
  password: 'your-password'
};

async function demonstrateUrlGeneration() {
  try {
    const kiwi = new KiwiTCMS(config);

    console.log('🔗 URL Generation and Slug Creation Examples\n');
    console.log('=' .repeat(60));

    // Generate permalinks for different entities
    console.log('\n📎 Permalink Generation:');
    console.log('Test Case URL:     ', kiwi.url.generateTestCaseUrl(123));
    console.log('Test Plan URL:     ', kiwi.url.generateTestPlanUrl(456));
    console.log('Test Run URL:      ', kiwi.url.generateTestRunUrl(789));
    console.log('Test Execution URL:', kiwi.url.generateTestExecutionUrl(789, 123));
    console.log('Bug Report URL:    ', kiwi.url.generateBugUrl(42));

    // Create URL-friendly slugs
    console.log('\n🏷️  Slug Creation:');
    const testCaseName = 'Test Login with Special Characters & Symbols!';
    const testPlanName = 'Authentication Test Plan (v2.1)';
    const bugTitle = 'Login form doesn\'t validate email properly';

    console.log('Original:          ', testCaseName);
    console.log('Slug:              ', kiwi.url.createSlug(testCaseName));
    console.log('');
    console.log('Original:          ', testPlanName);
    console.log('Slug:              ', kiwi.url.createSlug(testPlanName));
    console.log('');
    console.log('Original:          ', bugTitle);
    console.log('Slug:              ', kiwi.url.createSlug(bugTitle));

    // Generate short links with slugs
    console.log('\n🔗 Short Links with Slugs:');
    const testCaseSlug = kiwi.url.createSlug(testCaseName);
    const testPlanSlug = kiwi.url.createSlug(testPlanName);
    const bugSlug = kiwi.url.createSlug(bugTitle);

    console.log('Test Case Link:    ', kiwi.url.generateShortLink('case', 123, testCaseSlug));
    console.log('Test Plan Link:    ', kiwi.url.generateShortLink('plan', 456, testPlanSlug));
    console.log('Bug Report Link:   ', kiwi.url.generateShortLink('bug', 42, bugSlug));

    // Parse existing Kiwi TCMS URLs
    console.log('\n🔍 URL Parsing:');
    const testUrls = [
      'https://kiwi.splitmedialabs.com/case/123/',
      'https://kiwi.splitmedialabs.com/plan/456/authentication-test-plan',
      'https://kiwi.splitmedialabs.com/run/789/',
      'https://kiwi.splitmedialabs.com/bugs/42/login-form-bug',
      'https://invalid-url.com/test'
    ];

    testUrls.forEach(url => {
      const parsed = kiwi.url.parseKiwiUrl(url);
      console.log(`URL: ${url}`);
      console.log(`Parsed: ${parsed ? JSON.stringify(parsed) : 'null'}\n`);
    });

    // Demonstrate usage with actual API calls (if authenticated)
    console.log('📝 Real-world usage example:');
    console.log('');
    console.log('// After creating a test case');
    console.log('const testCase = await kiwi.testCase.create({');
    console.log('  summary: "Test user login functionality",');
    console.log('  // ... other properties');
    console.log('});');
    console.log('');
    console.log('// Generate a shareable URL');
    console.log('const slug = kiwi.url.createSlug(testCase.summary);');
    console.log('const permalink = kiwi.url.generateTestCaseUrl(testCase.id);');
    console.log('const shortLink = kiwi.url.generateShortLink("case", testCase.id, slug);');
    console.log('');
    console.log('console.log("Share this test case:", shortLink);');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the demonstration
demonstrateUrlGeneration(); 
