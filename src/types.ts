
export interface NodeData {
  id: string;
  name: string;
  description: string;
  parent: string | null;
}

export interface Prompt {
  id: string;
  name: string;
  description: string;
  content: string;
  createdAt: Date;
  lastModified: Date;
  isDefault: boolean;
  category: 'general' | 'academic' | 'business' | 'creative' | 'technical';
  tags: string[];
  usageCount?: number;
  lastUsed?: Date;
}

export interface PromptCollection {
  prompts: Prompt[];
  activePromptId: string | null;
}

export interface TreeModel {
  id: string;
  name: string;
  description?: string;
  nodes: NodeData[];
  prompts: PromptCollection;
  createdAt: Date;
  lastModified: Date;
  version: number;
  gistId?: string;
  gistUrl?: string;
  category?: ModelCategory;
  tags?: string[];
  author?: string;
  license?: string;
  isPublic?: boolean;
}

export interface GistMetadata {
  modelId: string;
  slug: string;
  name: string;
  description?: string;
  category?: ModelCategory;
  tags?: string[];
  version: number;
  createdAt: string;
  lastModified: string;
  author?: string;
  license?: string;
  isPublic?: boolean;
  nodeCount?: number;
  maxDepth?: number;
}

export type ModelCategory = 
  | 'business'
  | 'academic'
  | 'personal'
  | 'technical'
  | 'creative'
  | 'research'
  | 'education'
  | 'other';

export interface ModelStats {
  nodeCount: number;
  maxDepth: number;
  branchingFactor: number;
  createdDate: Date;
  lastModifiedDate: Date;
  totalPrompts: number;
}