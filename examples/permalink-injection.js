const { KiwiTCMS } = require('../dist/index');
const { config: dotenvConfig } = require('dotenv');
dotenvConfig({ path: '.env' });

const config = {
  baseUrl: process.env.KIWI_BASE_URL,
  username: process.env.KIWI_USERNAME,
  password: process.env.KIWI_PASSWORD
};

async function demonstratePermalinkInjection() {
  try {
    const kiwi = new KiwiTCMS(config);

    console.log('🔗 Automatic Permalink Injection Examples\n');
    console.log('=' .repeat(60));

    // Example 1: Basic filter vs. filter with permalinks
    console.log('\n📝 Test Case Filtering:\n');

    // Basic filter (no permalinks)
    console.log('🔍 Basic filter (no permalinks):');
    const basicTestCases = await kiwi.testCase.filter({ 
      summary__contains: 'login' 
    });
    
    if (basicTestCases.length > 0) {
      const firstCase = basicTestCases[0];
      console.log(`   ID: ${firstCase.id}`);
      console.log(`   Summary: ${firstCase.summary}`);
      console.log(`   Has permalink? ${firstCase.permalink ? 'Yes' : 'No'}`);
    }

    // Filter with automatic permalink injection
    console.log('\n✨ Filter with permalink injection:');
    const enhancedTestCases = await kiwi.testCase.filter({ 
      summary__contains: 'login'
    }, { 
      includePermalinks: true 
    });
    
    if (enhancedTestCases.length > 0) {
      const firstCase = enhancedTestCases[0];
      console.log(`   ID: ${firstCase.id}`);
      console.log(`   Summary: ${firstCase.summary}`);
      console.log(`   Permalink: ${firstCase.permalink}`);
      console.log(`   Short Link: ${firstCase.shortLink}`);
      console.log(`   Slug: ${firstCase.slug}`);
    }

    // Example 2: Test Plan filtering with permalinks
    console.log('\n📋 Test Plan Filtering with Permalinks:\n');
    
    const testPlans = await kiwi.testPlan.filter({}, {
      includePermalinks: true
    });

    if (testPlans.length > 0) {
      console.log(`Found ${testPlans.length} test plans with permalinks:`);
      testPlans.slice(0, 3).forEach((plan, index) => {
        console.log(`\n   ${index + 1}. ${plan.name}`);
        console.log(`      Permalink: ${plan.permalink}`);
        console.log(`      Short Link: ${plan.shortLink}`);
        console.log(`      Slug: ${plan.slug}`);
      });
    }

    // Example 3: Test Run filtering with permalinks
    console.log('\n🏃 Test Run Filtering with Permalinks:\n');
    
    const testRuns = await kiwi.testRun.filter({}, {
      includePermalinks: true
    });

    if (testRuns.length > 0) {
      console.log(`Found ${testRuns.length} test runs with permalinks:`);
      testRuns.slice(0, 2).forEach((run, index) => {
        console.log(`\n   ${index + 1}. ${run.summary}`);
        console.log(`      Permalink: ${run.permalink}`);
        console.log(`      Short Link: ${run.shortLink}`);
        console.log(`      Slug: ${run.slug}`);
      });
    }

    // Example 4: TypeScript usage demonstration
    console.log('\n💡 TypeScript Usage Example:');
    console.log(`
// TypeScript with proper typing:
import { KiwiTCMS, TestCaseWithPermalinks, FilterOutputOptions } from 'node-kiwi-tcms';

const kiwi = new KiwiTCMS(config);

// Basic filter - returns TestCase[]
const basicCases = await kiwi.testCase.filter({ 
  is_automated: true 
});

// Enhanced filter - returns TestCaseWithPermalinks[]
const enhancedCases = await kiwi.testCase.filter({ 
  is_automated: true
}, { 
  includePermalinks: true 
});

// Now you can access permalink properties with full type safety
enhancedCases.forEach(testCase => {
  console.log('Test case:', testCase.summary);
  console.log('Share link:', testCase.shortLink);
  console.log('Permalink:', testCase.permalink);
  console.log('Slug:', testCase.slug);
});
`);

    // Example 5: Real-world workflow
    console.log('\n🌟 Real-world Workflow Example:');
    console.log(`
// After running a test suite, generate a report with shareable links
const failedCases = await kiwi.testCase.filter({
  case_status_id: 3 // Failed status
}, {
  includePermalinks: true
});

const report = failedCases.map(testCase => ({
  name: testCase.summary,
  shareableLink: testCase.shortLink,
  detailsUrl: testCase.permalink
}));

// Send report via email, Slack, etc.
console.log('Failed test cases:', report);
`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 This example requires a working connection to Kiwi TCMS.');
    console.log('   Update the configuration with your actual credentials.');
  }
}

// Run the demonstration
demonstratePermalinkInjection(); 
