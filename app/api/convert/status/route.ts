import { NextRequest, NextResponse } from 'next/server';

// Access the global store from parent
declare global {
  var conversionStore: Record<string, {
    status: 'cloning' | 'converting' | 'success' | 'failed';
    logs: string[];
    message?: string;
  }>;
}

// If not available globally, define it here
if (!global.conversionStore) {
  global.conversionStore = {};
}

export async function GET(request: NextRequest) {
  // Set headers for SSE
  const headers = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
  };
  
  const searchParams = request.nextUrl.searchParams;
  const projectId = searchParams.get('projectId');
  
  if (!projectId) {
    return NextResponse.json(
      { error: 'Project ID is required' },
      { status: 400 }
    );
  }
  
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    start(controller) {
      // Function to send updates
      const sendUpdate = () => {
        const status = global.conversionStore[projectId] || {
          status: 'cloning',
          logs: ['Waiting for conversion to start...'],
        };
        
        const data = `data: ${JSON.stringify(status)}\n\n`;
        controller.enqueue(encoder.encode(data));
        
        // Continue sending updates until conversion is complete
        if (status.status !== 'success' && status.status !== 'failed') {
          setTimeout(sendUpdate, 1000);
        } else {
          controller.close();
        }
      };
      
      // Start sending updates
      sendUpdate();
    },
  });

  return new Response(stream, { headers });
} 