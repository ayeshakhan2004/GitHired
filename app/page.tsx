'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Github, Zap, Terminal, Code, Cpu } from 'lucide-react';

export default function LandingPage() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const router = useRouter();

  function handleSignIn() {
    setIsAuthenticating(true);
    // Mock authentication delay before redirect
    setTimeout(() => {
      router.push('/diagnose');
    }, 800);
  }

  return (
    <div className="min-h-screen bg-[#080B0F] grid-bg flex items-center justify-center relative overflow-hidden font-sans">
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-[100px]"
        style={{ background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full opacity-10 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #00D4FF 0%, transparent 70%)' }} />

      <div className="w-full max-w-4xl px-6 relative z-10">
        
        {/* Navigation / Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute top-0 left-0 w-full flex items-center justify-between p-8"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#00FF87] to-[#00D4FF]">
              <Zap size={16} className="text-black" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white font-display" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Githired
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/50">
            <span className="hover:text-white transition-colors cursor-pointer">Features</span>
            <span className="hover:text-white transition-colors cursor-pointer">Testimonials</span>
            <span className="hover:text-white transition-colors cursor-pointer">Pricing</span>
          </div>
        </motion.div>

        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center text-center mt-24 md:mt-0">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#00FF87] animate-pulse"></span>
            <span className="text-xs font-medium text-white/70">Githired AI Engine 2.0 is now live</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/50"
            style={{ fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.1 }}
          >
            Level up your tech career. <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00FF87] to-[#00D4FF]">
              In seconds.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg md:text-xl text-white/40 max-w-2xl mb-12 leading-relaxed"
          >
            Connect your GitHub and upload your resume to instantly receive an actionable, 
            AI-driven roadmap designed to make you undeniably hireable in your target domain.
          </motion.p>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col items-center gap-4 w-full max-w-xs"
          >
            <button
              onClick={handleSignIn}
              disabled={isAuthenticating}
              className="w-full relative group overflow-hidden rounded-xl bg-white text-black font-semibold text-sm py-4 px-6 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isAuthenticating ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Github size={20} />
                    Sign in with GitHub
                  </>
                )}
              </span>
            </button>
            <span className="text-xs text-white/30 font-medium">No credit card required. Free forever.</span>
          </motion.div>
        </div>

        {/* Feature Highlights Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-white/5"
        >
          {[
            { icon: <Terminal size={20} />, title: "Codebase Audits", desc: "Deep analysis of your repos, highlighting your strongest technical traits." },
            { icon: <Cpu size={20} />, title: "ATS Optimization", desc: "Checks your resume against the harsh constraints of automated trackers." },
            { icon: <Code size={20} />, title: "Custom Roadmaps", desc: "A tailored, step-by-step checklist to bridge the gap to your target role." }
          ].map((feature, idx) => (
            <div key={idx} className="flex flex-col items-center md:items-start text-center md:text-left gap-3 p-4 rounded-2xl hover:bg-white/[0.02] transition-colors">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#00D4FF] mb-2 border border-white/10">
                {feature.icon}
              </div>
              <h3 className="text-sm font-semibold text-white/90">{feature.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
        
      </div>
    </div>
  );
}
