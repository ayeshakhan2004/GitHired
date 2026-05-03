'use client';

import { useState } from 'react';
import InputForm from '@/components/onboarding/InputForm';
import LoadingSequence from '@/components/onboarding/LoadingSequence';
import Dashboard from '@/components/dashboard/Dashboard';
import { DiagnosticResult, DiagnosticInput } from '@/types/diagnostic';

type AppState = 'input' | 'loading' | 'result' | 'error';

export default function Home() {
  const [state, setState] = useState<AppState>('input');
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<DiagnosticInput | null>(null);

  async function handleSubmit(data: DiagnosticInput) {
    setFormData(data);
    setState('loading');
    setError('');

    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Diagnostic failed');
      }

      const diagnostic: DiagnosticResult = await res.json();
      setResult(diagnostic);
      setState('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setState('error');
    }
  }

  function handleReset() {
    setState('input');
    setResult(null);
    setError('');
    setFormData(null);
  }

  if (state === 'loading') return <LoadingSequence />;
  if (state === 'result' && result) return <Dashboard result={result} onReset={handleReset} />;

  return (
    <InputForm
      onSubmit={handleSubmit}
      error={state === 'error' ? error : ''}
      onClearError={() => setError('')}
    />
  );
}
