'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LinkedInCritique, LinkedInBadge } from '@/types/diagnostic';
import { SectionHeader } from './ExecutiveSummary';
import { User, MapPin, Copy, Check, X, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface Props { critique: LinkedInCritique; }

function severityStyle(severity: LinkedInBadge['severity']) {
  if (severity === 'critical') return { dot: '#FF4444', bg: 'bg-red-500/15', border: 'border-red-500/30', text: 'text-red-400', label: 'CRITICAL' };
  if (severity === 'warning') return { dot: '#FFAA00', bg: 'bg-amber-500/15', border: 'border-amber-500/30', text: 'text-amber-400', label: 'WARNING' };
  return { dot: '#00FF87', bg: 'bg-green-500/15', border: 'border-green-500/30', text: 'text-green-400', label: 'GOOD' };
}

function WarningDot({ badge, onClick, isActive }: { badge: LinkedInBadge; onClick: () => void; isActive: boolean }) {
  const s = severityStyle(badge.severity);
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center justify-center w-5 h-5 rounded-full transition-transform duration-150 ${isActive ? 'scale-125' : 'hover:scale-110'}`}
      title={badge.element}
    >
      <span className="absolute w-5 h-5 rounded-full opacity-30 animate-ping"
        style={{ background: s.dot }} />
      <span className="w-3 h-3 rounded-full border-2 border-[#0D1117]"
        style={{ background: s.dot }} />
    </button>
  );
}

function BadgeTooltip({ badge, onClose }: { badge: LinkedInBadge; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const s = severityStyle(badge.severity);

  async function copy() {
    await navigator.clipboard.writeText(badge.rewrite);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute z-50 left-0 top-8 w-80 rounded-xl border shadow-2xl"
      style={{ background: '#1A2030', borderColor: 'rgba(255,255,255,0.12)' }}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <span className={`badge ${s.bg.replace('bg-', 'badge-').split('/')[0]} text-xs`}
            style={{ background: s.dot + '20', color: s.dot, border: `1px solid ${s.dot}30` }}>
            ● {s.label} — {badge.element.toUpperCase()}
          </span>
          <button onClick={onClose} className="text-white/30 hover:text-white/70 -mt-0.5">
            <X size={14} />
          </button>
        </div>

        <div className="mb-3">
          <p className="text-xs font-medium text-white/50 mb-1.5 flex items-center gap-1">
            <AlertTriangle size={11} /> Why this is weak
          </p>
          <p className="text-xs text-white/60 leading-relaxed">{badge.problem}</p>
        </div>

        <div>
          <p className="text-xs font-medium text-[#00FF87]/70 mb-1.5 flex items-center gap-1">
            <CheckCircle size={11} /> Exact rewrite — copy & paste this
          </p>
          <div className="bg-black/30 rounded-lg p-3 relative">
            <p className="text-xs text-white/80 leading-relaxed pr-6 font-mono">{badge.rewrite}</p>
            <button
              onClick={copy}
              className="absolute top-2 right-2 text-white/30 hover:text-white/70 transition-colors"
            >
              {copied ? <Check size={13} className="text-[#00FF87]" /> : <Copy size={13} />}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ChecklistSection({ title, items, color }: { title: string; items: string[]; color: string }) {
  const [open, setOpen] = useState(true);
  const [checked, setChecked] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    const s = new Set(checked);
    s.has(i) ? s.delete(i) : s.add(i);
    setChecked(s);
  }

  return (
    <div className="card-dark overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/3 transition-colors"
      >
        <span className="text-sm font-semibold text-white/80" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {title}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color }}>{checked.size}/{items.length} done</span>
          {open ? <ChevronUp size={14} className="text-white/30" /> : <ChevronDown size={14} className="text-white/30" />}
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2">
              {items.map((item, i) => (
                <button
                  key={i}
                  onClick={() => toggle(i)}
                  className="w-full flex items-start gap-3 text-left p-2 rounded-lg hover:bg-white/5 transition-colors check-row"
                >
                  <div className={`mt-0.5 w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-all ${
                    checked.has(i)
                      ? 'border-transparent'
                      : 'border-white/20'
                  }`} style={{ background: checked.has(i) ? color : 'transparent' }}>
                    {checked.has(i) && <Check size={10} className="text-black" />}
                  </div>
                  <span className={`text-xs leading-relaxed ${checked.has(i) ? 'text-white/25 line-through' : 'text-white/60'}`}>
                    {item}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LinkedInVisualizer({ critique }: Props) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const { profile_data: p, badges } = critique;
  const badgeMap: Record<string, LinkedInBadge> = {};
  badges.forEach(b => { badgeMap[b.element] = b; });

  function toggleTooltip(element: string) {
    setActiveTooltip(prev => prev === element ? null : element);
  }

  function ElementBadge({ element }: { element: string }) {
    if (!badgeMap[element]) return null;
    return (
      <span className="inline-flex relative ml-1 align-middle">
        <WarningDot
          badge={badgeMap[element]}
          onClick={() => toggleTooltip(element)}
          isActive={activeTooltip === element}
        />
        <AnimatePresence>
          {activeTooltip === element && (
            <BadgeTooltip badge={badgeMap[element]} onClose={() => setActiveTooltip(null)} />
          )}
        </AnimatePresence>
      </span>
    );
  }

  return (
    <section>
      <SectionHeader label="B" title="Resume & Profile Review" subtitle="AI-extracted insights from your resume — click the colored dots for details" />

      {/* LinkedIn profile replica */}
      <div className="card-dark overflow-hidden mb-5">
        {/* Cover photo area */}
        <div className="h-24 relative" style={{ background: 'linear-gradient(135deg, #1A2A4A, #0D1B30)' }}>
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 20px)' }} />
          <div className="absolute bottom-2 right-3">
            <ElementBadge element="photo" />
          </div>
        </div>

        <div className="px-5 pb-5">
          {/* Avatar row */}
          <div className="flex items-end justify-between -mt-8 mb-3">
            <div className="w-16 h-16 rounded-full border-2 border-[#0D1117] bg-white/10 flex items-center justify-center relative">
              {p.profile_picture_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.profile_picture_url} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <User size={22} className="text-white/30" />
              )}
            </div>
            <div className="flex gap-2 pb-1">
              <div className="px-3 py-1.5 rounded-full text-xs font-medium border border-[#00D4FF]/30 text-[#00D4FF]">
                Open to Work
              </div>
            </div>
          </div>

          {/* Name & headline */}
          <div className="mb-1">
            <h3 className="text-base font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {p.name}
            </h3>
          </div>

          <div className="flex items-start gap-1 mb-2 relative">
            <p className="text-sm text-white/60 leading-snug flex-1">{p.headline}</p>
            <ElementBadge element="headline" />
          </div>

          <div className="flex items-center gap-1 text-xs text-white/35 mb-4">
            <MapPin size={11} />
            {p.location}
            {p.connections && (
              <>
                <span className="mx-1">·</span>
                <span className="text-[#00D4FF]/60">{p.connections} connections</span>
              </>
            )}
          </div>

          {/* About */}
          {p.about && (
            <div className="border-t border-white/8 pt-4 mb-4 relative">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-white/70">About</p>
                <ElementBadge element="about" />
              </div>
              <p className="text-xs text-white/45 leading-relaxed line-clamp-4">{p.about}</p>
            </div>
          )}

          {/* Featured */}
          <div className="border-t border-white/8 pt-4 mb-4 relative">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-white/70">Featured</p>
              <ElementBadge element="featured" />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {[1, 2].map(i => (
                <div key={i} className="w-36 h-16 rounded-lg bg-white/5 border border-white/8 shrink-0 flex items-center justify-center">
                  <span className="text-xs text-white/20">No featured items</span>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="border-t border-white/8 pt-4 relative">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-white/70">Experience</p>
              <ElementBadge element="experience" />
            </div>
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 rounded bg-white/6 shrink-0" />
                  <div>
                    <div className="h-2.5 w-32 bg-white/10 rounded mb-1.5" />
                    <div className="h-2 w-24 bg-white/6 rounded mb-1" />
                    <div className="h-2 w-16 bg-white/4 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-5 px-1">
        <span className="text-xs text-white/30">Click the dots to see critique & rewrite:</span>
        {(['critical', 'warning', 'good'] as const).map(sev => {
          const s = severityStyle(sev);
          return (
            <div key={sev} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.dot }} />
              <span className="text-xs" style={{ color: s.dot }}>{s.label}</span>
            </div>
          );
        })}
      </div>

      {/* All badges list */}
      {badges.length > 0 && (
        <div className="space-y-2 mb-6">
          {badges.map((badge) => {
            const s = severityStyle(badge.severity);
            return (
              <motion.div
                key={badge.element}
                whileHover={{ x: 2 }}
                className={`rounded-lg border p-3 cursor-pointer ${s.bg} ${s.border}`}
                onClick={() => toggleTooltip(badge.element)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5">
                      {badge.severity === 'good' ? <CheckCircle size={13} style={{ color: s.dot }} /> :
                        badge.severity === 'warning' ? <AlertTriangle size={13} style={{ color: s.dot }} /> :
                          <XCircle size={13} style={{ color: s.dot }} />}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-semibold" style={{ color: s.dot }}>
                          {badge.element.charAt(0).toUpperCase() + badge.element.slice(1)}
                        </span>
                        <span className="badge" style={{ background: s.dot + '15', color: s.dot, border: `1px solid ${s.dot}25`, fontSize: '10px' }}>
                          {s.label}
                        </span>
                      </div>
                      <p className="text-xs text-white/50 leading-snug">{badge.problem}</p>
                    </div>
                  </div>
                  <ChevronDown size={12} className="text-white/25 shrink-0 mt-0.5" />
                </div>
                <AnimatePresence>
                  {activeTooltip === badge.element && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-3 pt-3 border-t border-white/10"
                    >
                      <p className="text-xs font-medium text-[#00FF87]/70 mb-1.5">✦ Exact rewrite:</p>
                      <div className="bg-black/30 rounded-lg p-3 flex items-start justify-between gap-2">
                        <p className="text-xs text-white/80 leading-relaxed font-mono">{badge.rewrite}</p>
                        <CopyButton text={badge.rewrite} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Checklists */}
      <div className="space-y-3">
        {critique.posts_to_make.length > 0 && (
          <ChecklistSection title="📝 Posts to Create This Week" items={critique.posts_to_make} color="#00D4FF" />
        )}
        {critique.featured_to_add.length > 0 && (
          <ChecklistSection title="⭐ What to Add to Featured" items={critique.featured_to_add} color="#8B5CF6" />
        )}
        {critique.sections_to_remove.length > 0 && (
          <ChecklistSection title="🗑 Sections to Remove or Rework" items={critique.sections_to_remove} color="#FF6B6B" />
        )}
      </div>
    </section>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function copy(e: React.MouseEvent) {
    e.stopPropagation();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button onClick={copy} className="text-white/30 hover:text-white/70 shrink-0 transition-colors">
      {copied ? <Check size={13} className="text-[#00FF87]" /> : <Copy size={13} />}
    </button>
  );
}
