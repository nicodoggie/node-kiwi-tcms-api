import { KiwiClient } from '../client';
import { 
  Product, 
  Build, 
  Component, 
  Classification,
  Category,
  Version,
  PlanType,
  Priority,
  TestCaseStatus,
  TestExecutionStatus,
  Environment,
  Property,
  Tag,
  User,
  Bug,
  FilterOptions
} from '../types';

/**
 * Product API module
 */
export class ProductAPI {
  constructor(private client: KiwiClient) {}

  async create(productData: Partial<Product>): Promise<Product> {
    return await this.client.authenticatedCall<Product>(
      'Product.create', 
      [productData]
    );
  }

  async filter(query: FilterOptions = {}): Promise<Product[]> {
    return await this.client.authenticatedCall<Product[]>(
      'Product.filter', 
      [query]
    );
  }
}

/**
 * Build API module
 */
export class BuildAPI {
  constructor(private client: KiwiClient) {}

  async create(buildData: Partial<Build>): Promise<Build> {
    return await this.client.authenticatedCall<Build>(
      'Build.create', 
      [buildData]
    );
  }

  async filter(query: FilterOptions = {}): Promise<Build[]> {
    return await this.client.authenticatedCall<Build[]>(
      'Build.filter', 
      [query]
    );
  }

  async update(buildId: number, updateData: Partial<Build>): Promise<Build> {
    return await this.client.authenticatedCall<Build>(
      'Build.update', 
      [buildId, updateData]
    );
  }
}

/**
 * Component API module
 */
export class ComponentAPI {
  constructor(private client: KiwiClient) {}

  async create(componentData: Partial<Component>): Promise<Component> {
    return await this.client.authenticatedCall<Component>(
      'Component.create', 
      [componentData]
    );
  }

  async filter(query: FilterOptions = {}): Promise<Component[]> {
    return await this.client.authenticatedCall<Component[]>(
      'Component.filter', 
      [query]
    );
  }

  async update(
    componentId: number, 
    updateData: Partial<Component>
  ): Promise<Component> {
    return await this.client.authenticatedCall<Component>(
      'Component.update', 
      [componentId, updateData]
    );
  }
}

/**
 * Classification API module
 */
export class ClassificationAPI {
  constructor(private client: KiwiClient) {}

  async create(
    classificationData: Partial<Classification>
  ): Promise<Classification> {
    return await this.client.authenticatedCall<Classification>(
      'Classification.create', 
      [classificationData]
    );
  }

  async filter(query: FilterOptions = {}): Promise<Classification[]> {
    return await this.client.authenticatedCall<Classification[]>(
      'Classification.filter', 
      [query]
    );
  }
}

/**
 * Category API module
 */
export class CategoryAPI {
  constructor(private client: KiwiClient) {}

  async create(categoryData: Partial<Category>): Promise<Category> {
    return await this.client.authenticatedCall<Category>(
      'Category.create', 
      [categoryData]
    );
  }

  async filter(query: FilterOptions = {}): Promise<Category[]> {
    return await this.client.authenticatedCall<Category[]>(
      'Category.filter', 
      [query]
    );
  }
}

/**
 * Version API module
 */
export class VersionAPI {
  constructor(private client: KiwiClient) {}

  async create(versionData: Partial<Version>): Promise<Version> {
    return await this.client.authenticatedCall<Version>(
      'Version.create', 
      [versionData]
    );
  }

  async filter(query: FilterOptions = {}): Promise<Version[]> {
    return await this.client.authenticatedCall<Version[]>(
      'Version.filter', 
      [query]
    );
  }
}

/**
 * Plan Type API module
 */
export class PlanTypeAPI {
  constructor(private client: KiwiClient) {}

  async create(planTypeData: Partial<PlanType>): Promise<PlanType> {
    return await this.client.authenticatedCall<PlanType>(
      'PlanType.create', 
      [planTypeData]
    );
  }

  async filter(query: FilterOptions = {}): Promise<PlanType[]> {
    return await this.client.authenticatedCall<PlanType[]>(
      'PlanType.filter', 
      [query]
    );
  }
}

/**
 * Priority API module
 */
export class PriorityAPI {
  constructor(private client: KiwiClient) {}

  async filter(query: FilterOptions = {}): Promise<Priority[]> {
    return await this.client.authenticatedCall<Priority[]>(
      'Priority.filter', 
      [query]
    );
  }
}

/**
 * Test Case Status API module
 */
export class TestCaseStatusAPI {
  constructor(private client: KiwiClient) {}

  async filter(query: FilterOptions = {}): Promise<TestCaseStatus[]> {
    return await this.client.authenticatedCall<TestCaseStatus[]>(
      'TestCaseStatus.filter', 
      [query]
    );
  }
}

/**
 * Test Execution Status API module
 */
export class TestExecutionStatusAPI {
  constructor(private client: KiwiClient) {}

  async filter(query: FilterOptions = {}): Promise<TestExecutionStatus[]> {
    return await this.client.authenticatedCall<TestExecutionStatus[]>(
      'TestExecutionStatus.filter', 
      [query]
    );
  }
}

/**
 * Environment API module
 */
export class EnvironmentAPI {
  constructor(private client: KiwiClient) {}

  async create(envData: Partial<Environment>): Promise<Environment> {
    return await this.client.authenticatedCall<Environment>(
      'Environment.create', 
      [envData]
    );
  }

  async filter(query: FilterOptions = {}): Promise<Environment[]> {
    return await this.client.authenticatedCall<Environment[]>(
      'Environment.filter', 
      [query]
    );
  }

  async addProperty(
    envId: number, 
    name: string, 
    value: string
  ): Promise<void> {
    await this.client.authenticatedCall(
      'Environment.add_property', 
      [envId, name, value]
    );
  }

  async properties(envId: number): Promise<Property[]> {
    return await this.client.authenticatedCall<Property[]>(
      'Environment.properties', 
      [envId]
    );
  }

  async removeProperty(envId: number, name: string): Promise<void> {
    await this.client.authenticatedCall(
      'Environment.remove_property', 
      [envId, name]
    );
  }
}

/**
 * Tag API module
 */
export class TagAPI {
  constructor(private client: KiwiClient) {}

  async filter(query: FilterOptions = {}): Promise<Tag[]> {
    return await this.client.authenticatedCall<Tag[]>('Tag.filter', [query]);
  }
}

/**
 * User API module
 */
export class UserAPI {
  constructor(private client: KiwiClient) {}

  async filter(query: FilterOptions = {}): Promise<User[]> {
    return await this.client.authenticatedCall<User[]>('User.filter', [query]);
  }

  async update(userId: number, updateData: Partial<User>): Promise<User> {
    return await this.client.authenticatedCall<User>(
      'User.update', 
      [userId, updateData]
    );
  }

  async joinGroup(userId: number, groupName: string): Promise<void> {
    await this.client.authenticatedCall(
      'User.join_group', 
      [userId, groupName]
    );
  }

  async addAttachment(
    userId: number, 
    filename: string, 
    b64content: string
  ): Promise<any> {
    return await this.client.authenticatedCall(
      'User.add_attachment', 
      [userId, filename, b64content]
    );
  }
}

/**
 * Bug API module
 */
export class BugAPI {
  constructor(private client: KiwiClient) {}

  async details(bugId: number): Promise<Bug> {
    return await this.client.authenticatedCall<Bug>('Bug.details', [bugId]);
  }

  async report(bugData: Partial<Bug>): Promise<Bug> {
    return await this.client.authenticatedCall<Bug>('Bug.report', [bugData]);
  }
} 
