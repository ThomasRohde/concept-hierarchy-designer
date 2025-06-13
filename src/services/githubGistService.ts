import { GitHubAuthService } from './githubAuthService';
import { TreeModel } from '../types';
import { 
  generateGistFilename, 
  createGistDescription, 
  createGistMetadata,
  getMainGistFilename,
  createUniqueGistFilename
} from '../utils/gistUtils';

export interface GistFile {
  filename: string;
  content: string;
  type?: string;
  language?: string;
  size?: number;
  raw_url?: string;
}

export interface Gist {
  id: string;
  description: string;
  public: boolean;
  files: Record<string, GistFile>;
  html_url: string;
  git_pull_url: string;
  git_push_url: string;
  created_at: string;
  updated_at: string;
  owner?: {
    login: string;
    id: number;
    avatar_url: string;
  };
}

export interface CreateGistRequest {
  description: string;
  public: boolean;
  files: Record<string, { content: string }>;
}

export interface UpdateGistRequest {
  description?: string;
  files?: Record<string, { content: string } | null>;
}

export class GitHubGistService {
  private static readonly BASE_URL = 'https://api.github.com/gists';
  private static readonly USER_AGENT = 'Concept-Hierarchy-Designer';

  private static async getAuthHeaders(): Promise<Record<string, string>> {
    const pat = await GitHubAuthService.getCurrentPAT();
    if (!pat) {
      throw new Error('No GitHub PAT available. Please authenticate first.');
    }

    return {
      'Authorization': `token ${pat}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'User-Agent': this.USER_AGENT
    };
  }

  private static async makeRequest<T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<T> {
    console.log('🌐 GitHubGistService: Making request to:', url);
    console.log('🌐 GitHubGistService: Request options:', options);
    
    const headers = await this.getAuthHeaders();
    console.log('🌐 GitHubGistService: Request headers prepared');
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers
      }
    });

    console.log('🌐 GitHubGistService: Response status:', response.status);
    console.log('🌐 GitHubGistService: Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ GitHubGistService: Error response:', errorText);
      throw new Error(`GitHub API error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ GitHubGistService: Success response:', result);
    return result;
  }

  /**
   * Creates a new Gist from a TreeModel
   */
  static async createGist(model: TreeModel, isPublic: boolean = false, author?: string): Promise<Gist> {
    console.log('📝 GitHubGistService: Creating gist for model:', model.id);
    console.log('📝 GitHubGistService: Public?', isPublic);
    console.log('📝 GitHubGistService: Author:', author);
    
    const metadata = createGistMetadata(model, author, isPublic);
    const filename = generateGistFilename(metadata.modelId, metadata.slug);
    
    console.log('📝 GitHubGistService: Generated filename:', filename);
    
    const gistData: CreateGistRequest = {
      description: createGistDescription(model),
      public: isPublic,
      files: {
        [filename]: {
          content: JSON.stringify({
            metadata,
            model: {
              ...model,
              createdAt: model.createdAt.toISOString(),
              lastModified: model.lastModified.toISOString()
            }
          }, null, 2)
        }
      }
    };

    console.log('📝 GitHubGistService: Prepared gist data:', gistData);

    const result = await this.makeRequest<Gist>(this.BASE_URL, {
      method: 'POST',
      body: JSON.stringify(gistData)
    });
    
    console.log('✅ GitHubGistService: Gist created successfully:', result.id, result.html_url);
    return result;
  }

  /**
   * Retrieves a Gist by ID
   */
  static async getGist(gistId: string): Promise<Gist> {
    return this.makeRequest<Gist>(`${this.BASE_URL}/${gistId}`);
  }

  /**
   * Updates an existing Gist
   */
  static async updateGist(
    gistId: string, 
    model: TreeModel, 
    existingGist?: Gist,
    author?: string
  ): Promise<Gist> {
    const metadata = createGistMetadata(model, author, model.isPublic);
    const newFilename = generateGistFilename(metadata.modelId, metadata.slug);
    
    let targetFilename = newFilename;
    let filesToUpdate: Record<string, { content: string } | null> = {};

    if (existingGist) {
      // Find the existing main file
      const existingFilename = getMainGistFilename(existingGist.files);
      
      if (existingFilename && existingFilename !== newFilename) {
        // If filename changed, delete old file and create new one
        filesToUpdate[existingFilename] = null; // Delete old file
        targetFilename = createUniqueGistFilename(
          newFilename, 
          Object.keys(existingGist.files)
        );
      } else if (existingFilename) {
        targetFilename = existingFilename;
      }
    }

    // Add/update the main file
    filesToUpdate[targetFilename] = {
      content: JSON.stringify({
        metadata,
        model: {
          ...model,
          createdAt: model.createdAt.toISOString(),
          lastModified: model.lastModified.toISOString()
        }
      }, null, 2)
    };

    const updateData: UpdateGistRequest = {
      description: createGistDescription(model),
      files: filesToUpdate
    };

    return this.makeRequest<Gist>(`${this.BASE_URL}/${gistId}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData)
    });
  }

  /**
   * Deletes a Gist
   */
  static async deleteGist(gistId: string): Promise<void> {
    await this.makeRequest<void>(`${this.BASE_URL}/${gistId}`, {
      method: 'DELETE'
    });
  }

  /**
   * Lists all Gists for the authenticated user
   */
  static async listGists(page: number = 1, perPage: number = 30): Promise<Gist[]> {
    const url = `${this.BASE_URL}?page=${page}&per_page=${perPage}`;
    return this.makeRequest<Gist[]>(url);
  }

  /**
   * Lists all Gists that appear to be Concept Hierarchy models
   */
  static async listConceptHierarchyGists(page: number = 1, perPage: number = 30): Promise<Gist[]> {
    const allGists = await this.listGists(page, perPage);
    
    return allGists.filter(gist => {
      // Check if any file matches our naming pattern
      return Object.keys(gist.files).some(filename => 
        filename.startsWith('ch-') && filename.endsWith('.json')
      );
    });
  }

  /**
   * Extracts TreeModel from a Gist
   */
  static parseGistToModel(gist: Gist): TreeModel | null {
    const mainFilename = getMainGistFilename(gist.files);
    if (!mainFilename) {
      return null;
    }

    const file = gist.files[mainFilename];
    if (!file || !file.content) {
      return null;
    }

    try {
      const data = JSON.parse(file.content);
      
      if (!data.model || !data.metadata) {
        return null;
      }      // Convert date strings back to Date objects
      const model: TreeModel = {
        ...data.model,
        createdAt: new Date(data.model.createdAt),
        lastModified: new Date(data.model.lastModified),
        gistId: gist.id,
        gistUrl: gist.html_url
      };

      // Log prompt data for debugging
      console.log('🔄 parseGistToModel: Extracted prompts from gist:', {
        hasPrompts: Boolean(model.prompts),
        promptCount: model.prompts?.prompts?.length || 0,
        activePromptId: model.prompts?.activePromptId
      });

      return model;
    } catch (error) {
      console.warn('Failed to parse Gist content:', error);
      return null;
    }
  }

  /**
   * Searches for Gists by description or content
   */
  static async searchConceptHierarchyGists(query: string): Promise<Gist[]> {
    // GitHub doesn't provide a direct search API for private gists,
    // so we need to list and filter locally
    const gists = await this.listConceptHierarchyGists();
    
    const lowercaseQuery = query.toLowerCase();
    
    return gists.filter(gist => {
      // Search in description
      if (gist.description.toLowerCase().includes(lowercaseQuery)) {
        return true;
      }
      
      // Search in file content
      const mainFilename = getMainGistFilename(gist.files);
      if (mainFilename) {
        const file = gist.files[mainFilename];
        if (file && file.content && file.content.toLowerCase().includes(lowercaseQuery)) {
          return true;
        }
      }
      
      return false;
    });
  }

  /**
   * Checks if the authenticated user has sufficient permissions
   */
  static async checkPermissions(): Promise<{ canCreateGists: boolean; canDeleteGists: boolean }> {
    try {
      // Try to get user's Gists to check read permission
      await this.listGists(1, 1);
      
      // For now, assume if we can read, we can create and delete
      // GitHub PATs with 'gist' scope provide full access
      return {
        canCreateGists: true,
        canDeleteGists: true
      };
    } catch (error) {
      return {
        canCreateGists: false,
        canDeleteGists: false
      };
    }
  }
}