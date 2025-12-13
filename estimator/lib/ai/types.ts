export interface ProjectRequirements {
  features: string[];
  userFlows: string[];
  databaseSchema: {
    tables: Array<{
      name: string;
      columns: string[];
    }>;
  };
  techStack: {
    frontend: string[];
    backend: string[];
    database: string[];
    other: string[];
  };
  timeline: string;
  questions: string[];
  estimatedCost: string;
}

export interface QuestionOption {
  text: string;
  options: string[];
}

export interface FeatureDetail {
  name: string;
  description: string;
  tier: 'free' | 'pro';
  tech: {
    packages?: string[];
    services?: string[];
  };
  resources?: string[];
}

export interface ProjectEstimate {
  projectName: string;
  summary: string;
  features: FeatureDetail[];
  techStack: {
    frontend: string[];
    backend: string[];
    database: string[];
    auth?: string[];
    payment_apis?: string[];
    ai_apis?: string[];
    services?: string[];
    infrastructure: string[];
  };
  risks: string[];
  nextSteps: string[];
  questions: (string | QuestionOption)[];
}

export interface Lead {
  id?: string;
  projectDescription: string;
  email: string;
  name?: string;
  company?: string;
  estimate?: ProjectEstimate;
  createdAt?: Date;
}

export type BlueprintStatus = 'idea' | 'planning' | 'building' | 'shipped';

export interface Blueprint {
  id: string;
  user_id: string;
  project_name: string;
  project_description: string | null;
  summary: string | null;
  features: FeatureDetail[] | string[]; // Support both old and new format
  tech_stack: {
    frontend: string[];
    backend: string[];
    database: string[];
    auth?: string[];
    payment_apis?: string[];
    ai_apis?: string[];
    services?: string[];
    infrastructure: string[];
  };
  risks: string[];
  next_steps: string[];
  questions: (string | QuestionOption)[];
  enhancements: Record<string, any>;
  tags: string[];
  is_starred: boolean;
  is_archived: boolean;
  is_public: boolean;
  status: BlueprintStatus;
  created_at: string;
  updated_at: string;
  checklist?: any[];
}

export interface CreateBlueprintInput {
  project_name: string;
  project_description: string;
  summary: string;
  features: FeatureDetail[] | string[];
  tech_stack: {
    frontend: string[];
    backend: string[];
    database: string[];
    auth?: string[];
    payment_apis?: string[];
    ai_apis?: string[];
    services?: string[];
    infrastructure: string[];
  };
  risks: string[];
  next_steps: string[];
  questions: (string | QuestionOption)[];
  enhancements?: Record<string, any>;
  tags?: string[];
}

export interface UpdateBlueprintInput {
  project_name?: string;
  project_description?: string;
  summary?: string;
  features?: FeatureDetail[] | string[];
  tech_stack?: {
    frontend: string[];
    backend: string[];
    database: string[];
    auth?: string[];
    payment_apis?: string[];
    ai_apis?: string[];
    services?: string[];
    infrastructure: string[];
  };
  risks?: string[];
  next_steps?: string[];
  questions?: (string | QuestionOption)[];
  enhancements?: Record<string, any>;
  tags?: string[];
  is_starred?: boolean;
  is_archived?: boolean;
  is_public?: boolean;
  status?: BlueprintStatus;
  checklist?: any[];
}
