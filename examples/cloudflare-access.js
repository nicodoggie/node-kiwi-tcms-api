const { KiwiTCMS } = require('../dist/index');

/**
 * Example: Using Kiwi TCMS with Cloudflare Access protection
 * 
 * This example shows how to connect to a Kiwi TCMS instance
 * that is protected by Cloudflare Access using service tokens.
 */

async function cloudflareAccessExample() {
  // Method 1: Using the built-in Cloudflare Access credentials support
  const kiwi1 = new KiwiTCMS({
    baseUrl: 'https://kiwi.protected-domain.com',
    username: 'your-username',
    password: 'your-password',
    cloudflareClientId: 'your-client-id.access',
    cloudflareClientSecret: 'your-client-secret'
  });

  // Method 2: Using custom headers for Cloudflare Access
  const kiwi2 = new KiwiTCMS({
    baseUrl: 'https://kiwi.protected-domain.com',
    username: 'your-username', 
    password: 'your-password',
    headers: {
      'CF-Access-Client-Id': 'your-client-id.access',
      'CF-Access-Client-Secret': 'your-client-secret'
    }
  });

  // Method 3: Using custom headers with other authentication methods
  const kiwi3 = new KiwiTCMS({
    baseUrl: 'https://kiwi.protected-domain.com',
    headers: {
      'CF-Access-Client-Id': 'your-client-id.access',
      'CF-Access-Client-Secret': 'your-client-secret',
      'Authorization': 'Token your-api-token',
      'X-Custom-Auth': 'custom-auth-header'
    }
  });

  try {
    console.log('Testing Cloudflare Access protected Kiwi TCMS...');
    
    // Test the connection
    const version = await kiwi1.getVersion();
    console.log('Kiwi TCMS Version:', version);

    // Get some data to verify access
    const products = await kiwi1.product.filter();
    console.log('Products found:', products.length);

    const testCases = await kiwi1.testCase.filter({ id: 1 });
    console.log('Test cases found:', testCases.length);

    console.log('✅ Successfully connected through Cloudflare Access!');

  } catch (error) {
    console.error('❌ Error connecting to Kiwi TCMS:', error.message);
    
    if (error.message.includes('403') || error.message.includes('Forbidden')) {
      console.error('This might be a Cloudflare Access authentication issue.');
      console.error('Check your service token credentials.');
    } else if (error.message.includes('502') || error.message.includes('Bad Gateway')) {
      console.error('This might be a Cloudflare configuration issue.');
      console.error('Check if the service token has access to the application.');
    }
  } finally {
    await kiwi1.logout();
  }
}

/**
 * Example: Dynamic header management for rotating tokens
 */
async function dynamicHeadersExample() {
  const kiwi = new KiwiTCMS({
    baseUrl: 'https://kiwi.protected-domain.com',
    username: 'your-username',
    password: 'your-password'
  });

  try {
    // Initially set Cloudflare Access credentials
    kiwi.getClient().setCloudflareAccess('initial-client-id', 'initial-client-secret');
    
    // Note: Due to xmlrpc client limitations, header changes require
    // creating a new client instance
    
    // For rotating credentials, you would do:
    const newKiwi = new KiwiTCMS({
      baseUrl: 'https://kiwi.protected-domain.com',
      username: 'your-username',
      password: 'your-password',
      cloudflareClientId: 'new-client-id.access',
      cloudflareClientSecret: 'new-client-secret'
    });
    
    console.log('Cloudflare Access credentials rotated successfully');
    
  } catch (error) {
    console.error('Error in dynamic headers example:', error.message);
  }
}

// Run the examples
async function main() {
  console.log('=== Cloudflare Access Example ===');
  await cloudflareAccessExample();
  
  console.log('\n=== Dynamic Headers Example ===');
  await dynamicHeadersExample();
}

main().catch(console.error); 
 