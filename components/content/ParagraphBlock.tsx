import React from 'react';

export interface ParagraphBlockProps {
  text?: string;
  children?: React.ReactNode;
  className?: string;
}

export function ParagraphBlock({ text, children, className = '' }: ParagraphBlockProps) {
  return (
    <p className={`text-xs font-mono text-text-secondary leading-relaxed my-3 ${className}`}>
      {children || text}
    </p>
  );
}
