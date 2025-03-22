import { NextRequest, NextResponse } from 'next/server';
import { getDefaultVercelClient } from '../../lib/vercel-api';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching projects using API token...');
    const client = getDefaultVercelClient();
    
    console.log('Making request to Vercel API...');
    const projects = await client.getProjects();
    
    console.log(`Successfully fetched ${projects?.length || 0} projects`);
    
    // Filter for Next.js projects
    const nextJsProjects = projects?.filter(project => 
      project?.framework === 'nextjs' || 
      project?.framework?.toLowerCase?.()?.includes?.('next')
    ) || [];
    
    console.log(`Found ${nextJsProjects.length} Next.js projects`);
    
    return NextResponse.json({ projects: nextJsProjects });
  } catch (error) {
    console.error('Error fetching Vercel projects:', error);
    
    // Extract more detailed error information
    let errorMessage = 'Failed to fetch projects';
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Check if it's an Axios error
      if (axios.isAxiosError(error) && error.response) {
        statusCode = error.response.status;
        errorMessage = `Vercel API Error (${statusCode}): ${
          JSON.stringify(error.response.data) || errorMessage
        }`;
      }
    }
    
    console.error(`Returning error response: ${errorMessage}`);
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
} 