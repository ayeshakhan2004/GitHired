import { NextRequest, NextResponse } from 'next/server';
import { fetchGitHubProfile } from '@/lib/github';
import { runDiagnostic } from '@/lib/geminiClient';

export const maxDuration = 120; // 2 min timeout for Vercel

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { githubUrl, documents, targetRole } = body;

    if (!githubUrl || !targetRole) {
      return NextResponse.json(
        { error: 'GitHub URL and Target Domain are required' },
        { status: 400 }
      );
    }

    // Fetch GitHub data
    const github = await fetchGitHubProfile(githubUrl);

    // Run AI diagnostic with optional resume PDF
    const result = await runDiagnostic(
      github,
      documents || [],
      targetRole
    );

    return NextResponse.json({
      ...result,
      github_repos: github.repos.slice(0, 20),
    });
  } catch (err) {
    console.error('[/api/diagnose] Error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
