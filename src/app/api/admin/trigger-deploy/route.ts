import { NextResponse } from 'next/server';

const RAILWAY_API_TOKEN = process.env.RAILWAY_API_TOKEN;
const RAILWAY_PROJECT_ID = process.env.RAILWAY_PROJECT_ID;
const RAILWAY_SERVICE_ID = process.env.RAILWAY_SERVICE_ID;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { adminKey } = body;

    // Verify admin key (optional, for extra security)
    if (adminKey && adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Invalid admin key' },
        { status: 403 }
      );
    }

    if (!RAILWAY_API_TOKEN) {
      return NextResponse.json(
        { error: 'Railway API token not configured. Add RAILWAY_API_TOKEN to environment variables.' },
        { status: 500 }
      );
    }

    if (!RAILWAY_SERVICE_ID) {
      return NextResponse.json(
        { error: 'Railway Service ID not configured. Add RAILWAY_SERVICE_ID to environment variables.' },
        { status: 500 }
      );
    }

    console.log('🚀 Triggering Railway redeploy...');

    // Railway GraphQL API - trigger redeploy
    const response = await fetch('https://backboard.railway.app/graphql/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RAILWAY_API_TOKEN}`,
      },
      body: JSON.stringify({
        query: `
          mutation serviceInstanceRedeploy($serviceId: String!, $environmentId: String) {
            serviceInstanceRedeploy(serviceId: $serviceId, environmentId: $environmentId)
          }
        `,
        variables: {
          serviceId: RAILWAY_SERVICE_ID,
          environmentId: null, // Uses default environment
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Railway API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (data.errors) {
      throw new Error(`Railway GraphQL error: ${JSON.stringify(data.errors)}`);
    }

    console.log('✅ Railway redeploy triggered successfully!');

    return NextResponse.json({
      success: true,
      message: 'Railway redeploy triggered! Deployment will start in ~30 seconds.',
      data: data.data,
    });
  } catch (error) {
    console.error('Error triggering Railway deploy:', error);
    return NextResponse.json(
      { error: 'Failed to trigger deploy: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
