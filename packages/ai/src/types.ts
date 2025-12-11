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
  questions: string[];
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
