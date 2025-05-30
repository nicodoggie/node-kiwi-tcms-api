/**
 * Node.js wrapper for Kiwi TCMS XML-RPC API
 * 
 * This library provides a comprehensive TypeScript/JavaScript interface
 * for interacting with Kiwi TCMS test management system.
 * 
 * @see https://kiwitcms.readthedocs.io/en/latest/modules/tcms.rpc.api.html
 */

import { KiwiTCMS as KiwiTCMSClass } from './kiwi-tcms';

// Main client
export { KiwiTCMS } from './kiwi-tcms';
export { KiwiClient } from './client';

// Type definitions
export * from './types';

// Extended types with permalinks
export type {
  TestCaseWithPermalinks,
  TestPlanWithPermalinks,
  TestRunWithPermalinks,
  BugWithPermalinks,
  TestCaseFilterOptions,
  TestPlanFilterOptions,
  TestRunFilterOptions,
  FilterOutputOptions
} from './types';

// API modules
export { AuthAPI } from './modules/auth';
export { TestCaseAPI } from './modules/testcase';
export { TestPlanAPI } from './modules/testplan';
export { TestRunAPI } from './modules/testrun';
export { TestExecutionAPI } from './modules/testexecution';
export {
  ProductAPI,
  BuildAPI,
  ComponentAPI,
  ClassificationAPI,
  CategoryAPI,
  VersionAPI,
  PlanTypeAPI,
  PriorityAPI,
  TestCaseStatusAPI,
  TestExecutionStatusAPI,
  EnvironmentAPI,
  TagAPI,
  UserAPI,
  BugAPI
} from './modules/management';
export {
  AttachmentAPI,
  MarkdownAPI,
  KiwiUtilsAPI,
  UrlAPI
} from './modules/utilities';

// Default export
export default KiwiTCMSClass; 
