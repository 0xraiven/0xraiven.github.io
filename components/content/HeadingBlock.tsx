import React from 'react';

export interface HeadingBlockProps {
  level: 1 | 2 | 3;
  text?: string;
  children?: React.ReactNode;
  id?: string;
  className?: string;
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getNodeText(node: React.ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(getNodeText).join('');
  if (React.isValidElement(node) && node.props) {
    return getNodeText((node.props as { children?: React.ReactNode }).children);
  }
  return '';
}

export function HeadingBlock({
  level,
  text,
  children,
  id: explicitId,
  className = '',
}: HeadingBlockProps) {
  const contentText = text || getNodeText(children);
  const elementId = explicitId || slugifyHeading(contentText);

  const anchorPrefix = level === 1 ? '#' : level === 2 ? '##' : '###';

  const headingContent = (
    <a
      href={`#${elementId}`}
      className="hover:underline flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-xs"
    >
      <span className="text-accent opacity-60 group-hover:opacity-100 select-none">
        {anchorPrefix}
      </span>
      <span>{children || text}</span>
    </a>
  );

  switch (level) {
    case 1:
      return (
        <h1
          id={elementId}
          className={`text-lg font-bold tracking-tight text-text-primary font-mono pt-6 pb-2 border-b border-border flex items-center gap-2 group scroll-mt-20 ${className}`}
        >
          {headingContent}
        </h1>
      );
    case 2:
      return (
        <h2
          id={elementId}
          className={`text-sm font-semibold tracking-tight text-text-primary font-mono pt-5 pb-1.5 border-b border-border/60 flex items-center gap-2 group scroll-mt-20 ${className}`}
        >
          {headingContent}
        </h2>
      );
    case 3:
    default:
      return (
        <h3
          id={elementId}
          className={`text-xs font-semibold tracking-tight text-text-primary font-mono pt-4 pb-1 flex items-center gap-2 group scroll-mt-20 ${className}`}
        >
          {headingContent}
        </h3>
      );
  }
}
