import React from 'react';

export interface DividerBlockProps {
  className?: string;
}

export function DividerBlock({ className = '' }: DividerBlockProps) {
  return <hr className={`border-border my-6 ${className}`} />;
}
