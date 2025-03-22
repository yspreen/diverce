'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { VercelProject } from '../lib/vercel-api';

export default function Dashboard() {
  const [projects, setProjects] = useState<VercelProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('/api/projects');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }
        
        const data = await response.json();
        setProjects(data.projects);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-foreground-secondary">Loading your projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-background">
        <div className="bg-error-lighter p-6 rounded-cloudflare border border-error-light max-w-lg text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-error mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-semibold text-error mb-2">Error</h2>
          <p className="text-foreground-secondary mb-6">{error}</p>
          <Link href="/" className="btn-primary">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-foreground-secondary mt-2">
            Select a Next.js project from your Vercel account to convert to Cloudflare
          </p>
        </div>
        
        {projects.length === 0 ? (
          <div className="bg-warning-lighter p-6 rounded-cloudflare border border-warning-light">
            <h2 className="text-xl font-semibold text-warning-dark mb-2">No Projects Found</h2>
            <p className="text-foreground-secondary">
              We couldn't find any Next.js projects in your Vercel account. Please make sure you have at least one Next.js project deployed on Vercel.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <div key={project.id} className="card hover:shadow-medium group transition-all duration-200 relative">
                <div className="absolute top-4 right-4">
                  <span className={`badge ${project.framework === 'nextjs' ? 'badge-primary' : 'badge-secondary'}`}>
                    {project.framework}
                  </span>
                </div>
                
                <h2 className="text-xl font-semibold text-foreground mb-2 pr-24">{project.name}</h2>
                <p className="text-foreground-tertiary mb-6 text-sm">ID: {project.id}</p>
                
                {project.framework === 'nextjs' ? (
                  <Link href={`/convert/${project.id}`} className="btn-primary w-full justify-center">
                    Convert to Cloudflare
                  </Link>
                ) : (
                  <button disabled className="btn-disabled w-full justify-center">
                    Not a Next.js Project
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 