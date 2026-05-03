'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { DiagnosticResult } from '@/types/diagnostic';
import { TrendingUp, Target, Info } from 'lucide-react';

interface Props { result: DiagnosticResult; }

function scoreColor(score: number) {
  if (score >= 70) return '#00FF87';
  if (score >= 40) return '#FFAA00';
  return '#FF4444';
}
function scoreLabel(score: number) {
  if (score >= 80) return 'Hireable';
  if (score >= 60) return 'Strong';
  if (score >= 40) return 'Developing';
  return 'Weak';
}

function CircularGauge({ score }: { score: number }) {
  const [animated, setAnimated] = useState(0);
  const R = 80;
  const circumference = 2 * Math.PI * R;
  const color = scoreColor(score);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(score), 300);
    return () => clearTimeout(timer);
  }, [score]);

  const offset = circumference - (animated / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="200" height="200" viewBox="0 0 200 200" className="-rotate-90">
        {/* Track */}
        <circle cx="100" cy="100" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
        {/* Fill */}
        <motion.circle
          cx="100" cy="100" r={R}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ filter: `drop-shadow(0 0 8px ${color}60)` }}
        />
        {/* Background glow ring */}
        <circle cx="100" cy="100" r={R} fill="none" stroke={color} strokeWidth="24"
          opacity="0.04" />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="text-5xl font-bold"
          style={{ color, fontFamily: "'Space Grotesk', sans-serif", textShadow: `0 0 30px ${color}40` }}
        >
          {score}
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-xs text-white/40 mt-1"
        >
          out of 100
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-sm font-semibold mt-1"
          style={{ color, fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {scoreLabel(score)}
        </motion.span>
      </div>
    </div>
  );
}

function GapBar({ score, targetRole }: { score: number; targetRole: string }) {
  const hireableThreshold = 75;
  const gap = Math.max(0, hireableThreshold - score);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-white/40">
        <span>Current Position</span>
        <span>Interview-Ready Threshold</span>
      </div>
      <div className="relative h-3 bg-white/6 rounded-full overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${scoreColor(score)}, ${scoreColor(score)}99)` }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
        />
        {/* Threshold marker */}
        <div
          className="absolute top-0 h-full w-0.5 bg-white/30"
          style={{ left: `${hireableThreshold}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs">
        <span style={{ color: scoreColor(score) }} className="font-mono">{score}%</span>
        {gap > 0 ? (
          <span className="text-white/30">
            <span className="text-[#FFAA00] font-mono">+{gap} pts</span> needed to be hirable for {targetRole}
          </span>
        ) : (
          <span className="text-[#00FF87]">Above threshold ✓</span>
        )}
      </div>
    </div>
  );
}

export default function ExecutiveSummary({ result }: Props) {
  const { readiness_score, target_role } = result;

  return (
    <section>
      <SectionHeader
        label="A"
        title="Executive Summary"
        subtitle="Overall career readiness diagnostic"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Gauge card */}
        <div className="card-dark p-6 flex flex-col items-center gap-4">
          <div className="text-xs font-medium text-white/40 uppercase tracking-wider flex items-center gap-1.5">
            <Target size={12} />
            Readiness Score · {target_role}
          </div>
          <CircularGauge score={readiness_score.score} />
        </div>

        {/* Analysis card */}
        <div className="card-dark p-6 flex flex-col gap-6">
          <div>
            <div className="text-xs font-medium text-white/40 uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <TrendingUp size={12} />
              Gap Analysis
            </div>
            <GapBar score={readiness_score.score} targetRole={target_role} />
          </div>

          <div className="border-t border-white/8 pt-4">
            <div className="flex items-start gap-2">
              <Info size={13} className="text-white/30 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-white/60 mb-1">Score Reasoning</p>
                <p className="text-xs text-white/40 leading-relaxed">{readiness_score.reasoning}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/8 pt-4">
            <p className="text-xs font-medium text-white/60 mb-1">Biggest Gaps</p>
            <p className="text-xs text-white/40 leading-relaxed">{readiness_score.gap_summary}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({
  label, title, subtitle
}: { label: string; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-4 mb-6">
      <div className="w-8 h-8 rounded-lg border border-white/15 flex items-center justify-center shrink-0"
        style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>
        {label}
      </div>
      <div>
        <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {title}
        </h2>
        <p className="text-xs text-white/35 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}
