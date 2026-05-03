import { DiagnosticResult, GitHubProfile } from '@/types/diagnostic';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent';

const DIAGNOSTIC_FUNCTION = {
  name: 'run_diagnostic',
  description: 'Run a complete career diagnostic and return structured results',
  parameters: {
    type: 'object',
    properties: {
      readiness_score: {
        type: 'object',
        properties: {
          score: { type: 'number', description: '0-100 integer readiness score' },
          label: { type: 'string', enum: ['Weak', 'Developing', 'Strong', 'Hireable'] },
          reasoning: { type: 'string', description: '2-3 sentence explanation of the score' },
          gap_summary: { type: 'string', description: 'What the biggest gaps are' },
        },
        required: ['score', 'label', 'reasoning', 'gap_summary'],
      },
      linkedin_critique: {
        type: 'object',
        description: 'Resume & profile review — extract data from the uploaded resume/LinkedIn PDF to populate these fields',
        properties: {
          profile_data: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Full name from the resume' },
              headline: { type: 'string', description: 'Professional headline or title from the resume' },
              about: { type: 'string', description: 'Summary/objective extracted from the resume' },
              location: { type: 'string', description: 'Location from the resume' },
              profile_picture_url: { type: 'string' },
              connections: { type: 'string' },
            },
            required: ['name', 'headline', 'about', 'location'],
          },
          badges: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                element: { type: 'string', enum: ['headline', 'about', 'featured', 'experience', 'photo', 'skills', 'education'] },
                severity: { type: 'string', enum: ['critical', 'warning', 'good'] },
                problem: { type: 'string' },
                rewrite: { type: 'string' },
              },
              required: ['element', 'severity', 'problem', 'rewrite'],
            },
          },
          posts_to_make: { type: 'array', items: { type: 'string' } },
          featured_to_add: { type: 'array', items: { type: 'string' } },
          sections_to_remove: { type: 'array', items: { type: 'string' } },
        },
        required: ['profile_data', 'badges', 'posts_to_make', 'featured_to_add', 'sections_to_remove'],
      },
      github_audit: {
        type: 'object',
        properties: {
          bio_status: { type: 'string', enum: ['missing', 'weak', 'good'] },
          bio_rewrite: { type: 'string' },
          repo_flags: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                repo_name: { type: 'string' },
                flag_type: { type: 'string', enum: ['foundational_project', 'needs_revival', 'no_readme', 'weak_description'] },
                action: { type: 'string' },
                reason: { type: 'string' },
              },
              required: ['repo_name', 'flag_type', 'action', 'reason'],
            },
          },
          missing_projects: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                pitch: { type: 'string' },
                tech_stack: { type: 'array', items: { type: 'string' } },
                complexity: { type: 'string', enum: ['beginner', 'medium', 'advanced'] },
                why_impressive: { type: 'string' },
              },
              required: ['name', 'pitch', 'tech_stack', 'complexity', 'why_impressive'],
            },
          },
          overall_assessment: { type: 'string' },
        },
        required: ['bio_status', 'bio_rewrite', 'repo_flags', 'missing_projects', 'overall_assessment'],
      },
      ats_results: {
        type: 'object',
        properties: {
          keyword_match_percent: { type: 'number' },
          keywords_found: { type: 'array', items: { type: 'string' } },
          keywords_missing: { type: 'array', items: { type: 'string' } },
          checklist: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                item: { type: 'string' },
                status: { type: 'string', enum: ['pass', 'fail', 'warning'] },
                explanation: { type: 'string' },
              },
              required: ['item', 'status', 'explanation'],
            },
          },
          overall_verdict: { type: 'string' },
        },
        required: ['keyword_match_percent', 'keywords_found', 'keywords_missing', 'checklist', 'overall_verdict'],
      },
      roadmap: {
        type: 'object',
        properties: {
          phase_1_immediate: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                task: { type: 'string' },
                category: { type: 'string', enum: ['linkedin', 'github', 'resume', 'networking'] },
                time_estimate: { type: 'string' },
              },
              required: ['task', 'category', 'time_estimate'],
            },
          },
          phase_2_projects: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                task: { type: 'string' },
                duration: { type: 'string' },
                milestone: { type: 'string' },
              },
              required: ['task', 'duration', 'milestone'],
            },
          },
          phase_3_networking: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                task: { type: 'string' },
                frequency: { type: 'string', enum: ['daily', 'weekly', 'one-time'] },
              },
              required: ['task', 'frequency'],
            },
          },
        },
        required: ['phase_1_immediate', 'phase_2_projects', 'phase_3_networking'],
      },
    },
    required: ['readiness_score', 'linkedin_critique', 'github_audit', 'ats_results', 'roadmap'],
  },
};

function buildPrompt(
  github: GitHubProfile,
  documents: { fileName: string; base64: string; mimeType: string }[],
  targetRole: string
): string {
  const repoList = github.repos
    .slice(0, 15)
    .map((r) => {
      const files = r.files?.length ? `\n    files: ${r.files.slice(0, 10).join(', ')}` : '';
      const readme = r.readme ? `\n    readme: ${r.readme.slice(0, 300)}` : '';
      return `  - ${r.name}: ${r.description || 'no description'} [${r.language || 'unknown'}] ⭐${r.stargazers_count}${files}${readme}`;
    })
    .join('\n');

  const topLangs = Object.entries(github.topLanguages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([lang, count]) => `${lang}(${count})`)
    .join(', ');

  const resumeSection = documents.length > 0
    ? `I have attached ${documents.length} document(s) / image(s). Extract the user's name, headline, experience, education, skills, and summary from these files to populate the linkedin_critique.profile_data section and inform the entire diagnostic.`
    : `[No resume provided — for the linkedin_critique section, set name to the GitHub name "${github.name}", generate helpful placeholder content, and mark all badges as needing improvement with actionable suggestions to create a strong resume.]`;

  return `TARGET DOMAIN: ${targetRole}

═══════════════════════════════
GITHUB DATA
═══════════════════════════════
Username: ${github.login}
Name: ${github.name}
Bio: ${github.bio || 'MISSING — no bio set'}
Followers: ${github.followers} | Following: ${github.following}
Public Repos: ${github.public_repos}
Has Profile README: ${github.hasProfileReadme ? 'Yes' : 'NO'}
Top Languages: ${topLangs || 'None detected'}
Location: ${github.location || 'Not set'}
Website: ${github.blog || 'Not set'}

Repositories (most recent first):
${repoList}

═══════════════════════════════
RESUME / PROFILE DATA
═══════════════════════════════
${resumeSection}

═══════════════════════════════
INSTRUCTIONS
═══════════════════════════════
Analyze ALL of the above data holistically. Be specific — reference actual repo names, actual skills listed. Do not give generic advice. Every rewrite must be copy-pasteable as-is. Score fairly and constructively — recognize effort and learning while noting areas for growth. Generate exactly 2 missing projects tailored specifically to the "${targetRole}" domain with real, current tech stacks. For repos that are common learning exercises (todo apps, weather apps, etc.), label them as "Foundational Learning Projects" and suggest ways to level them up rather than dismissing them. Analyze the user's fit for their selected tech domain, not a strict corporate job title.

For the linkedin_critique section: Extract the user's profile information from the attached files. Populate profile_data with their actual name, headline, about summary, and location. Review their resume content and provide actionable badges for improvement. Suggest LinkedIn posts to make and items to add to their featured section.`;
}

export async function runDiagnostic(
  github: GitHubProfile,
  documents: { fileName: string; base64: string; mimeType: string }[],
  targetRole: string
): Promise<DiagnosticResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  const prompt = buildPrompt(github, documents, targetRole);

  const currentDate = new Date().toDateString();

  const systemInstruction = `You are Githired, an encouraging and empathetic tech mentor guiding university students and junior developers. Your goal is to build confidence while providing constructive, actionable advice. You are deeply specific and always actionable. You do NOT give generic advice. Every critique must reference the specific data provided. Every rewrite must be usable as-is with no editing needed. You MUST call the run_diagnostic function — no prose outside the function schema. Score the user's career readiness from 0-100 based on their progress toward being ready in their target tech domain. Be fair and realistic — recognize foundational work and effort.

IMPORTANT CONTEXT: Today's date is ${currentDate}. Do not flag any dates prior to or including this date as "future" dates. Evaluate the timeline based on this current date.

CRITICAL RULES:
- Do NOT use demoralizing terms like "Tutorial Clone", "Basic", or "Flagged". Instead, reframe these as "Foundational Learning Projects" or "Skill Builders".
- Focus on what the student learned and how they can level up the project (e.g., "Great start! To make this stand out, try adding X feature").
- Analyze the user's fit for their selected tech DOMAIN, not a strict corporate job title.
- Be encouraging but honest — celebrate progress while providing a clear path forward.
- For the linkedin_critique section: If documents/images are attached, extract the user's real data from them. If no documents are provided, use the GitHub profile data and provide helpful guidance on what their resume should include.`;

  // Build the user content parts — text prompt + optional file
  const userParts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [
    { text: prompt },
  ];

  // Attach all files as multimodal input
  for (const doc of documents) {
    userParts.push({
      inlineData: {
        mimeType: doc.mimeType,
        data: doc.base64,
      },
    });
  }

  const requestBody = {
    system_instruction: {
      parts: [{ text: systemInstruction }],
    },
    contents: [
      {
        role: 'user',
        parts: userParts,
      },
    ],
    tools: [
      {
        function_declarations: [DIAGNOSTIC_FUNCTION],
      },
    ],
    tool_config: {
      function_calling_config: {
        mode: 'ANY',
        allowed_function_names: ['run_diagnostic'],
      },
    },
    generationConfig: {
      temperature: 0.7,
    },
  };

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();

  // Extract function call from Gemini response
  const candidate = data.candidates?.[0];
  const parts = candidate?.content?.parts;
  const functionCallPart = parts?.find((p: { functionCall?: { name: string; args: unknown } }) => p.functionCall);

  if (!functionCallPart?.functionCall) {
    throw new Error('Gemini did not return a function call. Response: ' + JSON.stringify(data));
  }

  const { name, args } = functionCallPart.functionCall;

  if (name !== 'run_diagnostic') {
    throw new Error(`Unexpected function call: ${name}`);
  }

  const result = args as Omit<DiagnosticResult, 'target_role' | 'generated_at'>;

  return {
    ...result,
    target_role: targetRole,
    generated_at: new Date().toISOString(),
  };
}
