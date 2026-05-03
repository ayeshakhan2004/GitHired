'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { DiagnosticResult } from '@/types/diagnostic';
import ExecutiveSummary from './ExecutiveSummary';
import LinkedInVisualizer from './LinkedInVisualizer';
import GitHubAudit from './GitHubAudit';
import ATSChecker from './ATSChecker';
import ExecutionRoadmap from './ExecutionRoadmap';
import {
  BarChart3, FileText as FileTextIcon, Github, FileText, Map, RotateCcw, Zap, Download, ChevronRight
} from 'lucide-react';

interface Props {
  result: DiagnosticResult;
  onReset: () => void;
}

const SECTIONS = [
  { id: 'summary', label: 'Executive Summary', icon: BarChart3, color: '#00FF87' },
  { id: 'linkedin', label: 'Resume Review', icon: FileTextIcon, color: '#00D4FF' },
  { id: 'github', label: 'GitHub Audit', icon: Github, color: '#8B5CF6' },
  { id: 'ats', label: 'ATS Resume Check', icon: FileText, color: '#FFAA00' },
  { id: 'roadmap', label: 'Execution Roadmap', icon: Map, color: '#FF6B9D' },
];

function scoreColor(score: number) {
  if (score >= 70) return '#00FF87';
  if (score >= 40) return '#FFAA00';
  return '#FF4444';
}

export default function Dashboard({ result, onReset }: Props) {
  const [activeSection, setActiveSection] = useState('summary');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  function scrollTo(id: string) {
    setActiveSection(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const score = result.readiness_score.score;

  return (
    <div className="min-h-screen bg-[#080B0F] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-white/8 sticky top-0 h-screen bg-[#0A0D12]">
        {/* Brand */}
        <div className="p-5 border-b border-white/8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #00FF87, #00D4FF)' }}>
              <Zap size={13} className="text-black" />
            </div>
            <span className="font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Githired</span>
          </div>
        </div>

        {/* Score badge */}
        <div className="p-4 border-b border-white/8">
          <div className="rounded-xl p-3.5" style={{ background: `${scoreColor(score)}10`, border: `1px solid ${scoreColor(score)}20` }}>
            <div className="text-xs text-white/40 mb-1" style={{ fontFamily: 'JetBrains Mono, monospace' }}>READINESS SCORE</div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold" style={{ color: scoreColor(score), fontFamily: "'Space Grotesk', sans-serif" }}>
                {score}
              </span>
              <span className="text-sm text-white/30 mb-0.5">/ 100</span>
            </div>
            <div className="text-xs mt-1 font-medium" style={{ color: scoreColor(score) }}>
              {result.readiness_score.label}
            </div>
          </div>
        </div>

        {/* Target role */}
        <div className="px-4 py-3 border-b border-white/8">
          <div className="text-xs text-white/30 mb-1">Target Role</div>
          <div className="text-xs text-white/70 font-medium leading-snug">{result.target_role}</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            const isActive = activeSection === s.id;
            return (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 text-left ${
                  isActive
                    ? 'bg-white/8 text-white'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                }`}
              >
                <Icon size={14} style={{ color: isActive ? s.color : undefined }} />
                <span className="flex-1" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '12.5px' }}>
                  {s.label}
                </span>
                {isActive && <ChevronRight size={12} style={{ color: s.color }} />}
              </button>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-white/8 space-y-2">
          <button
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs text-white/40 hover:text-white/70 hover:bg-white/5 transition-all border border-white/8"
          >
            <RotateCcw size={12} /> New Diagnostic
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-40 bg-[#0A0D12]/95 backdrop-blur border-b border-white/8 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-[#00FF87]" />
            <span className="font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Githired</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold" style={{ color: scoreColor(score) }}>{score}/100</span>
            <button onClick={onReset} className="text-white/40 hover:text-white/70">
              <RotateCcw size={15} />
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="lg:hidden overflow-x-auto border-b border-white/8 bg-[#0A0D12]">
          <div className="flex px-4 gap-1 py-2 min-w-max">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              const isActive = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${
                    isActive ? 'bg-white/10 text-white' : 'text-white/40'
                  }`}
                >
                  <Icon size={12} style={{ color: isActive ? s.color : undefined }} />
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sections */}
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8 space-y-16">
          {[
            { id: 'summary', Component: ExecutiveSummary, props: { result } },
            { id: 'linkedin', Component: LinkedInVisualizer, props: { critique: result.linkedin_critique } },
            { id: 'github', Component: GitHubAudit, props: { audit: result.github_audit, targetRole: result.target_role, repos: result.github_repos || [] } },
            { id: 'ats', Component: ATSChecker, props: { results: result.ats_results } },
            { id: 'roadmap', Component: ExecutionRoadmap, props: { roadmap: result.roadmap } },
          ].map(({ id, Component, props }, idx) => (
            <motion.div
              key={id}
              ref={el => { sectionRefs.current[id] = el; }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
            >
              {/* @ts-ignore - dynamic props */}
              <Component {...props} />
            </motion.div>
          ))}

          <div className="text-center pb-8">
            <p className="text-xs text-white/20">
              Diagnostic generated {new Date(result.generated_at).toLocaleString()} · Githired
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
