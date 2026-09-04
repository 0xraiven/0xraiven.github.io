import React from 'react';

export interface QuoteBlockProps {
  text?: string;
  source?: string;
  children?: React.ReactNode;
  className?: string;
}

export function QuoteBlock({ text, source, children, className = '' }: QuoteBlockProps) {
  return (
    <figure className={`my-4 border-l-2 border-accent pl-4 py-2 bg-surface-2/40 rounded-r ${className}`}>
      <blockquote className="text-text-primary italic text-xs font-mono leading-relaxed">
        {children || text}
      </blockquote>
      {source && (
        <figcaption className="text-[11px] font-mono text-text-secondary mt-1.5 not-italic">
          — <cite>{source}</cite>
        </figcaption>
      )}
    </figure>
  );
}
