import path from 'path';
import fs from 'fs';
import simpleGit, { SimpleGit } from 'simple-git';

export interface CloneOptions {
  repoUrl: string;
  projectId: string;
  branch?: string;
  storagePath: string;
  auth?: GitAuthOptions; // For future GitHub authentication
}

// Future authentication options interface
export interface GitAuthOptions {
  type: 'oauth' | 'token' | 'ssh';
  token?: string;
  username?: string;
  password?: string;
  sshKeyPath?: string;
}

export interface CloneResult {
  success: boolean;
  path: string;
  message: string;
  error?: Error;
}

export async function cloneRepository(options: CloneOptions): Promise<CloneResult> {
  const { repoUrl, projectId, branch, storagePath } = options;
  
  // Create a safe directory name from the project ID
  const projectDir = path.join(storagePath, projectId);
  
  // Ensure the storage path exists
  if (!fs.existsSync(storagePath)) {
    try {
      fs.mkdirSync(storagePath, { recursive: true });
    } catch (error) {
      console.error('Failed to create storage directory:', error);
      return {
        success: false,
        path: projectDir,
        message: `Failed to create storage directory: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  }
  
  // Create an instance of SimpleGit
  const git: SimpleGit = simpleGit();
  
  try {
    // Check if directory already exists
    if (fs.existsSync(projectDir)) {
      try {
        // Try to pull latest changes if it's a git repo
        const localGit = simpleGit(projectDir);
        
        // Check if it's a valid git repository
        const isRepo = await localGit.checkIsRepo();
        
        if (isRepo) {
          // If branch is specified, check it out
          if (branch) {
            try {
              await localGit.checkout(branch);
            } catch (error) {
              console.warn(`Warning: Could not checkout branch ${branch}:`, error);
              // Continue with current branch
            }
          }
          
          // Pull the latest changes
          await localGit.pull();
          return {
            success: true,
            path: projectDir,
            message: 'Repository already exists locally. Pulled latest changes.',
          };
        } else {
          // Not a git repo, remove directory and clone
          fs.rmSync(projectDir, { recursive: true, force: true });
        }
      } catch (error) {
        console.error('Error updating existing repository:', error);
        // If there's an error, remove the directory and try to clone again
        try {
          fs.rmSync(projectDir, { recursive: true, force: true });
        } catch (rmError) {
          console.error('Failed to remove existing directory:', rmError);
          return {
            success: false,
            path: projectDir,
            message: `Failed to prepare directory for cloning: ${rmError instanceof Error ? rmError.message : 'Unknown error'}`,
            error: rmError instanceof Error ? rmError : new Error('Unknown error'),
          };
        }
      }
    }
    
    // Clean up URL to ensure it's properly formatted
    // Remove any quotes or spaces that might be in the URL
    const cleanRepoUrl = repoUrl.trim().replace(/['"]/g, '');
    console.log(`Cloning repository from URL: ${cleanRepoUrl} to ${projectDir}`);
    
    // TODO: Add GitHub authentication when options.auth is provided
    // This would be implemented in the future to handle private repositories
    
    // Clone the repository
    // Don't pass branch in cloneOptions, use separate args to specify branch if needed
    if (branch) {
      console.log(`Cloning with branch: ${branch}`);
      await git.clone(cleanRepoUrl, projectDir, ['-b', branch]);
    } else {
      await git.clone(cleanRepoUrl, projectDir);
    }
    
    return {
      success: true,
      path: projectDir,
      message: 'Repository cloned successfully.',
    };
  } catch (error) {
    console.error('Clone error:', error);
    // Provide more detailed error messages based on error type
    let errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Check for common Git errors and provide more helpful messages
    if (errorMessage.includes('Authentication failed')) {
      errorMessage = 'Authentication failed. This may be a private repository that requires credentials.';
    } else if (errorMessage.includes('not found')) {
      errorMessage = 'Repository not found. Please verify the URL is correct.';
    } else if (errorMessage.includes('already exists')) {
      errorMessage = 'Directory already exists and is not empty.';
    }
    
    return {
      success: false,
      path: projectDir,
      message: `Failed to clone repository: ${errorMessage}`,
      error: error instanceof Error ? error : new Error(errorMessage),
    };
  }
}

export async function createBranch(projectPath: string, branchName: string): Promise<boolean> {
  try {
    const git = simpleGit(projectPath);
    await git.checkoutLocalBranch(branchName);
    return true;
  } catch (error) {
    console.error('Error creating branch:', error);
    return false;
  }
}

export async function commitAndPush(projectPath: string, message: string): Promise<boolean> {
  try {
    const git = simpleGit(projectPath);
    await git.add('.');
    await git.commit(message);
    await git.push('origin', 'HEAD');
    return true;
  } catch (error) {
    console.error('Error committing and pushing changes:', error);
    return false;
  }
} 