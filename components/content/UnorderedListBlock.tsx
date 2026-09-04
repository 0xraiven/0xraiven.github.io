import React from 'react';

export interface UnorderedListBlockProps {
  items?: string[];
  children?: React.ReactNode;
  className?: string;
}

export function UnorderedListBlock({ items, children, className = '' }: UnorderedListBlockProps) {
  return (
    <ul className={`list-disc list-outside pl-6 space-y-2 text-sm text-text-secondary my-4 ${className}`}>
      {children ||
        (items || []).map((item, idx) => (
          <li key={idx} className="leading-relaxed pl-1">
            <span>{item}</span>
          </li>
        ))}
    </ul>
  );
}
