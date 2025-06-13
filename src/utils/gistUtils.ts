import { GistMetadata, TreeModel, NodeData } from '../types';

/**
 * Generates a unique model ID using timestamp and random component
 * Format: YYYYMMDD-HHMMSS-XXXX
 */
export function generateModelId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  // Generate 4-character random suffix
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  
  return `${year}${month}${day}-${hours}${minutes}${seconds}-${randomSuffix}`;
}

/**
 * Converts a string to a URL-friendly slug
 * Removes special characters, converts to lowercase, replaces spaces with hyphens
 */
export function createSlug(text: string, maxLength: number = 50): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens and spaces
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .substring(0, maxLength); // Limit length
}

/**
 * Generates a Gist filename using the standard naming scheme
 * Format: ch-[id]-[slug].json
 */
export function generateGistFilename(modelId: string, slug: string): string {
  return `ch-${modelId}-${slug}.json`;
}

/**
 * Parses a Gist filename to extract model ID and slug
 * Returns null if filename doesn't match expected format
 */
export function parseGistFilename(filename: string): { modelId: string; slug: string } | null {
  const match = filename.match(/^ch-([^-]+-[^-]+-[^-]+)-(.+)\.json$/);
  if (!match) {
    return null;
  }
  
  return {
    modelId: match[1],
    slug: match[2]
  };
}

/**
 * Gets the root node from a nodes array
 */
export function getRootNode(nodes: NodeData[]): NodeData | null {
  return nodes.find(node => node.parent === null) || null;
}

/**
 * Creates a Gist description from model metadata, using root node name
 */
export function createGistDescription(model: TreeModel): string {
  const nodeCount = model.nodes.length;
  const rootNode = getRootNode(model.nodes);
  const rootNodeName = rootNode ? rootNode.name : model.name;
  const description = model.description ? ` - ${model.description}` : '';
  return `Concept Hierarchy: ${rootNodeName}${description} (${nodeCount} nodes)`;
}

/**
 * Validates a model ID format
 */
export function isValidModelId(modelId: string): boolean {
  return /^\d{8}-\d{6}-[A-Z0-9]{4}$/.test(modelId);
}

/**
 * Creates metadata object for Gist storage
 */
export function createGistMetadata(model: TreeModel, author?: string, isPublic: boolean = false): GistMetadata {
  const rootNode = getRootNode(model.nodes);
  const modelName = rootNode ? rootNode.name : model.name;
  const slug = createSlug(modelName);
  
  return {
    modelId: model.id,
    slug,
    name: modelName,
    description: model.description,
    category: model.category,
    tags: model.tags,
    version: model.version,
    createdAt: model.createdAt.toISOString(),
    lastModified: model.lastModified.toISOString(),
    author: author || model.author,
    license: model.license,
    isPublic,
    nodeCount: model.nodes.length,
    maxDepth: calculateTreeDepth(model.nodes)
  };
}

/**
 * Calculates the maximum depth of a tree
 */
function calculateTreeDepth(nodes: NodeData[]): number {
  if (nodes.length === 0) return 0;
  
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
  
  if (roots.length === 0) return 0;
  return Math.max(...roots.map(getDepth));
}

/**
 * Extracts the main filename from a Gist (the first .json file that matches our pattern)
 */
export function getMainGistFilename(gistFiles: Record<string, any>): string | null {
  for (const filename of Object.keys(gistFiles)) {
    if (filename.startsWith('ch-') && filename.endsWith('.json')) {
      return filename;
    }
  }
  return null;
}

/**
 * Creates a unique filename if there's a collision
 */
export function createUniqueGistFilename(baseFilename: string, existingFilenames: string[]): string {
  if (!existingFilenames.includes(baseFilename)) {
    return baseFilename;
  }
  
  const { modelId, slug } = parseGistFilename(baseFilename) || { modelId: '', slug: '' };
  let counter = 1;
  let newFilename: string;
  
  do {
    const newSlug = `${slug}-${counter}`;
    newFilename = generateGistFilename(modelId, newSlug);
    counter++;
  } while (existingFilenames.includes(newFilename) && counter < 100);
  
  return newFilename;
}