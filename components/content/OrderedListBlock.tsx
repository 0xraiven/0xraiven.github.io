import React from 'react';

export interface OrderedListBlockProps {
  items?: string[];
  children?: React.ReactNode;
  className?: string;
}

export function OrderedListBlock({ items, children, className = '' }: OrderedListBlockProps) {
  return (
    <ol className={`list-decimal list-outside pl-6 space-y-2 text-sm text-text-secondary my-4 ${className}`}>
      {children ||
        (items || []).map((item, idx) => (
          <li key={idx} className="leading-relaxed pl-1">
            <span>{item}</span>
          </li>
        ))}
    </ol>
  );
}
