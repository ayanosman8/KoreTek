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

export interface ProjectEstimate {
  projectName: string;
  summary: string;
  features: string[];
  techStack: {
    frontend: string[];
    backend: string[];
    database: string[];
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

export interface Blueprint {
  id: string;
  user_id: string;
  project_name: string;
  project_description: string | null;
  summary: string | null;
  features: string[];
  tech_stack: {
    frontend: string[];
    backend: string[];
    database: string[];
    infrastructure: string[];
  };
  risks: string[];
  next_steps: string[];
  questions: (string | QuestionOption)[];
  enhancements: Record<string, any>;
  tags: string[];
  is_starred: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateBlueprintInput {
  project_name: string;
  project_description: string;
  summary: string;
  features: string[];
  tech_stack: {
    frontend: string[];
    backend: string[];
    database: string[];
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
  features?: string[];
  tech_stack?: {
    frontend: string[];
    backend: string[];
    database: string[];
    infrastructure: string[];
  };
  risks?: string[];
  next_steps?: string[];
  questions?: (string | QuestionOption)[];
  enhancements?: Record<string, any>;
  tags?: string[];
  is_starred?: boolean;
  is_archived?: boolean;
}
