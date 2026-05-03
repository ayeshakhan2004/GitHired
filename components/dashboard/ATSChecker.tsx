'use client';

import { motion } from 'framer-motion';
import { ATSResults } from '@/types/diagnostic';
import { SectionHeader } from './ExecutiveSummary';
import { CheckCircle2, XCircle, AlertCircle, TrendingUp } from 'lucide-react';

interface Props { results: ATSResults; }

function StatusIcon({ status }: { status: 'pass' | 'fail' | 'warning' }) {
  if (status === 'pass') return <CheckCircle2 size={16} className="text-[#00FF87] shrink-0" />;
  if (status === 'fail') return <XCircle size={16} className="text-red-400 shrink-0" />;
  return <AlertCircle size={16} className="text-amber-400 shrink-0" />;
}

function statusColor(status: string) {
  if (status === 'pass') return '#00FF87';
  if (status === 'fail') return '#FF4444';
  return '#FFAA00';
}

export default function ATSChecker({ results }: Props) {
  const passed = results.checklist.filter(c => c.status === 'pass').length;
  const total = results.checklist.length;
  const pct = results.keyword_match_percent;
  const pctColor = pct >= 70 ? '#00FF87' : pct >= 40 ? '#FFAA00' : '#FF4444';

  return (
    <section>
      <SectionHeader label="D" title="ATS Resume Check" subtitle="Applicant Tracking System compatibility analysis" />

      {/* Score bar + verdict */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* Keyword match */}
        <div className="card-dark p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-white/50 flex items-center gap-1.5">
              <TrendingUp size={12} /> Keyword Match
            </span>
            <span className="text-2xl font-bold" style={{ color: pctColor, fontFamily: "'Space Grotesk', sans-serif" }}>
              {pct}%
            </span>
          </div>
          <div className="h-2 bg-white/6 rounded-full overflow-hidden mb-2">
            <motion.div
              className="h-full rounded-full"
              style={{ background: pctColor }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
            />
          </div>
          <p className="text-xs text-white/35 leading-relaxed">{results.overall_verdict}</p>
        </div>

        {/* Checklist score */}
        <div className="card-dark p-5">
          <div className="text-xs font-medium text-white/50 mb-3">ATS Checks Passed</div>
          <div className="flex items-end gap-2 mb-3">
            <span className="text-3xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{passed}</span>
            <span className="text-lg text-white/30 mb-0.5">/ {total}</span>
          </div>
          <div className="flex gap-1">
            {results.checklist.map((item, i) => (
              <div key={i} className="flex-1 h-1.5 rounded-full"
                style={{ background: statusColor(item.status) + (item.status === 'pass' ? '' : '60') }} />
            ))}
          </div>
        </div>
      </div>

      {/* Full checklist */}
      <div className="card-dark overflow-hidden mb-5">
        <div className="px-5 py-3 border-b border-white/8">
          <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">ATS Compatibility Checks</span>
        </div>
        <div className="divide-y divide-white/5">
          {results.checklist.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-start gap-3 px-5 py-3.5 check-row"
            >
              <StatusIcon status={item.status} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/80 mb-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {item.item}
                </p>
                <p className="text-xs text-white/40 leading-relaxed">{item.explanation}</p>
              </div>
              <span className="text-xs font-mono shrink-0 mt-0.5" style={{ color: statusColor(item.status) }}>
                {item.status.toUpperCase()}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Keywords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Found */}
        <div className="card-dark p-4">
          <div className="text-xs font-semibold text-[#00FF87]/70 mb-3 flex items-center gap-1.5">
            <CheckCircle2 size={12} /> Keywords Found ({results.keywords_found.length})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {results.keywords_found.map(kw => (
              <span key={kw} className="badge badge-green text-xs">{kw}</span>
            ))}
            {results.keywords_found.length === 0 && (
              <span className="text-xs text-white/30">No matching keywords detected</span>
            )}
          </div>
        </div>

        {/* Missing */}
        <div className="card-dark p-4">
          <div className="text-xs font-semibold text-red-400/80 mb-3 flex items-center gap-1.5">
            <XCircle size={12} /> Keywords Missing ({results.keywords_missing.length})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {results.keywords_missing.map(kw => (
              <span key={kw} className="badge badge-red text-xs">{kw}</span>
            ))}
            {results.keywords_missing.length === 0 && (
              <span className="text-xs text-[#00FF87]/50">All key terms present ✓</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
