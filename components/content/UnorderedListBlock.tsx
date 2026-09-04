import React from 'react';

export interface UnorderedListBlockProps {
  items?: string[];
  children?: React.ReactNode;
  className?: string;
}

export function UnorderedListBlock({ items, children, className = '' }: UnorderedListBlockProps) {
  return (
    <ul className={`list-disc list-inside space-y-1.5 text-xs text-text-secondary font-mono my-3 pl-2 ${className}`}>
      {children ||
        (items || []).map((item, idx) => (
          <li key={idx} className="leading-relaxed">
            <span>{item}</span>
          </li>
        ))}
    </ul>
  );
}
