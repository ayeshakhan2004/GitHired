'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Roadmap } from '@/types/diagnostic';
import { SectionHeader } from './ExecutiveSummary';
import { Flame, Wrench, Radio, Clock, ChevronDown, ChevronUp, Check } from 'lucide-react';

interface Props { roadmap: Roadmap; }

const CATEGORY_STYLES: Record<string, { color: string; label: string }> = {
  linkedin: { color: '#00D4FF', label: 'LinkedIn' },
  github: { color: '#8B5CF6', label: 'GitHub' },
  resume: { color: '#FFAA00', label: 'Resume' },
  networking: { color: '#FF6B9D', label: 'Network' },
};

const FREQ_STYLES: Record<string, string> = {
  daily: '#FF4444',
  weekly: '#00D4FF',
  'one-time': '#00FF87',
};

export default function ExecutionRoadmap({ roadmap }: Props) {
  const [openPhase, setOpenPhase] = useState<number>(0);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  function toggleCheck(key: string) {
    const s = new Set(checked);
    s.has(key) ? s.delete(key) : s.add(key);
    setChecked(s);
  }

  const phases = [
    {
      num: 1,
      label: 'Immediate Fixes',
      subtitle: 'This week — quick wins that move the needle fast',
      icon: Flame,
      color: '#FF6B6B',
      tasks: roadmap.phase_1_immediate,
      renderTask: (task: typeof roadmap.phase_1_immediate[0], key: string) => (
        <div className="flex items-start gap-3">
          <button
            onClick={() => toggleCheck(key)}
            className={`mt-0.5 w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-all ${
              checked.has(key) ? 'border-transparent' : 'border-white/20'
            }`}
            style={{ background: checked.has(key) ? '#FF6B6B' : 'transparent' }}
          >
            {checked.has(key) && <Check size={9} className="text-white" />}
          </button>
          <div className="flex-1 min-w-0">
            <p className={`text-sm leading-snug ${checked.has(key) ? 'text-white/25 line-through' : 'text-white/75'}`}>
              {task.task}
            </p>
            <div className="flex items-center gap-2 mt-1">
              {task.category && (
                <span className="badge" style={{
                  background: (CATEGORY_STYLES[task.category]?.color || '#fff') + '15',
                  color: CATEGORY_STYLES[task.category]?.color || '#fff',
                  border: `1px solid ${(CATEGORY_STYLES[task.category]?.color || '#fff')}25`,
                  fontSize: '10px',
                }}>
                  {CATEGORY_STYLES[task.category]?.label}
                </span>
              )}
              {task.time_estimate && (
                <span className="flex items-center gap-1 text-xs text-white/30">
                  <Clock size={10} /> {task.time_estimate}
                </span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      num: 2,
      label: 'Projects to Build',
      subtitle: 'Next 30 days — tangible portfolio work',
      icon: Wrench,
      color: '#00D4FF',
      tasks: roadmap.phase_2_projects,
      renderTask: (task: typeof roadmap.phase_2_projects[0], key: string) => (
        <div className="flex items-start gap-3">
          <button
            onClick={() => toggleCheck(key)}
            className={`mt-0.5 w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-all ${
              checked.has(key) ? 'border-transparent' : 'border-white/20'
            }`}
            style={{ background: checked.has(key) ? '#00D4FF' : 'transparent' }}
          >
            {checked.has(key) && <Check size={9} className="text-black" />}
          </button>
          <div className="flex-1 min-w-0">
            <p className={`text-sm leading-snug ${checked.has(key) ? 'text-white/25 line-through' : 'text-white/75'}`}>
              {task.task}
            </p>
            <div className="flex items-center gap-3 mt-1">
              {task.duration && (
                <span className="flex items-center gap-1 text-xs text-white/30">
                  <Clock size={10} /> {task.duration}
                </span>
              )}
              {task.milestone && (
                <span className="text-xs text-[#00D4FF]/50">→ {task.milestone}</span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      num: 3,
      label: 'Networking & Content',
      subtitle: 'Ongoing — build visibility & inbound',
      icon: Radio,
      color: '#00FF87',
      tasks: roadmap.phase_3_networking,
      renderTask: (task: typeof roadmap.phase_3_networking[0], key: string) => (
        <div className="flex items-start gap-3">
          <button
            onClick={() => toggleCheck(key)}
            className={`mt-0.5 w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-all ${
              checked.has(key) ? 'border-transparent' : 'border-white/20'
            }`}
            style={{ background: checked.has(key) ? '#00FF87' : 'transparent' }}
          >
            {checked.has(key) && <Check size={9} className="text-black" />}
          </button>
          <div className="flex-1 min-w-0">
            <p className={`text-sm leading-snug ${checked.has(key) ? 'text-white/25 line-through' : 'text-white/75'}`}>
              {task.task}
            </p>
            {task.frequency && (
              <span className="badge mt-1" style={{
                background: (FREQ_STYLES[task.frequency] || '#fff') + '15',
                color: FREQ_STYLES[task.frequency] || '#fff',
                border: `1px solid ${(FREQ_STYLES[task.frequency] || '#fff')}25`,
                fontSize: '10px',
              }}>
                {task.frequency}
              </span>
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <section>
      <SectionHeader label="E" title="Execution Roadmap" subtitle="Your prioritized action plan — in order of impact" />

      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-5 top-10 bottom-10 w-px"
          style={{ background: 'linear-gradient(to bottom, rgba(0,255,135,0.3), rgba(0,212,255,0.2), rgba(0,255,135,0.05))' }} />

        <div className="space-y-3">
          {phases.map((phase, i) => {
            const Icon = phase.icon;
            const isOpen = openPhase === i;
            const doneCount = phase.tasks.filter((_, j) => checked.has(`${i}-${j}`)).length;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-12"
              >
                {/* Phase icon node */}
                <div
                  className="absolute left-0 w-10 h-10 rounded-xl border flex items-center justify-center z-10"
                  style={{
                    background: phase.color + '15',
                    borderColor: phase.color + '40',
                    boxShadow: `0 0 16px ${phase.color}20`,
                  }}
                >
                  <Icon size={16} style={{ color: phase.color }} />
                </div>

                {/* Phase card */}
                <div className="card-dark overflow-hidden">
                  <button
                    onClick={() => setOpenPhase(isOpen ? -1 : i)}
                    className="w-full flex items-center justify-between p-4 hover:bg-white/3 transition-colors text-left"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-mono" style={{ color: phase.color }}>Phase {phase.num}</span>
                        <span className="text-sm font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          {phase.label}
                        </span>
                      </div>
                      <p className="text-xs text-white/35">{phase.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs" style={{ color: phase.color }}>
                        {doneCount}/{phase.tasks.length} done
                      </span>
                      {isOpen ? <ChevronUp size={14} className="text-white/30" /> : <ChevronDown size={14} className="text-white/30" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        {/* Progress bar */}
                        <div className="px-4 pb-1">
                          <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${(doneCount / phase.tasks.length) * 100}%`, background: phase.color }}
                            />
                          </div>
                        </div>
                        <div className="px-4 pb-4 pt-2 space-y-3 border-t border-white/6">
                          {phase.tasks.map((task, j) => (
                            <div key={j}>
                              {/* @ts-ignore */}
                              {phase.renderTask(task, `${i}-${j}`)}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
