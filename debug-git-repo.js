// Debug script to check Vercel API project fields related to Git repositories
const axios = require('axios');
require('dotenv').config({ path: './.env.local' });

const VERCEL_API_URL = 'https://api.vercel.com';
const apiToken = process.env.VERCEL_API_TOKEN;
const teamId = process.env.VERCEL_TEAM_ID;

// Check if we have the required API token
if (!apiToken) {
  console.error('ERROR: Missing VERCEL_API_TOKEN in .env.local file');
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${apiToken}`,
  'Content-Type': 'application/json'
};

async function listProjects() {
  try {
    console.log('Fetching projects...');
    const params = teamId ? { teamId } : {};
    
    const response = await axios.get(`${VERCEL_API_URL}/v9/projects`, {
      headers,
      params
    });
    
    console.log(`Found ${response.data.projects.length} projects`);
    
    // Print each project name and ID
    response.data.projects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.name} (${project.id})`);
    });
    
    // Ask the user to select a project to inspect
    const projectIndex = 0; // Just take the first project for simplicity
    const selectedProject = response.data.projects[projectIndex];
    
    console.log(`\nSelected project: ${selectedProject.name} (${selectedProject.id})`);
    
    // Fetch detailed project info
    await getProjectDetails(selectedProject.id);
    
  } catch (error) {
    console.error('Error fetching projects:', error.response?.data || error.message);
  }
}

async function getProjectDetails(projectId) {
  try {
    console.log(`\nFetching details for project ID: ${projectId}...`);
    const params = teamId ? { teamId } : {};
    
    const response = await axios.get(`${VERCEL_API_URL}/v9/projects/${projectId}`, {
      headers,
      params
    });
    
    const project = response.data;
    
    console.log('\nProject Information:');
    console.log(`Name: ${project.name}`);
    console.log(`ID: ${project.id}`);
    console.log(`Framework: ${project.framework || 'Not specified'}`);
    
    // Check for Git repository information
    console.log('\nGit Repository Information:');
    if (project.gitRepository) {
      console.log('gitRepository field found:');
      console.log(JSON.stringify(project.gitRepository, null, 2));
    } else {
      console.log('No gitRepository field found');
    }
    
    // Check for other Git-related fields
    const gitRelatedFields = {};
    Object.keys(project).forEach(key => {
      if (
        key.toLowerCase().includes('git') || 
        key.toLowerCase().includes('repo') ||
        key.toLowerCase().includes('source')
      ) {
        gitRelatedFields[key] = project[key];
      }
    });
    
    if (Object.keys(gitRelatedFields).length > 0) {
      console.log('\nOther Git-related fields:');
      console.log(JSON.stringify(gitRelatedFields, null, 2));
    } else {
      console.log('\nNo other Git-related fields found');
    }
    
    // Print the full project object for complete inspection
    console.log('\nFull Project Object:');
    console.log(JSON.stringify(project, null, 2));
    
  } catch (error) {
    console.error('Error fetching project details:', error.response?.data || error.message);
  }
}

// Run the main function
listProjects().catch(error => {
  console.error('Unhandled error:', error);
}); 