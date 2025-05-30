# Node.js Kiwi TCMS API Wrapper

THIS WAS VIBE-CODED! I just needed something fast. USE AT YOUR OWN RISK!

A comprehensive Node.js/TypeScript wrapper for the [Kiwi TCMS](https://kiwitcms.org/) 
XML-RPC API. This library provides a modern, type-safe interface for interacting 
with Kiwi TCMS test management system.

## Features

- 🚀 **Full API Coverage**: Complete implementation of all Kiwi TCMS RPC methods
- 🔒 **Type Safety**: Comprehensive TypeScript types for all API entities
- 🔄 **Auto-Authentication**: Automatic session management and re-authentication
- 🎯 **Modern Async/Await**: Promise-based API with async/await support
- 📚 **Well Documented**: Extensive JSDoc comments and usage examples
- 🛡️ **Error Handling**: Robust error handling with descriptive messages
- 🔧 **Configurable**: Flexible configuration options for different environments

## Installation

```bash
npm install node-kiwi-tcms
# or
yarn add node-kiwi-tcms
```

## Quick Start

```typescript
import { KiwiTCMS } from 'node-kiwi-tcms';

// Initialize the client
const kiwi = new KiwiTCMS({
  baseUrl: 'https://your-kiwi-instance.com',
  username: 'your-username',
  password: 'your-password'
});

// Authenticate (optional - done automatically on first API call)
await kiwi.login();

// Get all test cases
const testCases = await kiwi.testCase.filter();

// Create a new test plan
const testPlan = await kiwi.testPlan.create({
  name: 'My Test Plan',
  text: 'Description of the test plan',
  product_version_id: 1,
  author_id: 1,
  type_id: 1
});

// Add test cases to the plan
await kiwi.testPlan.addCase(testPlan.id, testCases[0].id);

// Create a test run
const testRun = await kiwi.testRun.create({
  summary: 'My Test Run',
  plan_id: testPlan.id,
  build_id: 1,
  manager_id: 1,
  default_tester_id: 1
});

console.log('Test run created:', testRun);
```

## Configuration

```typescript
interface KiwiConfig {
  baseUrl: string;                    // Kiwi TCMS instance URL
  username?: string;                  // Username for authentication
  password?: string;                  // Password for authentication
  token?: string;                     // API token (alternative to username/password)
  timeout?: number;                   // Request timeout in milliseconds (default: 30000)
  headers?: { [key: string]: string }; // Custom HTTP headers
  cloudflareClientId?: string;        // Cloudflare Access Client ID
  cloudflareClientSecret?: string;    // Cloudflare Access Client Secret
}
```

### Cloudflare Access Support

If your Kiwi TCMS instance is protected by Cloudflare Access, you can use 
service tokens to bypass the authentication. You'll need both the Client ID 
and Client Secret from your Cloudflare Access service token:

```typescript
const kiwi = new KiwiTCMS({
  baseUrl: 'https://kiwi.protected-by-cloudflare.com',
  username: 'your-username',
  password: 'your-password',
  cloudflareClientId: 'your-client-id.access',
  cloudflareClientSecret: 'your-client-secret'
});
```

### Custom Headers

You can add custom HTTP headers to all requests:

```typescript
const kiwi = new KiwiTCMS({
  baseUrl: 'https://your-kiwi-instance.com',
  username: 'your-username',
  password: 'your-password',
  headers: {
    'X-Custom-Header': 'custom-value',
    'Authorization': 'Bearer your-api-token'
  }
});

// Or set headers after creation (requires new client instance)
kiwi.getClient().setHeader('X-New-Header', 'new-value');
```

### Advanced Authentication

For advanced authentication scenarios, you can use custom headers:

```typescript
// Service token authentication
const kiwi = new KiwiTCMS({
  baseUrl: 'https://your-kiwi-instance.com',
  headers: {
    'Authorization': 'Token your-service-token',
    'X-API-Key': 'your-api-key'
  }
});

// Skip username/password login if using service tokens
kiwi.getClient().setSessionId('your-service-token');

// Cloudflare Access with service token and API authentication
const kiwiWithBoth = new KiwiTCMS({
  baseUrl: 'https://protected-kiwi.example.com',
  cloudflareClientId: 'your-cf-client-id.access',
  cloudflareClientSecret: 'your-cf-client-secret',
  headers: {
    'Authorization': 'Token your-kiwi-api-token'
  }
});
```

## API Reference

### Core Test Management

#### Test Cases

```typescript
// Filter test cases
const testCases = await kiwi.testCase.filter({
  summary__contains: 'login'
});

// Create a test case
const testCase = await kiwi.testCase.create({
  summary: 'Test user login',
  text: 'Verify user can log in successfully',
  case_status_id: 1,
  category_id: 1,
  priority_id: 1,
  author_id: 1,
  default_tester_id: 1
});

// Update a test case
await kiwi.testCase.update(testCase.id, {
  summary: 'Updated test summary'
});

// Add tags, components, comments
await kiwi.testCase.addTag(testCase.id, 'smoke-test');
await kiwi.testCase.addComponent(testCase.id, 1);
await kiwi.testCase.addComment(testCase.id, 'This is a comment');
```

#### Test Plans

```typescript
// Create test plan
const plan = await kiwi.testPlan.create({
  name: 'Release Test Plan',
  text: 'Test plan for version 1.0',
  product_version_id: 1,
  author_id: 1,
  type_id: 1
});

// Add/remove test cases
await kiwi.testPlan.addCase(plan.id, testCase.id);
await kiwi.testPlan.removeCase(plan.id, testCase.id);

// Manage tags and attachments
await kiwi.testPlan.addTag(plan.id, 'release-1.0');
await kiwi.testPlan.addAttachment(plan.id, 'spec.pdf', base64Content);
```

#### Test Runs

```typescript
// Create test run
const run = await kiwi.testRun.create({
  summary: 'Smoke Test Run',
  plan_id: plan.id,
  build_id: 1,
  manager_id: 1,
  default_tester_id: 1
});

// Add test cases and manage execution
await kiwi.testRun.addCase(run.id, testCase.id);
const executions = await kiwi.testRun.getCases(run.id);
```

#### Test Executions

```typescript
// Update test execution status
await kiwi.testExecution.update(execution.id, {
  status_id: 2, // Pass
  tested_by_id: 1,
  stop_date: new Date().toISOString()
});

// Add comments and links
await kiwi.testExecution.addComment(execution.id, 'Test passed successfully');
await kiwi.testExecution.addLink(execution.id, {
  url: 'https://bug-tracker.com/bug/123',
  name: 'Related Bug',
  is_defect: true
});
```

### Management Entities

```typescript
// Products and builds
const products = await kiwi.product.filter();
const builds = await kiwi.build.filter({ version_id: 1 });

// Components and categories
const components = await kiwi.component.filter({ product_id: 1 });
const categories = await kiwi.category.filter({ product_id: 1 });

// Users and environments
const users = await kiwi.user.filter({ is_active: true });
const environments = await kiwi.environment.filter();

// Priorities and statuses
const priorities = await kiwi.priority.filter();
const statuses = await kiwi.testCaseStatus.filter();
```

### Advanced Features

#### Field Lookups (Django-style)

```typescript
// Use Django field lookups for complex filtering
const recentCases = await kiwi.testCase.filter({
  'create_date__gte': '2023-01-01',
  'summary__icontains': 'api',
  'author__username__startswith': 'john'
});
```

#### Error Handling

```typescript
try {
  const testCase = await kiwi.testCase.create({
    summary: 'Test case'
    // Missing required fields
  });
} catch (error) {
  console.error('API Error:', error.message);
}
```

#### Session Management

```typescript
// Manual session management
const sessionId = await kiwi.login();
console.log('Session ID:', sessionId);

// Check authentication status
if (kiwi.isAuthenticated()) {
  console.log('Client is authenticated');
}

// Logout
await kiwi.logout();
```

## TypeScript Support

This library is written in TypeScript and provides comprehensive type definitions:

```typescript
import { 
  KiwiTCMS, 
  TestCase, 
  TestPlan, 
  TestRun,
  TestCaseFilter,
  KiwiConfig 
} from 'node-kiwi-tcms';

// Full type safety
const config: KiwiConfig = {
  baseUrl: 'https://kiwi.example.com',
  username: 'user',
  password: 'pass'
};

const kiwi = new KiwiTCMS(config);

// Typed responses
const testCases: TestCase[] = await kiwi.testCase.filter();
const testPlan: TestPlan = await kiwi.testPlan.create({
  name: 'Typed Test Plan',
  product_version_id: 1,
  author_id: 1,
  type_id: 1
});
```

## Requirements

- Node.js 18+ 
- Kiwi TCMS instance with XML-RPC API enabled

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Links

- [Kiwi TCMS Official Documentation](https://kiwitcms.readthedocs.io/)
- [Kiwi TCMS RPC API Reference](https://kiwitcms.readthedocs.io/en/latest/modules/tcms.rpc.api.html)
- [XML-RPC Specification](http://xmlrpc.com/spec.html)
