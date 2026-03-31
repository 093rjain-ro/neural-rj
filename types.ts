
export enum IndustryMode {
  ACADEMIC = 'STUDENT',
  ECOMMERCE = 'BUSINESS',
  CREATIVE = 'DESIGN',
  GENERAL = 'LIFE'
}

export enum AppSection {
  DASHBOARD = 'DASHBOARD',
  STRATEGIST = 'STRATEGIST',
  VAULT = 'VAULT',
  VISUALIZER = 'VISUALIZER',
  BILLING = 'SUBSCRIPTION',
  PROPAGATION = 'DEPLOYMENT'
}

export type UserTier = 'BASIC' | 'PRO' | 'QUANTUM';

export type IngestionType = 'TASK' | 'EVENT' | 'NOTE' | 'EXPENSE' | 'HABIT' | 'IDEA' | 'UNKNOWN';

export interface IngestedItem {
  id: string;
  type: IngestionType;
  content: string;
  timestamp: number;
  mode: IndustryMode;
  metadata?: {
    priority?: 'LOW' | 'MED' | 'HIGH';
    tags?: string[];
  };
}

export interface AgentPlan {
  goalSummary: string;
  reasoningSteps: {
    thought: string;
    action: string;
  }[];
  finalStrategy: string;
  potentialRisks: string[];
}

export type ImageSize = '1K' | '2K' | '4K';
