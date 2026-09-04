import React from 'react';
import { Folder, FileCode } from 'lucide-react';

export interface FileTreeBlockProps {
  tree: string;
  title?: string;
  className?: string;
}

export function FileTreeBlock({
  tree,
  title = 'Filesystem Hierarchy',
  className = '',
}: FileTreeBlockProps) {
  const lines = (tree || '').split('\n').filter((l) => l.trim().length > 0);

  return (
    <div className={`my-4 p-3.5 rounded border border-border bg-surface font-mono text-xs space-y-2 overflow-x-auto ${className}`}>
      <div className="text-[11px] text-text-secondary font-semibold uppercase tracking-wider pb-1.5 border-b border-border flex items-center gap-1.5 select-none">
        <Folder className="w-3.5 h-3.5 text-accent" />
        <span>{title}</span>
      </div>

      <div className="text-text-primary text-[11px] leading-relaxed pt-1 space-y-1 font-mono">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          const isDir = trimmed.endsWith('/') || !trimmed.includes('.');
          // Count leading spaces or indentation symbols
          const indentMatch = line.match(/^([ │├└─\t]+)/);
          const indent = indentMatch ? indentMatch[0] : '';
          const name = line.slice(indent.length).trim();

          return (
            <div key={idx} className="flex items-center gap-1.5 whitespace-pre">
              {indent && <span className="text-text-secondary/60 select-none">{indent}</span>}
              {isDir ? (
                <Folder className="w-3 h-3 text-accent shrink-0 select-none" />
              ) : (
                <FileCode className="w-3 h-3 text-text-secondary shrink-0 select-none" />
              )}
              <span className={isDir ? 'text-text-primary font-medium' : 'text-text-secondary'}>
                {name || trimmed}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
