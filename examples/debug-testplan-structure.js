const path = require('path');
const { KiwiTCMS } = require('../dist/index');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const config = {
  baseUrl: process.env.KIWI_BASE_URL,
  username: process.env.KIWI_USERNAME,
  password: process.env.KIWI_PASSWORD
};

async function debugTestPlanStructure() {
  try {
    console.log('🔍 Debugging TestPlan Structure\n');
    console.log('=' .repeat(60));

    const kiwi = new KiwiTCMS(config);
    await kiwi.login();

    // Get some test plans
    const testPlans = await kiwi.testPlan.filter({});
    console.log(`Found ${testPlans.length} test plans\n`);

    if (testPlans.length > 0) {
      const testPlan = testPlans[0];
      
      console.log('📋 First Test Plan Analysis:');
      console.log(`ID: ${testPlan.id}`);
      console.log(`Name: ${testPlan.name}`);
      
      // Inspect parent_id field
      console.log('\n🔍 Parent ID Analysis:');
      console.log('Raw parent_id:', testPlan.parent_id);
      console.log('Type of parent_id:', typeof testPlan.parent_id);
      console.log('JSON.stringify parent_id:', JSON.stringify(testPlan.parent_id, null, 2));
      
      // Inspect parent field  
      console.log('\n🔍 Parent Analysis:');
      console.log('Raw parent:', testPlan.parent);
      console.log('Type of parent:', typeof testPlan.parent);
      console.log('JSON.stringify parent:', JSON.stringify(testPlan.parent, null, 2));
      
      // Show all keys in the testPlan object
      console.log('\n🗝️  All TestPlan Keys:');
      Object.keys(testPlan).forEach(key => {
        const value = testPlan[key];
        const type = typeof value;
        const isObject = type === 'object' && value !== null;
        console.log(`  ${key}: ${type}${isObject ? ' (object)' : ''}`);
        
        if (isObject && key.includes('parent')) {
          console.log(`    Details: ${JSON.stringify(value, null, 4)}`);
        }
      });
      
      // Check if there are any plans with actual parent relationships
      console.log('\n🔍 Looking for plans with parent relationships...');
      for (let i = 0; i < Math.min(testPlans.length, 5); i++) {
        const plan = testPlans[i];
        const hasParentId = plan.parent_id !== null && plan.parent_id !== undefined;
        const hasParent = plan.parent !== null && plan.parent !== undefined;
        
        if (hasParentId || hasParent) {
          console.log(`\n📋 Plan ${plan.id} "${plan.name}":`);
          if (hasParentId) {
            console.log(`  parent_id: ${JSON.stringify(plan.parent_id)}`);
          }
          if (hasParent) {
            console.log(`  parent: ${JSON.stringify(plan.parent)}`);
          }
        }
      }
      
      // Try to extract useful information
      console.log('\n💡 Extracting Useful Information:');
      if (testPlan.parent_id && typeof testPlan.parent_id === 'object') {
        console.log('Parent ID appears to be an object. Possible fields:');
        Object.keys(testPlan.parent_id).forEach(key => {
          console.log(`  ${key}: ${testPlan.parent_id[key]}`);
        });
      }
      
      if (testPlan.parent && typeof testPlan.parent === 'object') {
        console.log('Parent appears to be an object. Possible fields:');
        Object.keys(testPlan.parent).forEach(key => {
          console.log(`  ${key}: ${testPlan.parent[key]}`);
        });
      }
      
    } else {
      console.log('⚠️  No test plans found to analyze');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugTestPlanStructure(); 
