const path = require('path');
const { KiwiTCMS } = require('../dist/index');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const config = {
  baseUrl: process.env.KIWI_BASE_URL,
  username: process.env.KIWI_USERNAME,
  password: process.env.KIWI_PASSWORD
};

async function demonstrateParentPlans() {
  try {
    console.log('🔗 Working with Parent Plan Relationships\n');
    console.log('=' .repeat(60));

    const kiwi = new KiwiTCMS(config);
    await kiwi.login();

    // Get some test plans
    const testPlans = await kiwi.testPlan.filter({});
    console.log(`Found ${testPlans.length} test plans\n`);

    // Demonstrate the clean null-based API
    console.log('📋 Analyzing Parent Relationships:\n');
    
    let topLevelPlans = 0;
    let childPlans = 0;

    for (let i = 0; i < Math.min(testPlans.length, 10); i++) {
      const plan = testPlans[i];
      
      // Clean, idiomatic null checks - no utility functions needed!
      if (plan.parent_id === null) {
        topLevelPlans++;
        console.log(`🔝 Top-level plan: "${plan.name}" (ID: ${plan.id})`);
      } else {
        childPlans++;
        console.log(`🔗 Child plan: "${plan.name}" (ID: ${plan.id}) → Parent: ${plan.parent_id}`);
        
        // Easy to work with parent information
        if (plan.parent) {
          console.log(`   Parent name: "${plan.parent}"`);
        }
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Top-level plans: ${topLevelPlans}`);
    console.log(`   Child plans: ${childPlans}`);

    // Demonstrate building hierarchies
    console.log(`\n🌳 Building Plan Hierarchy:`);
    
    const planMap = new Map();
    testPlans.forEach(plan => planMap.set(plan.id, plan));
    
    const hierarchy = [];
    testPlans.forEach(plan => {
      if (plan.parent_id === null) {
        // Top-level plan
        const children = testPlans.filter(child => child.parent_id === plan.id);
        hierarchy.push({
          ...plan,
          children: children
        });
      }
    });

    console.log(`Found ${hierarchy.length} top-level plans with hierarchies:`);
    hierarchy.slice(0, 3).forEach(topPlan => {
      console.log(`\n📁 ${topPlan.name}`);
      if (topPlan.children.length > 0) {
        topPlan.children.forEach(child => {
          console.log(`   ├── ${child.name}`);
        });
      } else {
        console.log(`   └── (no child plans)`);
      }
    });

    // Demonstrate URL generation for parent plans
    console.log(`\n🔗 URLs for Parent Plans:`);
    const planWithParent = testPlans.find(plan => plan.parent_id !== null);
    if (planWithParent) {
      console.log(`Child plan: ${kiwi.url.generateTestPlanUrl(planWithParent.id)}`);
      console.log(`Parent plan: ${kiwi.url.generateTestPlanUrl(planWithParent.parent_id)}`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

demonstrateParentPlans();