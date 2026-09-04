'use client';

import React, { useState } from 'react';
import { Copy, Check, FileCode } from 'lucide-react';

export interface CodeBlockProps {
  language?: string;
  code?: string;
  filename?: string;
  children?: React.ReactNode;
  className?: string;
}

export function CodeBlock({
  language = 'text',
  code,
  filename,
  children,
  className = '',
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const rawCode = typeof code === 'string' ? code : typeof children === 'string' ? children : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className={`my-4 rounded border border-border bg-surface overflow-hidden group font-mono text-xs ${className}`}>
      <div className="flex items-center justify-between px-3.5 py-2 bg-surface-2 border-b border-border text-text-secondary text-[11px] select-none">
        <div className="flex items-center gap-2">
          {filename ? (
            <div className="flex items-center gap-1.5 text-text-primary font-medium">
              <FileCode className="w-3.5 h-3.5 text-accent" />
              <span>{filename}</span>
            </div>
          ) : (
            <span className="uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded bg-surface border border-border">
              {language}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code"
          className="flex items-center gap-1 hover:text-text-primary transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-xs px-1.5 py-0.5"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <pre className="p-4 overflow-x-auto text-text-primary leading-relaxed">
        <code>{children || rawCode}</code>
      </pre>
    </div>
  );
}
