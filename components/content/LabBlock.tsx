import React from 'react';
import { FlaskConical } from 'lucide-react';

export interface LabBlockProps {
  target: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  objective?: string;
  environment?: string;
  children?: React.ReactNode;
  className?: string;
}

export function LabBlock({
  target,
  difficulty = 'medium',
  objective,
  environment,
  children,
  className = '',
}: LabBlockProps) {
  const difficultyStyles = {
    easy: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40',
    medium: 'text-amber-400 bg-amber-950/60 border-amber-500/40',
    hard: 'text-rose-400 bg-rose-950/60 border-rose-500/40',
  };

  const diffPill = difficultyStyles[difficulty] || difficultyStyles.medium;

  return (
    <div className={`my-4 p-4 rounded border border-purple-500/40 bg-purple-500/10 text-xs font-mono space-y-2.5 ${className}`}>
      <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
        <div className="flex items-center gap-2 text-purple-300 font-semibold tracking-wide uppercase text-[11px]">
          <FlaskConical className="w-4 h-4 shrink-0 text-purple-400" />
          <span>Lab Environment</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded bg-surface border border-border text-text-primary">
            Target: <span className="font-semibold text-accent">{target}</span>
          </span>
          <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border font-semibold ${diffPill}`}>
            {difficulty}
          </span>
        </div>
      </div>

      {environment && (
        <div className="text-[11px] text-purple-300/80">
          <span className="font-semibold text-purple-200">Environment:</span> {environment}
        </div>
      )}

      {objective && (
        <div className="space-y-1">
          <div className="text-[11px] font-semibold text-purple-300 uppercase tracking-wider">
            Objective:
          </div>
          <p className="text-text-secondary leading-relaxed pl-2 border-l border-purple-500/30">
            {objective}
          </p>
        </div>
      )}

      {children && (
        <div className="pt-2 text-text-secondary leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}
