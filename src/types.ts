
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