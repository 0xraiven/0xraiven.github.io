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
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(getNodeText).join('');
  if (React.isValidElement(node)) {
    const props = node.props as {
      children?: React.ReactNode;
      node?: { text?: string; children?: React.ReactNode[] };
    };
    if (props) {
      if (typeof props.children !== 'undefined') {
        return getNodeText(props.children);
      }
      if (props.node) {
        if (typeof props.node.text === 'string') {
          return props.node.text;
        }
        if (props.node.children) {
          return getNodeText(props.node.children);
        }
      }
    }
  }
  if (typeof node === 'object' && node !== null && 'text' in node && typeof (node as { text?: unknown }).text === 'string') {
    return (node as { text: string }).text;
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

  const anchorLink = (
    <a
      href={`#${elementId}`}
      aria-label={`Link to section: ${contentText}`}
      className="opacity-0 group-hover:opacity-100 transition-opacity text-accent hover:underline text-xs ml-2 select-none"
    >
      #
    </a>
  );

  switch (level) {
    case 1:
      return (
        <h1
          id={elementId}
          className={`text-xl font-bold tracking-tight text-text-primary pt-8 pb-2 border-b border-border flex items-baseline justify-between group scroll-mt-20 ${className}`}
        >
          <span>{children || text}</span>
          {anchorLink}
        </h1>
      );
    case 2:
      return (
        <h2
          id={elementId}
          className={`text-base font-semibold tracking-tight text-text-primary pt-6 pb-2 border-b border-border/60 flex items-baseline justify-between group scroll-mt-20 ${className}`}
        >
          <span>{children || text}</span>
          {anchorLink}
        </h2>
      );
    case 3:
    default:
      return (
        <h3
          id={elementId}
          className={`text-sm font-semibold tracking-tight text-text-primary pt-5 pb-1 flex items-baseline justify-between group scroll-mt-20 ${className}`}
        >
          <span>{children || text}</span>
          {anchorLink}
        </h3>
      );
  }
}
