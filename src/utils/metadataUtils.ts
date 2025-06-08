import { TreeModel, GistMetadata, ModelCategory, ModelStats, NodeData } from '../types';

/**
 * Calculates statistics for a tree model
 */
export function calculateModelStats(model: TreeModel): ModelStats {
  const nodeCount = model.nodes.length;
  
  // Calculate max depth
  const maxDepth = calculateMaxDepth(model.nodes);
  
  // Calculate average branching factor
  const branchingFactor = calculateBranchingFactor(model.nodes);
  
  return {
    nodeCount,
    maxDepth,
    branchingFactor,
    createdDate: model.createdAt,
    lastModifiedDate: model.lastModified,
    totalPrompts: model.prompts.prompts.length
  };
}

/**
 * Calculates the maximum depth of the tree
 */
function calculateMaxDepth(nodes: NodeData[]): number {
  if (nodes.length === 0) return 0;
  
  // Build parent-child map
  const children: Record<string, string[]> = {};
  const roots: string[] = [];
  
  nodes.forEach(node => {
    if (node.parent === null) {
      roots.push(node.id);
    } else {
      if (!children[node.parent]) {
        children[node.parent] = [];
      }
      children[node.parent].push(node.id);
    }
  });
  
  function getDepth(nodeId: string): number {
    const nodeChildren = children[nodeId] || [];
    if (nodeChildren.length === 0) {
      return 1;
    }
    
    return 1 + Math.max(...nodeChildren.map(getDepth));
  }
  
  return Math.max(...roots.map(getDepth));
}

/**
 * Calculates the average branching factor
 */
function calculateBranchingFactor(nodes: NodeData[]): number {
  if (nodes.length === 0) return 0;
  
  const children: Record<string, number> = {};
  
  nodes.forEach(node => {
    if (node.parent !== null) {
      children[node.parent] = (children[node.parent] || 0) + 1;
    }
  });
  
  const childCounts = Object.values(children);
  if (childCounts.length === 0) return 0;
  
  return childCounts.reduce((sum, count) => sum + count, 0) / childCounts.length;
}

/**
 * Creates comprehensive metadata for a model
 */
export function createEnhancedGistMetadata(
  model: TreeModel, 
  author?: string,
  isPublic: boolean = false
): GistMetadata {
  const stats = calculateModelStats(model);
  const slug = createSlug(model.name);
  
  return {
    modelId: model.id,
    slug,
    name: model.name,
    description: model.description,
    category: model.category || 'other',
    tags: model.tags || [],
    version: model.version,
    createdAt: model.createdAt.toISOString(),
    lastModified: model.lastModified.toISOString(),
    author: author || model.author,
    license: model.license || 'Private',
    isPublic,
    nodeCount: stats.nodeCount,
    maxDepth: stats.maxDepth
  };
}

/**
 * Creates a URL-friendly slug from text
 */
function createSlug(text: string, maxLength: number = 50): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, maxLength);
}

/**
 * Validates model metadata
 */
export function validateMetadata(metadata: Partial<GistMetadata>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!metadata.name || metadata.name.trim().length === 0) {
    errors.push('Model name is required');
  }
  
  if (metadata.name && metadata.name.length > 100) {
    errors.push('Model name must be 100 characters or less');
  }
  
  if (metadata.description && metadata.description.length > 500) {
    errors.push('Description must be 500 characters or less');
  }
  
  if (metadata.tags && metadata.tags.length > 10) {
    errors.push('Maximum 10 tags allowed');
  }
  
  if (metadata.tags) {
    const invalidTags = metadata.tags.filter(tag => 
      tag.length === 0 || tag.length > 30 || !/^[a-zA-Z0-9-_]+$/.test(tag)
    );
    if (invalidTags.length > 0) {
      errors.push('Tags must be 1-30 characters and contain only letters, numbers, hyphens, and underscores');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Extracts keywords from model content for auto-tagging
 */
export function generateAutoTags(model: TreeModel): string[] {
  const allText = [
    model.name,
    model.description || '',
    ...model.nodes.map(node => `${node.name} ${node.description}`),
    ...model.prompts.prompts.map(prompt => `${prompt.name} ${prompt.description}`)
  ].join(' ').toLowerCase();
  
  // Common technical and domain terms
  const keywords = [
    'api', 'database', 'frontend', 'backend', 'mobile', 'web', 'ios', 'android',
    'react', 'vue', 'angular', 'node', 'python', 'java', 'javascript', 'typescript',
    'business', 'strategy', 'marketing', 'sales', 'finance', 'operations',
    'education', 'research', 'academic', 'university', 'course', 'curriculum',
    'design', 'creative', 'art', 'visual', 'ux', 'ui', 'prototype',
    'project', 'management', 'agile', 'scrum', 'kanban', 'workflow',
    'data', 'analytics', 'machine-learning', 'ai', 'algorithm'
  ];
  
  const foundTags = keywords.filter(keyword => 
    allText.includes(keyword) && !model.tags?.includes(keyword)
  );
  
  // Limit to 5 auto-generated tags
  return foundTags.slice(0, 5);
}

/**
 * Gets category suggestions based on content
 */
export function suggestCategory(model: TreeModel): ModelCategory[] {
  const allText = [
    model.name,
    model.description || '',
    ...model.nodes.map(node => `${node.name} ${node.description}`)
  ].join(' ').toLowerCase();
  
  const categoryKeywords: Record<ModelCategory, string[]> = {
    business: ['business', 'strategy', 'marketing', 'sales', 'finance', 'operations', 'company', 'enterprise'],
    academic: ['research', 'academic', 'university', 'study', 'thesis', 'paper', 'course', 'curriculum'],
    technical: ['api', 'database', 'software', 'code', 'programming', 'development', 'system', 'architecture'],
    creative: ['design', 'art', 'creative', 'visual', 'brand', 'creative', 'concept', 'idea'],
    research: ['research', 'analysis', 'study', 'investigation', 'experiment', 'hypothesis', 'data'],
    education: ['education', 'teaching', 'learning', 'course', 'lesson', 'curriculum', 'student', 'instructor'],
    personal: ['personal', 'private', 'individual', 'self', 'goal', 'plan', 'life', 'hobby'],
    other: []
  };
  
  const suggestions: { category: ModelCategory; score: number }[] = [];
  
  Object.entries(categoryKeywords).forEach(([category, keywords]) => {
    if (category === 'other') return;
    
    const score = keywords.reduce((count, keyword) => {
      return count + (allText.includes(keyword) ? 1 : 0);
    }, 0);
    
    if (score > 0) {
      suggestions.push({ category: category as ModelCategory, score });
    }
  });
  
  // Sort by score and return top 3
  return suggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => s.category);
}

/**
 * Merges metadata with model defaults
 */
export function mergeMetadata(
  model: TreeModel,
  metadata: Partial<GistMetadata>
): TreeModel {
  return {
    ...model,
    name: metadata.name || model.name,
    description: metadata.description || model.description,
    category: metadata.category || model.category,
    tags: metadata.tags || model.tags,
    author: metadata.author || model.author,
    license: metadata.license || model.license,
    isPublic: metadata.isPublic !== undefined ? metadata.isPublic : model.isPublic
  };
}

/**
 * Formats metadata for display
 */
export function formatMetadataForDisplay(metadata: GistMetadata): Record<string, string> {
  return {
    'Model ID': metadata.modelId,
    'Name': metadata.name,
    'Category': metadata.category || 'Other',
    'Tags': metadata.tags?.join(', ') || 'None',
    'Author': metadata.author || 'Unknown',
    'License': metadata.license || 'Private',
    'Visibility': metadata.isPublic ? 'Public' : 'Private',
    'Nodes': metadata.nodeCount?.toString() || '0',
    'Max Depth': metadata.maxDepth?.toString() || '0',
    'Version': metadata.version.toString(),
    'Created': new Date(metadata.createdAt).toLocaleDateString(),
    'Modified': new Date(metadata.lastModified).toLocaleDateString()
  };
}

/**
 * Exports metadata as JSON string
 */
export function exportMetadata(metadata: GistMetadata): string {
  return JSON.stringify(metadata, null, 2);
}

/**
 * Imports metadata from JSON string
 */
export function importMetadata(jsonString: string): GistMetadata | null {
  try {
    const parsed = JSON.parse(jsonString);
    
    // Basic validation
    if (!parsed.modelId || !parsed.name || !parsed.version) {
      return null;
    }
    
    return parsed as GistMetadata;
  } catch (error) {
    return null;
  }
}