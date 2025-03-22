import { NextRequest, NextResponse } from 'next/server';
import { getDefaultVercelClient } from '@/app/lib/vercel-api';

// Define a more flexible project type to handle any keys
interface VercelProject {
  id: string;
  name: string;
  framework?: string;
  gitRepository?: {
    type: string;
    repo: string;
    url: string;
    defaultBranch: string;
  };
  link?: {
    type: string;
    repo: string;
    repoId: number;
    org: string;
    gitCredentialId: string;
    productionBranch: string;
    createdAt: number;
    updatedAt: number;
    deployHooks: any[];
  };
  [key: string]: any; // Allow any other properties
}

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const vercelApiClient = getDefaultVercelClient();
    
    console.log(`Fetching project details for: ${params.projectId}`);
    const project = await vercelApiClient.getProject(params.projectId) as VercelProject;
    
    console.log('Project data received:');
    console.log('- Project ID:', project.id);
    console.log('- Project Name:', project.name);
    console.log('- Framework:', project.framework);
    
    // Check for Git repository information from either gitRepository or link field
    const hasGitRepository = !!project.gitRepository;
    const hasLinkRepository = !!project.link && project.link.type === 'github';
    
    if (hasGitRepository && project.gitRepository) {
      console.log('Git Repository found in gitRepository field:');
      console.log('- Type:', project.gitRepository.type);
      console.log('- Repository:', project.gitRepository.repo);
      console.log('- URL:', project.gitRepository.url);
      console.log('- Default Branch:', project.gitRepository.defaultBranch);
    } else if (hasLinkRepository && project.link) {
      console.log('Git Repository found in link field:');
      console.log('- Type:', project.link.type);
      console.log('- Organization:', project.link.org);
      console.log('- Repository:', project.link.repo);
      console.log('- Production Branch:', project.link.productionBranch);
      
      // Create a gitRepository field with the data from link
      project.gitRepository = {
        type: project.link.type,
        repo: `${project.link.org}/${project.link.repo}`,
        url: `https://github.com/${project.link.org}/${project.link.repo}`,
        defaultBranch: project.link.productionBranch
      };
      
      console.log('Created gitRepository field from link data:');
      console.log(JSON.stringify(project.gitRepository, null, 2));
    } else {
      console.log('No Git Repository found in project data');
      console.log('Full project data for debugging:');
      console.log(JSON.stringify(project, null, 2));
      
      // Check if there are any other repository-related fields
      const repoKeys = Object.keys(project).filter(key => 
        key.toLowerCase().includes('git') || key.toLowerCase().includes('repo')
      );
      
      if (repoKeys.length > 0) {
        console.log('Found potential repository-related fields:');
        repoKeys.forEach(key => {
          console.log(`- ${key}:`, project[key]);
        });
      }
    }
    
    const environment = request.nextUrl.searchParams.get('environment') || 'development';
    console.log(`Fetching environment variables for environment: ${environment}`);
    const environmentVariables = await vercelApiClient.getProjectEnvVars(params.projectId);
    
    return NextResponse.json({
      project,
      environmentVariables
    });
  } catch (error) {
    console.error('Error fetching project details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project details' },
      { status: 500 }
    );
  }
} 