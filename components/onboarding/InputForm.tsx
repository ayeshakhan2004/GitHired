'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, FileText, Target, Upload, X, AlertCircle, Zap, Image as ImageIcon } from 'lucide-react';
import { DiagnosticInput } from '@/types/diagnostic';

interface Props {
  onSubmit: (data: DiagnosticInput) => void;
  error: string;
  onClearError: () => void;
}

const GITHUB_RE = /github\.com\//i;

type AttachedDoc = {
  fileName: string;
  base64: string;
  mimeType: string;
};

export default function InputForm({ onSubmit, error, onClearError }: Props) {
  const [githubUrl, setGithubUrl] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [documents, setDocuments] = useState<AttachedDoc[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  function validate() {
    const errs: Record<string, string> = {};
    if (!githubUrl) errs.github = 'GitHub URL is required';
    else if (!GITHUB_RE.test(githubUrl)) errs.github = 'Must be a valid github.com/ URL';
    if (!targetRole.trim() || targetRole.trim().length < 3)
      errs.role = 'Please select or enter your target tech domain';
    return errs;
  }

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];
    const validExts = ['.pdf', '.png', '.jpg', '.jpeg', '.webp', '.txt'];
    
    if (documents.length + files.length > 5) {
      setFieldErrors(e => ({ ...e, resume: 'You can only attach up to 5 documents.' }));
      return;
    }

    const newDocs: AttachedDoc[] = [];
    let hasError = false;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const hasValidExt = validExts.some(ext => file.name.toLowerCase().endsWith(ext));
      
      if (!validTypes.includes(file.type) && !hasValidExt) {
        setFieldErrors(e => ({ ...e, resume: `Invalid file type: ${file.name}. PDF, image, or TXT only.` }));
        hasError = true;
        break;
      }
      if (file.size > 5 * 1024 * 1024) {
        setFieldErrors(e => ({ ...e, resume: `File too large (max 5MB): ${file.name}` }));
        hasError = true;
        break;
      }

      // Read as base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1] || '');
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      newDocs.push({
        fileName: file.name,
        base64,
        mimeType: file.type || 'application/pdf',
      });
    }

    if (!hasError) {
      setDocuments(prev => [...prev, ...newDocs]);
      setFieldErrors(e => ({ ...e, resume: '' }));
    }
    
    // Reset file input so same file can be selected again if removed
    if (fileRef.current) fileRef.current.value = '';
  }, [documents.length]);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  }

  function removeDoc(index: number) {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onClearError();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFieldErrors(errs); return; }
    setFieldErrors({});
    onSubmit({ githubUrl, documents, targetRole });
  }

  const domains = ['Frontend Development', 'Backend Engineering', 'Full Stack Development', 'Cybersecurity', 'Data Science', 'Machine Learning & AI', 'Cloud & DevOps', 'Mobile App Development'];

  return (
    <div className="min-h-screen bg-[#080B0F] grid-bg flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-10"
        style={{ background: 'radial-gradient(ellipse, #00FF87 0%, transparent 70%)' }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #00FF87, #00D4FF)' }}>
              <Zap size={16} className="text-black" />
            </div>
            <span className="font-display text-xl font-700 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}>
              Githired
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold mb-2 gradient-text"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Career Diagnostic
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-white/40 max-w-xs mx-auto leading-relaxed"
          >
            AI-powered analysis of your GitHub &amp; resume. Get a ranked execution plan in under 60 seconds.
          </motion.p>
        </div>

        {/* Form card */}
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          onSubmit={handleSubmit}
          className="card-dark p-6 space-y-5"
        >
          {/* GitHub */}
          <Field
            icon={<Github size={15} />}
            label="GitHub Profile URL"
            required
            error={fieldErrors.github}
          >
            <input
              className={`input-field pl-9 ${fieldErrors.github ? 'error' : ''}`}
              placeholder="https://github.com/yourusername"
              value={githubUrl}
              onChange={e => { setGithubUrl(e.target.value); setFieldErrors(f => ({ ...f, github: '' })); }}
            />
          </Field>

          {/* Target Domain */}
          <Field
            icon={<Target size={15} />}
            label="Target Tech Domain"
            required
            error={fieldErrors.role}
          >
            <input
              list="domains"
              className={`input-field pl-9 ${fieldErrors.role ? 'error' : ''}`}
              placeholder="e.g. Frontend Development"
              value={targetRole}
              onChange={e => { setTargetRole(e.target.value); setFieldErrors(f => ({ ...f, role: '' })); }}
            />
            <datalist id="domains">
              {domains.map(d => <option key={d} value={d} />)}
            </datalist>
          </Field>

          {/* Multiple Document Upload */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-white/50 flex items-center gap-1.5">
                <FileText size={13} />
                Attach Documents / Images
                <span className="text-white/25 ml-1">Optional</span>
              </label>
              {documents.length > 0 && (
                <span className="text-[10px] font-medium text-[#00FF87] bg-[#00FF87]/10 px-2 rounded-full">
                  {documents.length} / 5 attached
                </span>
              )}
            </div>

            <div
              className={`relative border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-all duration-200 ${
                dragOver
                  ? 'border-[#00FF87]/50 bg-[#00FF87]/5'
                  : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
              }`}
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <input
                ref={fileRef}
                type="file"
                multiple
                accept=".pdf,.txt,.png,.jpg,.jpeg,.webp"
                className="hidden"
                onChange={e => handleFiles(e.target.files!)}
              />
              
              <Upload size={18} className="mx-auto mb-2 text-white/30" />
              <p className="text-xs text-white/30">
                <span className="text-white/60">Click to attach files</span> or drag &amp; drop
              </p>
              <p className="text-[10px] text-white/20 mt-1">PDFs, Screenshots, or TXT · Max 5MB per file</p>
            </div>

            {/* Document List */}
            {documents.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {documents.map((doc, idx) => {
                  const isImage = doc.mimeType.startsWith('image/');
                  return (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-md bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 overflow-hidden">
                        {isImage ? <ImageIcon size={14} className="text-[#00D4FF] shrink-0" /> : <FileText size={14} className="text-[#00FF87] shrink-0" />}
                        <span className="text-xs text-white/70 truncate">{doc.fileName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeDoc(idx); }}
                        className="text-white/30 hover:text-red-400 transition-colors p-1"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {fieldErrors.resume && (
              <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                <AlertCircle size={11} /> {fieldErrors.resume}
              </p>
            )}
          </div>

          {/* Global error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3.5 rounded-lg font-semibold text-sm text-black relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #00FF87 0%, #00D4FF 100%)',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Zap size={15} />
              Run Full Diagnostic
            </span>
          </motion.button>

          <p className="text-center text-xs text-white/20">
            Analysis takes 20–45 seconds · No account required
          </p>
        </motion.form>
      </motion.div>
    </div>
  );
}

function Field({
  icon, label, required, hint, error, children,
}: {
  icon: React.ReactNode;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-white/50 flex items-center gap-1.5 mb-2">
        {icon}
        {label}
        {required && <span className="text-[#00FF87]/70 ml-0.5">*</span>}
        {hint && <span className="text-white/25 ml-1">{hint}</span>}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
          {icon}
        </div>
        {children}
      </div>
      {error && (
        <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}
