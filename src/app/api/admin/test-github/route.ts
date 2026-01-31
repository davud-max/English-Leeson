// Test GitHub Token API
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;
  
  const results = {
    timestamp: new Date().toISOString(),
    environment: {
      GITHUB_TOKEN_EXISTS: !!GITHUB_TOKEN,
      GITHUB_TOKEN_LENGTH: GITHUB_TOKEN?.length || 0,
      GITHUB_TOKEN_PREFIX: GITHUB_TOKEN?.substring(0, 4) || 'N/A',
      ADMIN_SECRET_KEY_EXISTS: !!ADMIN_SECRET_KEY,
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
