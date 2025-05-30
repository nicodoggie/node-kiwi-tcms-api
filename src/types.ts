/**
 * Kiwi TCMS API Type Definitions
 */

export interface KiwiConfig {
  baseUrl: string;
  username?: string;
  password?: string;
  token?: string;
  timeout?: number;
  headers?: { [key: string]: string };
  cloudflareClientId?: string;
  cloudflareClientSecret?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  classification_id: number;
  classification?: Classification;
}

export interface Classification {
  id: number;
  name: string;
}

export interface Component {
  id: number;
  name: string;
  product_id: number;
  initial_owner_id: number;
  initial_qa_contact_id: number;
  description: string;
  product?: Product;
}

export interface Version {
  id: number;
  value: string;
  product_id: number;
  product?: Product;
}

export interface Build {
  id: number;
  name: string;
  version_id: number;
  version?: Version;
  is_active: boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  product_id: number;
  product?: Product;
}

export interface Priority {
  id: number;
  value: string;
  is_active: boolean;
}

export interface TestCaseStatus {
  id: number;
  name: string;
  description: string;
  is_confirmed: boolean;
}

export interface TestCase {
  id: number;
  summary: string;
  text: string;
  setup: string;
  breakdown: string;
  case_status_id: number;
  category_id: number;
  priority_id: number;
  author_id: number;
  default_tester_id: number;
  reviewer_id: number;
  create_date: string;
  is_automated: boolean;
  script: string;
  arguments: string;
  extra_link: string;
  requirement: string;
  notes: string;
}

export interface TestPlan {
  id: number;
  name: string;
  text: string;
  create_date: string;
  is_active: boolean;
  extra_link: string;
  product_version_id: number;
  author_id: number;
  type_id: number;
  parent_id?: number;
}

export interface PlanType {
  id: number;
  name: string;
  description: string;
}

export interface TestRun {
  id: number;
  summary: string;
  notes: string;
  plan_id: number;
  build_id: number;
  manager_id: number;
  default_tester_id: number;
  start_date: string;
  stop_date?: string;
  planned_start?: string;
  planned_stop?: string;
}

export interface TestExecution {
  id: number;
  assignee_id: number;
  tested_by_id?: number;
  case_text_version: number;
  sortkey: number;
  run_id: number;
  case_id: number;
  status_id: number;
  build_id: number;
  start_date?: string;
  stop_date?: string;
}

export interface TestExecutionStatus {
  id: number;
  name: string;
  weight: number;
  icon: string;
  color: string;
}

export interface Bug {
  id: number;
  summary: string;
  reporter: string;
  assignee: string;
  bug_id: string;
  case_run_id: number;
  build_id: number;
  system_id: number;
}

export interface Environment {
  id: number;
  name: string;
  description: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Attachment {
  id: number;
  file_name: string;
  stored_name: string;
  create_date: string;
  mime_type: string;
}

export interface Comment {
  id: number;
  object_pk: string;
  user_name: string;
  user_email: string;
  submit_date: string;
  comment: string;
  site_id: number;
  is_public: boolean;
  is_removed: boolean;
}

export interface Property {
  name: string;
  value: string;
}

// Filter interfaces for queries
export interface FilterOptions {
  [key: string]: any;
}

export interface TestCaseFilter extends FilterOptions {
  id?: number;
  summary?: string;
  summary__startswith?: string;
  summary__contains?: string;
  case_status_id?: number;
  category_id?: number;
  priority_id?: number;
  author_id?: number;
  default_tester_id?: number;
  is_automated?: boolean;
}

export interface TestPlanFilter extends FilterOptions {
  id?: number;
  name?: string;
  name__startswith?: string;
  name__contains?: string;
  is_active?: boolean;
  product_version_id?: number;
  author_id?: number;
  type_id?: number;
}

export interface TestRunFilter extends FilterOptions {
  id?: number;
  summary?: string;
  summary__startswith?: string;
  summary__contains?: string;
  plan_id?: number;
  build_id?: number;
  manager_id?: number;
}

export interface TestExecutionFilter extends FilterOptions {
  id?: number;
  run_id?: number;
  case_id?: number;
  status_id?: number;
  assignee_id?: number;
  tested_by_id?: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
} 
