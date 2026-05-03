export interface ReadinessScore {
  score: number;
  label: 'Weak' | 'Developing' | 'Strong' | 'Hireable';
  reasoning: string;
  gap_summary: string;
}

export interface LinkedInBadge {
  element: 'headline' | 'about' | 'featured' | 'experience' | 'photo' | 'skills' | 'education';
  severity: 'critical' | 'warning' | 'good';
  problem: string;
  rewrite: string;
}

export interface LinkedInCritique {
  profile_data: {
    name: string;
    headline: string;
    about: string;
    location: string;
    profile_picture_url: string | null;
    connections?: string;
  };
  badges: LinkedInBadge[];
  posts_to_make: string[];
  featured_to_add: string[];
  sections_to_remove: string[];
}

export interface RepoFlag {
  repo_name: string;
  flag_type: 'foundational_project' | 'needs_revival' | 'no_readme' | 'weak_description';
  action: string;
  reason: string;
}

export interface MissingProject {
  name: string;
  pitch: string;
  tech_stack: string[];
  complexity: 'beginner' | 'medium' | 'advanced';
  why_impressive: string;
}

export interface GithubAudit {
  bio_status: 'missing' | 'weak' | 'good';
  bio_rewrite: string;
  repo_flags: RepoFlag[];
  missing_projects: MissingProject[];
  overall_assessment: string;
}

export interface ATSCheckItem {
  item: string;
  status: 'pass' | 'fail' | 'warning';
  explanation: string;
}

export interface ATSResults {
  keyword_match_percent: number;
  keywords_found: string[];
  keywords_missing: string[];
  checklist: ATSCheckItem[];
  overall_verdict: string;
}

export interface RoadmapTask {
  task: string;
  category?: 'linkedin' | 'github' | 'resume' | 'networking';
  time_estimate?: string;
  duration?: string;
  milestone?: string;
  frequency?: 'daily' | 'weekly' | 'one-time';
}

export interface Roadmap {
  phase_1_immediate: RoadmapTask[];
  phase_2_projects: RoadmapTask[];
  phase_3_networking: RoadmapTask[];
}

export interface DiagnosticResult {
  readiness_score: ReadinessScore;
  linkedin_critique: LinkedInCritique;
  github_audit: GithubAudit;
  ats_results: ATSResults;
  roadmap: Roadmap;
  target_role: string;
  generated_at: string;
  github_repos?: GitHubRepo[];
}

export interface DiagnosticInput {
  githubUrl: string;
  targetRole: string;
  documents?: {
    fileName: string;
    base64: string;
    mimeType: string;
  }[];
}

export interface GitHubProfile {
  login: string;
  name: string;
  bio: string | null;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
  location: string | null;
  blog: string | null;
  repos: GitHubRepo[];
  topLanguages: Record<string, number>;
  hasProfileReadme: boolean;
}

export interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  topics: string[];
  fork: boolean;
  readme?: string;
  files?: string[];
}

export interface LinkedInData {
  name: string;
  headline: string;
  about: string;
  location: string;
  profile_picture_url: string | null;
  experience: Array<{ title: string; company: string; duration: string }>;
  education: Array<{ school: string; degree: string; year: string }>;
  skills: string[];
  featured: string[];
  connections: string;
  hasPhoto: boolean;
}
