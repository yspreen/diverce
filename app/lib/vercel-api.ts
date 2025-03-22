import axios from 'axios';

const VERCEL_API_URL = 'https://api.vercel.com';

export interface VercelProject {
  id: string;
  name: string;
  framework: string;
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
}

export class VercelApiClient {
  private apiToken: string;
  private teamId?: string;

  constructor(apiToken: string, teamId?: string) {
    this.apiToken = apiToken;
    this.teamId = teamId;
  }

  private get headers() {
    return {
      Authorization: `Bearer ${this.apiToken}`,
    };
  }

  private get baseParams() {
    if (this.teamId) {
      console.log(`Adding teamId parameter: ${this.teamId}`);
      return { teamId: this.teamId };
    }
    return {};
  }

  // Get user information
  async getUserInfo() {
    console.log('Fetching user info from Vercel API...');
    try {
      const response = await axios.get(`${VERCEL_API_URL}/v2/user`, {
        headers: this.headers,
      });
      console.log('Successfully fetched user info');
      return response.data;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  }

  // Get a list of all projects
  async getProjects() {
    console.log('Fetching projects list from Vercel API...');
    
    const params = this.baseParams;
    console.log(`Base Params: ${JSON.stringify(params)}`);
    console.log(`Team ID: ${this.teamId || 'Not set'}`);
    console.log(`Full request URL: ${VERCEL_API_URL}/v9/projects ${params.teamId ? `with teamId=${params.teamId}` : ''}`);
    
    try {
      const response = await axios.get(`${VERCEL_API_URL}/v9/projects`, {
        headers: this.headers,
        params: params,
      });
      
      console.log(`Successfully fetched ${response.data.projects?.length || 0} projects`);
      return response.data.projects as VercelProject[];
    } catch (error) {
      console.error('Error fetching projects:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
      }
      throw error;
    }
  }

  // Get specific project details
  async getProject(projectId: string) {
    console.log(`Fetching project details for ${projectId}...`);
    try {
      const response = await axios.get(`${VERCEL_API_URL}/v9/projects/${projectId}`, {
        headers: this.headers,
        params: this.baseParams,
      });
      console.log('Successfully fetched project details');
      return response.data as VercelProject;
    } catch (error) {
      console.error(`Error fetching project ${projectId}:`, error);
      throw error;
    }
  }

  // Get project environment variables
  async getProjectEnvVars(projectId: string) {
    console.log(`Fetching environment variables for project ${projectId}...`);
    try {
      const response = await axios.get(`${VERCEL_API_URL}/v9/projects/${projectId}/env`, {
        headers: this.headers,
        params: this.baseParams,
      });
      console.log('Successfully fetched project environment variables');
      return response.data.envs;
    } catch (error) {
      console.error(`Error fetching environment variables for project ${projectId}:`, error);
      throw error;
    }
  }
}

// Get a default client instance from environment variables
export function getDefaultVercelClient(): VercelApiClient {
  const apiToken = process.env.VERCEL_API_TOKEN;
  const teamId = process.env.VERCEL_TEAM_ID;
  
  if (!apiToken) {
    throw new Error('Missing VERCEL_API_TOKEN in environment variables');
  }
  
  console.log('Creating Vercel API client...');
  if (teamId) {
    console.log(`Using team ID: ${teamId}`);
  }
  
  return new VercelApiClient(apiToken, teamId || undefined);
} 