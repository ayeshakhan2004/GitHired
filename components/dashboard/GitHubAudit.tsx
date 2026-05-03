'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GithubAudit as GithubAuditType, GitHubRepo } from '@/types/diagnostic';
import { SectionHeader } from './ExecutiveSummary';
import {
  Star, GitFork, AlertTriangle, Trash2, Copy, Check,
  Lightbulb, ChevronDown, ChevronUp, Code, Zap, BookOpen
} from 'lucide-react';

interface Props {
  audit: GithubAuditType;
  targetRole: string;
  repos: GitHubRepo[];
}

const FLAG_STYLES: Record<string, { color: string; bg: string; border: string; label: string; icon: typeof AlertTriangle }> = {
  foundational_project: { color: '#00D4FF', bg: 'bg-sky-500/10', border: 'border-sky-500/20', label: 'Skill Builder', icon: Lightbulb },
  needs_revival: { color: '#FFAA00', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Needs Revival', icon: Zap },
  no_readme: { color: '#FFAA00', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'No README', icon: BookOpen },
  weak_description: { color: '#8B5CF6', bg: 'bg-purple-500/10', border: 'border-purple-500/20', label: 'Weak Description', icon: AlertTriangle },
};

const COMPLEXITY_BADGE = {
  beginner: { color: '#00FF87', label: 'Beginner' },
  medium: { color: '#00D4FF', label: 'Intermediate' },
  advanced: { color: '#8B5CF6', label: 'Advanced' },
};

const LANG_COLORS: Record<string, string> = {
  JavaScript: '#F7DF1E', TypeScript: '#3178C6', Python: '#3572A5', Rust: '#DEA584',
  Go: '#00ADD8', Java: '#B07219', 'C++': '#F34B7D', CSS: '#563D7C', HTML: '#E34C26',
  Ruby: '#701516', PHP: '#4F5D95', Swift: '#F05138', Kotlin: '#A97BFF', Dart: '#00B4AB',
};

function CopyBtn({ text }: { text: string }) {
  const [c, setC] = useState(false);
  async function copy(e: React.MouseEvent) {
    e.stopPropagation();
    await navigator.clipboard.writeText(text);
    setC(true);
    setTimeout(() => setC(false), 2000);
  }
  return (
    <button onClick={copy} className="text-white/30 hover:text-white/60 transition-colors">
      {c ? <Check size={12} className="text-[#00FF87]" /> : <Copy size={12} />}
    </button>
  );
}

export default function GitHubAuditSection({ audit, targetRole, repos }: Props) {
  const [expandedRepo, setExpandedRepo] = useState<string | null>(null);
  const flaggedNames = new Set(audit.repo_flags.map(r => r.repo_name));

  const bioStatusColor = audit.bio_status === 'good' ? '#00FF87' : audit.bio_status === 'weak' ? '#FFAA00' : '#FF4444';
  const bioStatusLabel = audit.bio_status === 'good' ? 'Good' : audit.bio_status === 'weak' ? 'Weak — needs rewrite' : 'Missing — critical issue';

  return (
    <section>
      <SectionHeader label="C" title="GitHub Codebase Audit" subtitle={`Repository analysis for ${targetRole}`} />

      {/* GitHub profile card */}
      <div className="card-dark p-5 mb-5">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-14 h-14 rounded-full bg-white/8 border border-white/10 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 16 16" width="24" height="24" fill="rgba(255,255,255,0.5)">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                github.com/user
              </span>
            </div>
            {/* Bio analysis */}
            <div className="flex items-start gap-2">
              <p className="text-xs text-white/45 leading-relaxed flex-1 italic">
                {audit.bio_status === 'missing' ? 'No bio set' : '"Add your bio here…"'}
              </p>
              <span className="badge shrink-0 mt-0.5" style={{ background: bioStatusColor + '15', color: bioStatusColor, border: `1px solid ${bioStatusColor}25`, fontSize: '10px' }}>
                {bioStatusLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Bio rewrite suggestion */}
        {(audit.bio_status === 'missing' || audit.bio_status === 'weak') && (
          <div className="rounded-lg border border-[#00FF87]/20 bg-[#00FF87]/5 p-3 mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-[#00FF87]/80">✦ Recommended bio</span>
              <CopyBtn text={audit.bio_rewrite} />
            </div>
            <p className="text-xs text-white/70 font-mono leading-relaxed">{audit.bio_rewrite}</p>
          </div>
        )}

        {/* Overall assessment */}
        <p className="text-xs text-white/40 leading-relaxed">{audit.overall_assessment}</p>
      </div>

      {/* Flagged repos */}
      {audit.repo_flags.length > 0 && (
        <div className="mb-5">
          <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Lightbulb size={12} className="text-[#00D4FF]" />
            Repositories to Level Up ({audit.repo_flags.length})
          </h3>
          <div className="space-y-2">
            {audit.repo_flags.map((repo) => {
              const style = FLAG_STYLES[repo.flag_type] || FLAG_STYLES.foundational_project;
              const Icon = style.icon;
              const isExpanded = expandedRepo === repo.repo_name;

              return (
                <motion.div
                  key={repo.repo_name}
                  className={`rounded-xl border overflow-hidden ${style.bg} ${style.border}`}
                >
                  <button
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-white/3 transition-colors"
                    onClick={() => setExpandedRepo(isExpanded ? null : repo.repo_name)}
                  >
                    <Icon size={14} style={{ color: style.color }} className="shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-white/80 truncate">{repo.repo_name}</span>
                        <span className="badge shrink-0" style={{ background: style.color + '15', color: style.color, border: `1px solid ${style.color}25`, fontSize: '10px' }}>
                          {style.label}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {repo.action === 'delete' && (
                        <span className="flex items-center gap-1 text-xs text-red-400">
                          <Trash2 size={11} /> delete
                        </span>
                      )}
                      {isExpanded ? <ChevronUp size={13} className="text-white/30" /> : <ChevronDown size={13} className="text-white/30" />}
                    </div>
                  </button>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-3 pt-1 border-t border-white/8">
                        <p className="text-xs text-white/50 leading-relaxed mb-2">{repo.reason}</p>
                        <span className="text-xs font-medium" style={{ color: style.color }}>
                          Recommended action: {repo.action}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* All Repositories */}
      {repos.length > 0 && (
        <div className="mb-5">
          <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Code size={12} className="text-[#8B5CF6]" />
            All Repositories ({repos.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {repos.map((repo) => {
              const isFlagged = flaggedNames.has(repo.name);
              const flagStyle = isFlagged
                ? FLAG_STYLES[audit.repo_flags.find(r => r.repo_name === repo.name)?.flag_type || ''] || FLAG_STYLES.foundational_project
                : null;
              return (
                <a
                  key={repo.name}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-dark p-3.5 hover:bg-white/[0.06] transition-colors group block"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-sm font-mono text-white/80 group-hover:text-white transition-colors truncate">
                      {repo.name}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      {isFlagged && flagStyle && (
                        <span className="badge" style={{
                          background: flagStyle.color + '15',
                          color: flagStyle.color,
                          border: `1px solid ${flagStyle.color}25`,
                          fontSize: '9px',
                        }}>
                          {flagStyle.label}
                        </span>
                      )}
                      {repo.stargazers_count > 0 && (
                        <span className="flex items-center gap-0.5 text-xs text-white/30">
                          <Star size={10} /> {repo.stargazers_count}
                        </span>
                      )}
                      {repo.forks_count > 0 && (
                        <span className="flex items-center gap-0.5 text-xs text-white/30">
                          <GitFork size={10} /> {repo.forks_count}
                        </span>
                      )}
                    </div>
                  </div>
                  {repo.description && (
                    <p className="text-xs text-white/35 leading-relaxed line-clamp-1 mb-1.5">
                      {repo.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3">
                    {repo.language && (
                      <span className="flex items-center gap-1 text-xs text-white/40">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ background: LANG_COLORS[repo.language] || '#666' }}
                        />
                        {repo.language}
                      </span>
                    )}
                    <span className="text-xs text-white/20">
                      {new Date(repo.updated_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Missing projects */}
      {audit.missing_projects.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Lightbulb size={12} className="text-[#00FF87]" />
            Projects You Should Build for {targetRole}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {audit.missing_projects.map((project, i) => {
              const comp = COMPLEXITY_BADGE[project.complexity];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="card-dark p-5 relative overflow-hidden"
                >
                  {/* Accent line */}
                  <div className="absolute top-0 left-0 right-0 h-0.5"
                    style={{ background: `linear-gradient(90deg, #00FF87, #00D4FF)` }} />

                  <div className="flex items-start justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: 'linear-gradient(135deg, #00FF87, #00D4FF)', opacity: 0.9 }}>
                      <Zap size={14} className="text-black" />
                    </div>
                    <span className="badge" style={{ background: comp.color + '15', color: comp.color, border: `1px solid ${comp.color}25`, fontSize: '10px' }}>
                      {comp.label}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {project.name}
                  </h4>
                  <p className="text-xs text-white/55 leading-relaxed mb-3">{project.pitch}</p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.tech_stack.map(tech => (
                      <span key={tech} className="badge" style={{
                        background: (LANG_COLORS[tech] || '#666') + '20',
                        color: LANG_COLORS[tech] || 'rgba(255,255,255,0.5)',
                        border: `1px solid ${(LANG_COLORS[tech] || '#666')}30`,
                        fontSize: '10px',
                      }}>
                        <Code size={9} /> {tech}
                      </span>
                    ))}
                  </div>

                  <div className="border-t border-white/8 pt-3">
                    <p className="text-xs text-white/35 leading-relaxed">
                      <span className="text-[#00FF87]/60 font-medium">Why it matters: </span>
                      {project.why_impressive}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
