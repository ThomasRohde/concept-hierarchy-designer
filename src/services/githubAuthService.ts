import { saveData, loadData } from '../utils/offlineStorage';

const GITHUB_PAT_KEY = 'github_pat';
const GITHUB_AUTH_STATUS_KEY = 'github_auth_status';

export interface GitHubAuthStatus {
  isAuthenticated: boolean;
  username?: string;
  lastValidated?: number;
  error?: string;
}

// Simple encryption using Web Crypto API
class SimpleEncryption {
  private static async getKey(): Promise<CryptoKey> {
    // Generate a key from user agent + timestamp (simple obfuscation)
    const keyMaterial = navigator.userAgent + 'concept-hierarchy-app';
    const encoder = new TextEncoder();
    const keyData = encoder.encode(keyMaterial);
    
    const key = await crypto.subtle.importKey(
      'raw',
      keyData.slice(0, 32), // Take first 32 bytes for AES-256
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );
    
    return key;
  }

  static async encrypt(text: string): Promise<string> {
    const key = await this.getKey();
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
    
    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    return btoa(String.fromCharCode(...combined));
  }

  static async decrypt(encryptedText: string): Promise<string> {
    const key = await this.getKey();
    const combined = new Uint8Array(
      atob(encryptedText).split('').map(c => c.charCodeAt(0))
    );
    
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    );
    
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  }
}

export class GitHubAuthService {
  private static pat: string | null = null;
  private static authStatus: GitHubAuthStatus = { isAuthenticated: false };

  static async validatePAT(pat: string): Promise<{ isValid: boolean; username?: string; error?: string }> {
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${pat}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Concept-Hierarchy-Designer'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          return { isValid: false, error: 'Invalid token or insufficient permissions' };
        }
        return { isValid: false, error: `GitHub API error: ${response.status}` };
      }

      const userData = await response.json();
      return { 
        isValid: true, 
        username: userData.login 
      };
    } catch (error) {
      return { 
        isValid: false, 
        error: error instanceof Error ? error.message : 'Network error' 
      };
    }
  }

  static async savePAT(pat: string): Promise<void> {
    try {
      const encryptedPAT = await SimpleEncryption.encrypt(pat);
      await saveData(GITHUB_PAT_KEY, encryptedPAT);
      this.pat = pat;
    } catch (error) {
      throw new Error(`Failed to save GitHub PAT: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async loadPAT(): Promise<string | null> {
    if (this.pat) {
      return this.pat;
    }

    try {
      const encryptedPAT = await loadData(GITHUB_PAT_KEY);
      if (!encryptedPAT) {
        return null;
      }

      this.pat = await SimpleEncryption.decrypt(encryptedPAT);
      return this.pat;
    } catch (error) {
      console.warn('Failed to decrypt GitHub PAT:', error);
      return null;
    }
  }

  static async removePAT(): Promise<void> {
    try {
      await saveData(GITHUB_PAT_KEY, null);
      await saveData(GITHUB_AUTH_STATUS_KEY, null);
      this.pat = null;
      this.authStatus = { isAuthenticated: false };
    } catch (error) {
      throw new Error(`Failed to remove GitHub PAT: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async saveAuthStatus(status: GitHubAuthStatus): Promise<void> {
    try {
      await saveData(GITHUB_AUTH_STATUS_KEY, status);
      this.authStatus = status;
    } catch (error) {
      throw new Error(`Failed to save auth status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async loadAuthStatus(): Promise<GitHubAuthStatus> {
    try {
      const status = await loadData(GITHUB_AUTH_STATUS_KEY);
      if (status) {
        this.authStatus = status;
        return status;
      }
    } catch (error) {
      console.warn('Failed to load auth status:', error);
    }
    
    return { isAuthenticated: false };
  }

  static async testConnection(): Promise<GitHubAuthStatus> {
    const pat = await this.loadPAT();
    if (!pat) {
      const status: GitHubAuthStatus = { 
        isAuthenticated: false, 
        error: 'No GitHub PAT found' 
      };
      await this.saveAuthStatus(status);
      return status;
    }

    const validation = await this.validatePAT(pat);
    const status: GitHubAuthStatus = {
      isAuthenticated: validation.isValid,
      username: validation.username,
      lastValidated: Date.now(),
      error: validation.error
    };

    await this.saveAuthStatus(status);
    return status;
  }

  static async authenticateAndSave(pat: string): Promise<GitHubAuthStatus> {
    const validation = await this.validatePAT(pat);
    
    if (validation.isValid) {
      await this.savePAT(pat);
      const status: GitHubAuthStatus = {
        isAuthenticated: true,
        username: validation.username,
        lastValidated: Date.now()
      };
      await this.saveAuthStatus(status);
      return status;
    } else {
      const status: GitHubAuthStatus = {
        isAuthenticated: false,
        error: validation.error
      };
      await this.saveAuthStatus(status);
      return status;
    }
  }

  static getAuthStatus(): GitHubAuthStatus {
    return this.authStatus;
  }

  static async getCurrentPAT(): Promise<string | null> {
    return this.loadPAT();
  }
}