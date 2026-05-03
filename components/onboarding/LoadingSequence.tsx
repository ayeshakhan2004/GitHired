'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, Zap } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Fetching GitHub repositories', sub: 'Scanning repos, languages & activity…', color: '#00D4FF' },
  { id: 2, label: 'Scraping LinkedIn profile', sub: 'Pulling headline, experience & skills…', color: '#8B5CF6' },
  { id: 3, label: 'Checking ATS compatibility', sub: 'Parsing resume keywords & format…', color: '#FFAA00' },
  { id: 4, label: 'Running AI diagnostic', sub: 'Scoring against your target role…', color: '#00FF87' },
];

export default function LoadingSequence() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    const timings = [3000, 7000, 11000, 16000];

    const timers = timings.map((delay, i) =>
      setTimeout(() => {
        setCompletedSteps(prev => [...prev, i]);
        if (i < STEPS.length - 1) setCurrentStep(i + 1);
      }, delay)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  const activeStep = STEPS[currentStep];

  return (
    <div className="min-h-screen bg-[#080B0F] grid-bg flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient radial glow that changes color with step */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.12 }}
        transition={{ duration: 1 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(ellipse, ${activeStep?.color} 0%, transparent 70%)` }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #00FF87, #00D4FF)' }}>
              <Zap size={14} className="text-black" />
            </div>
            <span className="font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Githired
            </span>
          </div>
          <h2 className="text-xl font-bold text-white/90 mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Running Diagnostic
          </h2>
          <p className="text-xs text-white/35">Analyzing your entire professional presence…</p>
        </motion.div>

        {/* Scan bar */}
        <div className="h-px bg-white/5 mb-8 overflow-hidden rounded-full relative">
          <motion.div
            className="absolute inset-y-0 w-1/3 rounded-full"
            style={{ background: `linear-gradient(90deg, transparent, ${activeStep?.color}, transparent)` }}
            animate={{ x: ['-100%', '400%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {STEPS.map((step, i) => {
            const isDone = completedSteps.includes(i);
            const isActive = currentStep === i && !isDone;
            const isPending = !isDone && !isActive;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isPending ? 0.3 : 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-500 ${
                  isDone
                    ? 'border-white/8 bg-white/[0.02]'
                    : isActive
                    ? 'border-white/15 bg-white/[0.04]'
                    : 'border-white/5 bg-transparent'
                }`}
              >
                {/* Icon */}
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <CheckCircle2 size={18} style={{ color: step.color }} />
                    </motion.div>
                  ) : isActive ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}>
                      <Loader2 size={18} style={{ color: step.color }} />
                    </motion.div>
                  ) : (
                    <div className="w-[18px] h-[18px] rounded-full border border-white/15" />
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium leading-snug ${isDone || isActive ? 'text-white/90' : 'text-white/30'}`}
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {step.label}
                  </p>
                  <AnimatePresence>
                    {isActive && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs mt-0.5"
                        style={{ color: step.color + '80' }}
                      >
                        {step.sub}
                      </motion.p>
                    )}
                    {isDone && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-white/25 mt-0.5"
                      >
                        Complete
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Step number */}
                <span className="text-xs font-mono text-white/15 shrink-0">0{step.id}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-xs text-white/20 mt-8"
        >
          This usually takes 20–45 seconds. Do not close this tab.
        </motion.p>
      </div>
    </div>
  );
}
