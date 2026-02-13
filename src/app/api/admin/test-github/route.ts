// Test GitHub Token API
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  
  const results = {
    timestamp: new Date().toISOString(),
    environment: {
      GITHUB_TOKEN_EXISTS: !!GITHUB_TOKEN,
      ADMIN_SECRET_KEY_EXISTS: !!process.env.ADMIN_SECRET_KEY,
    },
    githubTest: null as null | { success: boolean; user?: string; scopes?: string; error?: string },
  };
  
  // Test GitHub API
  if (GITHUB_TOKEN) {
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });
      
      if (response.ok) {
        const user = await response.json();
        results.githubTest = {
          success: true,
          user: user.login,
          scopes: response.headers.get('x-oauth-scopes') || 'unknown',
        };
      } else {
        results.githubTest = {
          success: false,
          error: `HTTP ${response.status}: ${await response.text()}`,
        };
      }
    } catch (error) {
      results.githubTest = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  return NextResponse.json(results);
}
