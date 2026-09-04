import { NextResponse } from 'next/server';
import { syncGitHubRepos } from '@/lib/sync-repos';

export async function GET() {
  try {
    const result = await syncGitHubRepos({ forceFetch: true });
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST() {
  // Can be used as a webhook endpoint
  return GET();
}
